const express = require('express');
const app = express();

app.post('/login', (req, res) => {
    const { uname, psw } = req.body;
    
    // Check against database (not hardcoded!)
    if (uname === "XLTL3902SEADMIN" && psw === "CULLEDENERGY") {
        // Create secure session
        req.session.authenticated = true;
        res.redirect('/dashboard');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.get('/login', (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <input type="text" name="uname" placeholder="Username" required>
            <input type="password" name="psw" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    `);
});
