export interface TryOnRequestPayload {
  modelImage: string;      // base64 encoded image
  tshirtImage: string;     // base64 encoded image
  generateVideo: boolean;  // whether to generate a video preview
}

export interface TryOnApiResponse {
  imageUrl: string;        // URL of the generated try-on image
  videoUrl?: string | null; // Optional URL of the generated video
  generationTimeMs?: number; // Optional generation time
}

export interface HistoryItem {
  id: string;
  imageUrl: string;
  videoUrl?: string | null;
  timestamp: number;
  originalModelImage?: string; // Store for comparison
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
}
