import { Queue } from "bullmq";
import queueRedisConnection from "../config/queueRedis.js";

export const whatsappQueue = new Queue("whatsapp-reminders", {
  connection: queueRedisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
