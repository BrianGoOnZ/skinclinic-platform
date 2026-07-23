import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import s3Client from "../config/s3.js";

const BUCKET = process.env.AWS_S3_BUCKET_NAME;
const PRESIGNED_URL_EXPIRY_SECONDS = 60 * 15; // 15 minutos

export const buildObjectKey = (folder) => {
  const uniqueName = crypto.randomBytes(16).toString("hex");
  return `${folder}/${uniqueName}.webp`;
};

export const uploadBufferToS3 = async (
  buffer,
  key,
  contentType = "image/webp",
) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    // Sin ACL: el bucket tiene bloqueo de acceso público activado y
    // "Bucket owner enforced" no admite ACLs por objeto.
  });

  await s3Client.send(command);
  return key;
};

export const deleteFromS3 = async (key) => {
  if (!key) return;
  const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
  await s3Client.send(command);
};

export const getPresignedUrl = async (key) => {
  if (!key) return null;
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRY_SECONDS,
  });
};
