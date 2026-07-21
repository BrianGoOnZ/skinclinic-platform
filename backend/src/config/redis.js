import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 100, 3000),
});

redisClient.on("connect", () => {
  console.log("Conexión exitosa con Redis");
});

redisClient.on("error", (err) => {
  console.error("Error de conexión con Redis:", err.message);
});

export default redisClient;
