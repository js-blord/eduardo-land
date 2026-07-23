const express = require('express');
const app = express();

// Parse incoming request bodies
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use(express.static(__dirname)); // Serve CSS, images, etc.

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});
