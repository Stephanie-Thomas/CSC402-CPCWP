import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';

const app = express();
const port = 3000;

// Initialize Redis client
const redisClient = new Redis();

// Configure session middleware
app.use(
  session({
    store: new RedisStore({
      client: redisClient,  // Pass the Redis client instance
      disableTouch: true,   // Disable automatic "touching" of sessions
    }),
    secret: 'super-secret-key',  // Secret key for signing session ID cookie
    resave: false,               // Prevents unnecessary session saving
    saveUninitialized: false,    // Avoid saving empty sessions
    cookie: {
      httpOnly: true,  // Prevents JavaScript access to cookies
      secure: false,   // Set `true` in production (requires HTTPS)
      maxAge: 10000, // Session expiration time in milliseconds (1 hour)
    },
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// Login - Creates a session and stores it in Redis
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== 'admin' || password !== 'admin') {
    return res.status(401).send('Invalid Username or Password');
  }

  // Store user data in session
  req.session.user = { username, userId: 1 };

  res.send('Login Successful');
});

// Logout - Destroys the session in Redis
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.clearCookie('connect.sid'); // Remove session cookie
    res.send('Logout Successful');
  });
});

// Home - Checks if the session is valid
app.get('/home', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Invalid session');
  }

  res.send({ sessionData: req.session.user });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
