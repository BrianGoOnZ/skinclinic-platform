import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// BullMQ requiere maxRetriesPerRequest: null en la conexión dedicada
const queueRedisConnection = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

export default queueRedisConnection;
