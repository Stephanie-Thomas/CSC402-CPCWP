// config.js
export default {
    SESSION_SECRET: process.env.SESSION_SECRET || 'super-secret-key',
    // 7 days in milliseconds
    SESSION_LIFETIME: process.env.SESSION_LIFETIME || 7 * 24 * 60 * 60 * 1000,
    REDIS: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || null,
    },
    COOKIE: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
    MONGODB: {
      // This example uses the default MongoDB port (27017) and a database named "users"
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/users',
    },
  };
  