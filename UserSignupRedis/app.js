// app.js
import express from 'express';
import sessionMiddleware from './sessionStore.js';

const app = express();
const port = 3000;

// Use the session middleware
app.use(sessionMiddleware);

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
