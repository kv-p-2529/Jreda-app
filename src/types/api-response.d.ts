declare module 'api-response' {
  export interface ApiResponse<T = null> {
    success: boolean;
    data: T | null;
    error?: string;
  }
}