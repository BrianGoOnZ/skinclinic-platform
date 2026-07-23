import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const test = async () => {
  try {
    const result = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        MaxKeys: 5,
      }),
    );
    console.log("✅ Conexión exitosa. Objetos encontrados:", result.KeyCount);
  } catch (err) {
    console.error("❌ Error:", err.name, "-", err.message);
  }
};

test();
