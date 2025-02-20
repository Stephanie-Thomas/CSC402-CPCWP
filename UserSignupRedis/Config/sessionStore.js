// sessionStore.js
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import redisClient from './redisClient.js';
import config from './config.js';

const sessionMiddleware = session({
  store: new RedisStore({
    client: redisClient,
    disableTouch: true, // Prevents automatic refreshing of session expiration
  }),
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: config.SESSION_LIFETIME,
    httpOnly: true,
    secure: config.COOKIE.secure,
    sameSite: config.COOKIE.sameSite,
  },
});

export default sessionMiddleware;
