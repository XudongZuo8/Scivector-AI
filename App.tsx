import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { SvgPreview } from './components/SvgPreview';
import { Controls } from './components/Controls';
import { convertImageToSvg } from './services/geminiService';
import { ConversionStyle, ProcessingState, GeneratedSVG } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionStyle, setConversionStyle] = useState<ConversionStyle>(ConversionStyle.EXACT);
  const [prompt, setPrompt] = useState<string>('');
  const [processingState, setProcessingState] = useState<ProcessingState>({ status: 'IDLE' });
  const [svgData, setSvgData] = useState<GeneratedSVG | null>(null);

  const handleConvert = async () => {
    if (!selectedFile) return;

    setProcessingState({ status: 'PROCESSING' });
    setSvgData(null);

    try {
      const svgCode = await convertImageToSvg(selectedFile, conversionStyle, prompt);
      setSvgData({
        code: svgCode,
        timestamp: Date.now(),
      });
      setProcessingState({ status: 'COMPLETED' });
    } catch (error: any) {
      setProcessingState({ 
        status: 'ERROR', 
        message: error.message || '发生了意外错误。' 
      });
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setSvgData(null);
    setProcessingState({ status: 'IDLE' });
    setPrompt('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      <Header />
      
      <main className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Main Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          <div className="pattern-grid absolute inset-0 opacity-20 pointer-events-none" />
          
          <div className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col gap-6 lg:gap-0 lg:grid lg:grid-cols-2 lg:divide-x lg:divide-slate-800 z-10">
            
            {/* Left: Input */}
            <div className="h-full lg:pr-6 overflow-hidden">
               <ImageUploader 
                 selectedFile={selectedFile} 
                 onFileSelect={setSelectedFile}
                 onClear={handleClear}
               />
            </div>

            {/* Right: Output */}
            <div className="h-full lg:pl-6 overflow-hidden mt-6 lg:mt-0">
               {processingState.status === 'ERROR' ? (
                 <div className="h-full flex items-center justify-center border-2 border-dashed border-red-900/50 bg-red-950/10 rounded-xl p-6">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-red-400 mb-2">转换失败</h3>
                      <p className="text-sm text-red-300/70 max-w-md">{processingState.message}</p>
                      <button 
                        onClick={() => setProcessingState({ status: 'IDLE' })}
                        className="mt-4 px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-200 rounded-lg text-sm transition-colors"
                      >
                        重试
                      </button>
                    </div>
                 </div>
               ) : (
                 <SvgPreview 
                   svgData={svgData} 
                   isLoading={processingState.status === 'PROCESSING'} 
                 />
               )}
            </div>

          </div>
        </div>

        {/* Sidebar Controls */}
        <Controls 
          style={conversionStyle}
          setStyle={setConversionStyle}
          prompt={prompt}
          setPrompt={setPrompt}
          onConvert={handleConvert}
          isProcessing={processingState.status === 'PROCESSING'}
          canConvert={!!selectedFile}
        />

      </main>
    </div>
  );
};

export default App;