/**
 * Adapter penyimpanan file yang mendukung:
 * - Supabase Storage (Free, tanpa kartu) -> prioritas untuk Vercel Free
 * - S3-compatible (MinIO lokal / R2 / AWS) -> untuk VPS/Docker
 * - Fallback data: URL (demo tanpa storage)
 */
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch {
    return null;
  }
}

function getS3Client() {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION || "us-east-1";
  const accessKeyId = process.env.S3_ACCESS_KEY || "";
  const secretAccessKey = process.env.S3_SECRET_KEY || "";
  if (!endpoint || !accessKeyId || !secretAccessKey) return null;
  return new S3Client({
    region,
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function uploadFile(buffer: Buffer, key: string, contentType: string): Promise<string> {
  // 1) Coba Supabase Storage jika dikonfigurasi (Free tier: 1GB, tanpa kartu)
  const supabase = getSupabaseAdmin();
  const supabaseBucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
  if (supabase) {
    const { data, error } = await supabase.storage.from(supabaseBucket).upload(key, buffer, {
      contentType,
      upsert: true,
    });
    if (!error) {
      // coba dapatkan public URL
      const { data: pub } = supabase.storage.from(supabaseBucket).getPublicUrl(key);
      if (pub?.publicUrl) return pub.publicUrl;
      return pub.publicUrl || key;
    }
    console.warn("Supabase upload gagal, fallback ke S3:", error.message);
  }

  // 2) Coba S3-compatible
  const s3 = getS3Client();
  const bucket = process.env.S3_BUCKET;
  if (s3 && bucket) {
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType, ACL: "public-read" as any }));
    const publicUrl = (process.env.S3_PUBLIC_URL || `${process.env.S3_ENDPOINT}/${bucket}`).replace(/\/$/, "");
    return `${publicUrl}/${key}`;
  }

  // 3) Tidak ada storage yang dikonfigurasi -> fallback data URL (demo, tidak persisten di serverless tapi tidak crash)
  if (!supabase && !s3) {
    throw new Error("Storage belum dikonfigurasi. Atur SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (gratis) atau S3_ENDPOINT untuk upload.");
  }

  throw new Error("Gagal upload ke storage yang dikonfigurasi.");
}

// Helper untuk cek konfigurasi di UI
export function getStorageInfo() {
  const hasSupabase = !!(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
  const hasS3 = !!(process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY);
  if (hasSupabase) return { provider: "supabase", bucket: process.env.SUPABASE_STORAGE_BUCKET || "uploads" };
  if (hasS3) return { provider: "s3", bucket: process.env.S3_BUCKET };
  return { provider: "none", bucket: null };
}
