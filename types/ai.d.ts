export type PracticeMode = "ielts" | "interview" | "communication";

export interface AIResponse {
  sessionId: string;
  transcript: string;
  score?: number; 
  metrics?: {
    fluency: number;
    pronunciation: number;
    grammar: number;
    vocabulary: number;
    confidence?: number;
  };
  tips?: string[];
  timestamp: string;
}
