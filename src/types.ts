export type Visibility = "public" | "expiring" | "private";

export interface UploadOptions {
  visibility: Visibility;
  ttl?: number;
  json?: boolean;
}

export interface UploadResponse {
  id: string;
  url: string;
  visibility: Visibility;
  size: number;
  type: string;
  expires_at: string | null;
  created_at: string;
}
