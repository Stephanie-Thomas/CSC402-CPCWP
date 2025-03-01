import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Render will provide the port

app.use(cors());
app.use(express.json());

// ✅ Root Route to verify backend is running
app.get("/", (req, res) => {
    res.send("Backend is running! Use /api/codeforces/{username} to fetch data.");
});

// ✅ API Route: Fetch Codeforces user data
app.get("/api/codeforces/:username", async (req, res) => {
    const username = req.params.username;
    const apiUrl = `https://codeforces.com/api/user.info?handles=${username}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== "OK") {
            throw new Error(data.comment || "Unknown error from Codeforces API");
        }

        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: error.message || "Failed to fetch Codeforces data" });
    }
});

// ✅ Start Server on the Correct Port
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
