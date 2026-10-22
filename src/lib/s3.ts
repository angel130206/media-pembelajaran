import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export function getS3Client() {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION || "us-east-1";
  const accessKeyId = process.env.S3_ACCESS_KEY || "";
  const secretAccessKey = process.env.S3_SECRET_KEY || "";
  if (!endpoint) return null;
  return new S3Client({
    region,
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function uploadToS3(file: Buffer, key: string, contentType: string) {
  const client = getS3Client();
  const bucket = process.env.S3_BUCKET!;
  if (!client) throw new Error("S3 belum dikonfigurasi");
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: file, ContentType: contentType, ACL: "public-read" as any }));
  const publicUrl = (process.env.S3_PUBLIC_URL || `${process.env.S3_ENDPOINT}/${bucket}`).replace(/\/$/, "");
  return `${publicUrl}/${key}`;
}
