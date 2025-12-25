import React from 'react';
import { Network, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-science-600 to-indigo-500 p-2 rounded-lg shadow-lg shadow-science-900/20">
            <Network className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
              SciVector <span className="text-science-500 ml-1">AI</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">位图转矢量图工具</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-science-400 border border-slate-700">
            <Sparkles className="w-3 h-3 mr-1" />
            Gemini 3 驱动
          </span>
          <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
            文档
          </a>
        </div>
      </div>
    </header>
  );
};