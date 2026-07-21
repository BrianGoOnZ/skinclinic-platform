import redisClient from "../config/redis.js";

// Middleware genérico de caché para respuestas GET.
// keyPrefix agrupa las llaves para poder invalidarlas juntas después
// (ej. "services" cachea todas las variantes de query de /services).
export const cacheMiddleware = (keyPrefix, ttlSeconds = 60) => {
  return async (req, res, next) => {
    const cacheKey = `${keyPrefix}:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error("Error al leer cache de Redis:", error.message);
      // Si Redis falla, seguimos sin cache en vez de tumbar la petición
      return next();
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      redisClient
        .set(cacheKey, JSON.stringify(body), "EX", ttlSeconds)
        .catch((error) =>
          console.error("Error al guardar cache en Redis:", error.message),
        );
      return originalJson(body);
    };

    next();
  };
};

// Borra todas las llaves bajo un prefijo. Se llama tras cualquier
// escritura (create/update/delete) que invalide ese cache.
export const invalidateCache = async (keyPrefix) => {
  try {
    const keys = await redisClient.keys(`${keyPrefix}:*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error("Error al invalidar cache de Redis:", error.message);
  }
};
