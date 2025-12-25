import React, { useState, useEffect } from 'react';
import { Download, Copy, Code, Eye, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { GeneratedSVG } from '../types';

interface SvgPreviewProps {
  svgData: GeneratedSVG | null;
  isLoading: boolean;
}

export const SvgPreview: React.FC<SvgPreviewProps> = ({ svgData, isLoading }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [zoom, setZoom] = useState(100);

  // Reset zoom when new data arrives
  useEffect(() => {
    if (svgData) setZoom(100);
  }, [svgData]);

  const handleDownload = () => {
    if (!svgData) return;
    const blob = new Blob([svgData.code], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sci-vector-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (svgData) {
      navigator.clipboard.writeText(svgData.code);
      alert('SVG 代码已复制到剪贴板');
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
         <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">矢量图输出</h2>
        </div>
        <div className="flex-1 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/30 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-science-500/30 border-t-science-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-science-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-science-400 font-medium animate-pulse">Gemini Pro 正在思考...</p>
          <p className="text-xs text-slate-500 mt-2">正在解析图表结构并生成可编辑文字</p>
        </div>
      </div>
    );
  }

  if (!svgData) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">矢量图输出</h2>
        </div>
        <div className="flex-1 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/30 flex items-center justify-center">
          <p className="text-slate-500 text-sm">上传图片并开始转换以查看结果</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">矢量图输出</h2>
        <div className="flex bg-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'preview' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <div className="flex items-center"><Eye className="w-3 h-3 mr-1.5"/> 预览</div>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'code' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <div className="flex items-center"><Code className="w-3 h-3 mr-1.5"/> 代码</div>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden relative group">
        
        {viewMode === 'preview' ? (
           <div className="w-full h-full overflow-auto flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
             {/* Render SVG safely */}
             <div 
               className="transition-transform duration-200 ease-out origin-center shadow-2xl bg-white/5 backdrop-blur-sm rounded-lg"
               style={{ transform: `scale(${zoom / 100})` }}
               dangerouslySetInnerHTML={{ __html: svgData.code }} 
             />
             
             {/* Zoom Controls */}
             <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur border border-slate-600 rounded-lg flex items-center p-1 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setZoom(z => Math.max(10, z - 10))} className="p-1 hover:bg-slate-700 rounded text-slate-300">-</button>
                <span className="text-xs font-mono w-12 text-center text-slate-300">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(500, z + 10))} className="p-1 hover:bg-slate-700 rounded text-slate-300">+</button>
             </div>
           </div>
        ) : (
          <div className="w-full h-full overflow-hidden">
            <textarea 
              readOnly 
              className="w-full h-full bg-slate-900 text-slate-300 font-mono text-xs p-4 resize-none focus:outline-none"
              value={svgData.code}
            />
          </div>
        )}

      </div>

      <div className="mt-4 flex space-x-3">
        <Button onClick={handleDownload} className="flex-1" icon={<Download className="w-4 h-4"/>}>
          下载 SVG
        </Button>
        <Button variant="outline" onClick={handleCopy} icon={<Copy className="w-4 h-4"/>}>
          复制代码
        </Button>
      </div>
    </div>
  );
};