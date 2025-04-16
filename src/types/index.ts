// src/types/index.ts
export interface Expense {
    id: string;
    description: string;
    amount: number;
    date: string; // Changed to mandatory string (ISO format YYYY-MM-DD)
    store?: string;
  }
  
  export interface VisionApiResponse {
      textAnnotations?: { description: string; boundingPoly?: any; }[];
      fullTextAnnotation?: { text: string; /* ... more details */ };
      error?: { message: string; /* ... more details */ };
  }
  
  export interface ParsedOcrResult {
      amount: number | null;
      description: string;
      date: string | null; // Extracted date string or null
  }