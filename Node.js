const express = require('express');
const session = require('express-session');
const app = express();

// Parse incoming request bodies
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

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

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
