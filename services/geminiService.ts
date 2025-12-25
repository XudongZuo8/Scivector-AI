import { GoogleGenAI } from "@google/genai";
import { ConversionStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const convertImageToSvg = async (
  file: File,
  style: ConversionStyle,
  additionalPrompt?: string
): Promise<string> => {
  try {
    const base64Data = await fileToGenerativePart(file);

    let stylePrompt = "";
    switch (style) {
      case ConversionStyle.EXACT:
        stylePrompt = "Strictly preserve the original layout and colors. CRITICAL: All text labels must be recognized and generated as editable <text> elements, NOT paths. Use standard fonts (Arial, Helvetica) for maximum compatibility with research papers.";
        break;
      case ConversionStyle.SIMPLIFIED:
        stylePrompt = "Simplify the diagram for clarity. Flatten gradients to solid colors, straighten hand-drawn lines, and align uneven elements. Ensure all text is editable <text>.";
        break;
      case ConversionStyle.WIREFRAME:
        stylePrompt = "Create a schematic black-and-white wireframe. Remove all fill colors. Use clean strokes for boxes and arrows. All text must be editable black <text>.";
        break;
    }

    // Enhanced prompt specifically for Scientific Paper usage
    const prompt = `
      You are an expert Scientific Illustrator and SVG Developer specializing in academic publications.
      
      User Goal: The user needs to convert the attached raster image (likely a neural network architecture, flowchart, or data plot) into a fully editable SVG to include in a research paper.
      
      CRITICAL REQUIREMENTS FOR EDITABILITY:
      1. **Text as Text**: NEVER trace text as shapes/paths. You MUST use <text> elements. If the font is unknown, use generic "Arial, sans-serif".
      2. **Grouping**: Logically group related elements (e.g., a rectangle box and the text inside it) using <g> tags.
      3. **Clean Shapes**: Use <rect>, <circle>, and <path> for arrows. Ensure lines connecting boxes are straight and orthogonal where appropriate.
      4. **Layering**: Ensure text is always on top of background shapes.
      
      Task:
      1. Analyze the structure of the scientific diagram.
      2. Recreate it as a high-quality SVG.
      3. ${stylePrompt}
      4. ${additionalPrompt ? `Specific user instructions: ${additionalPrompt}` : ''}
      
      Output Format:
      - Return ONLY the raw SVG code.
      - Start directly with <svg ...>
      - End with </svg>
      - Do not wrap in markdown blocks.
    `;

    // Using Gemini 3 Pro with Thinking Config for complex diagram reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: file.type,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        // Budgeting tokens for the model to "plan" the SVG structure and coordinate extraction
        thinkingConfig: { thinkingBudget: 4096 }, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    // Clean up potential markdown formatting if the model disobeys
    const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/);
    return svgMatch ? svgMatch[0] : text;

  } catch (error) {
    console.error("Gemini conversion error:", error);
    throw new Error("Failed to convert image to SVG. Please try again.");
  }
};