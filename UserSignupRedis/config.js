// config.js
export default {
    SESSION_SECRET: process.env.SESSION_SECRET || 'super-secret-key',
    // Session lifetime: 7 days in milliseconds
    SESSION_LIFETIME: process.env.SESSION_LIFETIME || 7 * 24 * 60 * 60 * 1000,
    REDIS: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || null,
    },
    COOKIE: {
      // Use secure cookies in production
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  };
  