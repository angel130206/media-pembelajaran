// Deprecated: gunakan src/lib/storage.ts yang mendukung Supabase + S3
// File ini dipertahankan untuk kompatibilitas Docker lama.
export * from "./storage";
import { uploadFile } from "./storage";
export const uploadToS3 = uploadFile;
