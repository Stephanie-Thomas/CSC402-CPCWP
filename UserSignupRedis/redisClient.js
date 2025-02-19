// redisClient.js
import Redis from 'ioredis';
import config from './config.js';

const redisClient = new Redis({
  host: config.REDIS.host,
  port: config.REDIS.port,
  password: config.REDIS.password,
});

redisClient.on('error', (err) =>
  console.error('Redis Client Error:', err)
);

redisClient.on('connect', () =>
  console.log('Redis connected')
);

export default redisClient;
