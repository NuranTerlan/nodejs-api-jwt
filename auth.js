const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();


// configurations for express application
app.use(bodyParser.json());
app.listen(3000, () => {
    console.log("Authentication service started on port 3000 !");
});


// app request methods
app.post("/login", (req, res) => {
    // destructure username and password inputs from request body
    const { username, password } = req.body;

    // let's filter to find current user by these input values
    const user = users.find(user => { return user.username === username && user.password === password });

    if (user) { // truthy value if user exists
        // generating access token
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: "20m" });
        const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);
        refreshTokens.push(refreshToken);

        res.json({ accessToken, refreshToken });
    } else {
        res.send("Username or password incorret. If you don't have account, register please");
    }
});

app.post("/logout", (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);

    res.send("You are logged out");
});

app.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: "20m" });

        res.json({ accessToken });
    });
});


// external dummy data and environment variables
const users = [
    {
        username: 'Nuran',
        password: 'nuran123admin',
        role: 'admin'
    }, 
    {
        username: 'Mahir',
        password: 'mahir123member',
        role: 'member'
    }
];

const accessTokenSecret = "youraccesstokensecret"; // it should be in .env file
const refreshTokenSecret = 'yourrefreshtokensecrethere'; // it should be in .env file
const refreshTokens = [];