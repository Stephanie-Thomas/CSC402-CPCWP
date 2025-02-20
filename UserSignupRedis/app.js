// app.js
import express from 'express';
import sessionMiddleware from './Config/sessionStore.js';
import './Config/mongoClient.js'; // Establishes the MongoDB connection
import User from './Config/userModel.js';

const app = express();
const port = 3000;

app.use(sessionMiddleware);
app.use(express.json());

// Signup endpoint: Create a new user in MongoDB
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }
  
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Create a new user (password should be hashed in production)
    const newUser = new User({ username, password });
    await newUser.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login: Creates a session and stores it in Redis
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simplified validation; in a real app, check the password against the hashed password stored in MongoDB.
  if (username !== 'admin' || password !== 'admin') {
    return res.status(401).send('Invalid Username or Password');
  }
  
  req.session.user = { username, userId: 1 };
  res.send('Login Successful');
});

// Logout: Destroys the session in Redis
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.clearCookie('connect.sid');
    res.send('Logout Successful');
  });
});

// Home: Checks if the session is valid
app.get('/home', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Invalid session');
  }
  res.send({ sessionData: req.session.user });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
