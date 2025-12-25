export enum ConversionStyle {
  EXACT = 'EXACT',
  SIMPLIFIED = 'SIMPLIFIED',
  WIREFRAME = 'WIREFRAME',
}

export interface ProcessingState {
  status: 'IDLE' | 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  message?: string;
}

export interface GeneratedSVG {
  code: string;
  timestamp: number;
}