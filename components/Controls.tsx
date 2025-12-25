import React from 'react';
import { Settings, Zap, Edit3, Grid } from 'lucide-react';
import { ConversionStyle } from '../types';
import { Button } from './Button';

interface ControlsProps {
  style: ConversionStyle;
  setStyle: (style: ConversionStyle) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  onConvert: () => void;
  isProcessing: boolean;
  canConvert: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ 
  style, 
  setStyle, 
  prompt, 
  setPrompt, 
  onConvert, 
  isProcessing,
  canConvert
}) => {
  return (
    <div className="bg-slate-900 border-t border-slate-800 lg:border-t-0 lg:border-l lg:w-80 p-6 flex flex-col gap-6 overflow-y-auto">
      
      <div>
        <h3 className="text-sm font-semibold text-white flex items-center mb-4">
          <Settings className="w-4 h-4 mr-2 text-science-500" />
          设置
        </h3>
        
        <label className="text-xs text-slate-400 font-medium mb-2 block">转换风格</label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => setStyle(ConversionStyle.EXACT)}
            className={`flex items-center p-3 rounded-lg border transition-all text-left ${style === ConversionStyle.EXACT ? 'bg-science-900/30 border-science-500/50 text-science-100' : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-700'}`}
          >
            <Zap className={`w-4 h-4 mr-3 ${style === ConversionStyle.EXACT ? 'text-science-400' : 'text-slate-500'}`} />
            <div>
              <div className="text-xs font-semibold">论文级高保真</div>
              <div className="text-[10px] opacity-70">全文本可编辑，保留原图配色</div>
            </div>
          </button>
          
          <button
            onClick={() => setStyle(ConversionStyle.SIMPLIFIED)}
            className={`flex items-center p-3 rounded-lg border transition-all text-left ${style === ConversionStyle.SIMPLIFIED ? 'bg-science-900/30 border-science-500/50 text-science-100' : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-700'}`}
          >
            <Edit3 className={`w-4 h-4 mr-3 ${style === ConversionStyle.SIMPLIFIED ? 'text-science-400' : 'text-slate-500'}`} />
             <div>
              <div className="text-xs font-semibold">简化/扁平化</div>
              <div className="text-[10px] opacity-70">优化线条，适合重制旧图</div>
            </div>
          </button>

          <button
            onClick={() => setStyle(ConversionStyle.WIREFRAME)}
            className={`flex items-center p-3 rounded-lg border transition-all text-left ${style === ConversionStyle.WIREFRAME ? 'bg-science-900/30 border-science-500/50 text-science-100' : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-700'}`}
          >
            <Grid className={`w-4 h-4 mr-3 ${style === ConversionStyle.WIREFRAME ? 'text-science-400' : 'text-slate-500'}`} />
             <div>
              <div className="text-xs font-semibold">黑白线框</div>
              <div className="text-[10px] opacity-70">仅保留结构，方便二次填色</div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex-1">
        <label className="text-xs text-slate-400 font-medium mb-2 block">额外指令 (Prompt)</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例如：请确保所有方框对齐；将所有‘Conv2D’文字改为红色；移除背景底色..."
          className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-science-500 focus:ring-1 focus:ring-science-500 transition-all resize-none"
        />
        <p className="text-[10px] text-slate-500 mt-2">
          提示：为获得最佳修改体验，请在指令中强调“保持所有文字可编辑”。
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <Button 
          onClick={onConvert} 
          isLoading={isProcessing} 
          disabled={!canConvert}
          className="w-full py-3 text-base shadow-science-500/20"
          icon={<Zap className="w-4 h-4" />}
        >
          {isProcessing ? '正在重构 SVG...' : '开始转换'}
        </Button>
      </div>
    </div>
  );
};