import Redis from 'ioredis';
import { logger } from '../utils/logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on('connect', () => logger.info('✅ Connected to Redis'));
redis.on('error', (err) => logger.warn(`⚠️ Redis error (continuing without cache): ${err.message}`));

// Cache helpers
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch {
    return null;
  }
};

export const setCache = async (key: string, value: unknown, ttlSeconds = 300): Promise<void> => {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // Fail silently — caching is non-critical
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch {}
};

export const deleteCachePattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch {}
};
