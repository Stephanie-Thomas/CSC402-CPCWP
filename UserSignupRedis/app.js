const express = require("express")
const app = express()
const uuidv4 = require("uuid").v4

const port = 3000;
app.use(express.json());
const sessions = {}

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username !== "admin" || password !== "admin") {
        return res.status(401).send("Invalid Username or password");
    }
    const sessionId = uuidv4();
    sessions[sessionId] = {username, userId: 1};
    res.set("Set-Cookie", `session=${sessionId}`);
    res.send("Success")
});

app.post('/logout', (req, res) => {
    const sessionId = req.headers.cookie?.split("=")[1];
    delete sessions[sessionId];
    res.set("Set-Cookie", `session=`);
    res.send("Success")
});


app.get("/home", (req, res) => {
    const sessionId = req.headers.cookie?.split("=")[1];
    const userSession = sessions[sessionId];
    if(!userSession){
        return res.status(401).send("Invalid sessions");
    }
    const userId = userSession.userId;
    res.send([{
        userSession,
        sessionId
    }]);
});



app.listen(3000)
