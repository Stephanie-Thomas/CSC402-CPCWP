const express = require("express");
const app = express();
const uuidv4 = require("uuid").v4;
const Redis = require("ioredis");

const redis = new Redis(); // Connect to Redis on localhost:6379

const port = 3000;
app.use(express.json()); // Middleware to parse JSON request bodies

// Login Endpoint - Authenticates user and creates a session
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate credentials (hardcoded for demonstration purposes)
    if (username !== "admin" || password !== "admin") {
        return res.status(401).send("Invalid Username or password");
    }

    // Generate a unique session ID
    const sessionId = uuidv4();
    const sessionData = JSON.stringify({ username, userId: 1 });

    // Store session in Redis with a 1-hour expiration time (3600 seconds)
    await redis.setex(`session:${sessionId}`, 3600, sessionData);

    // Set session ID in an HTTP-only cookie for security
    res.set("Set-Cookie", `session=${sessionId}; HttpOnly`);
    res.send("Success");
});

// Logout Endpoint - Deletes user session from Redis
app.post('/logout', async (req, res) => {
    // Extract session ID from cookies
    const sessionId = req.headers.cookie?.split("=")[1];

    if (sessionId) {
        await redis.del(`session:${sessionId}`); // Remove session from Redis
    }

    // Clear cookie by setting it with Max-Age=0
    res.set("Set-Cookie", "session=; HttpOnly; Max-Age=0");
    res.send("Success");
});

// Home Endpoint - Validates session and returns user data
app.get("/home", async (req, res) => {
    // Extract session ID from cookies
    const sessionId = req.headers.cookie?.split("=")[1];

    if (!sessionId) {
        return res.status(401).send("Invalid session");
    }

    // Retrieve session data from Redis
    const sessionData = await redis.get(`session:${sessionId}`);

    if (!sessionData) {
        return res.status(401).send("Invalid session");
    }

    // Parse session data and send response
    const userSession = JSON.parse(sessionData);
    res.send([{ userSession, sessionId }]);
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
