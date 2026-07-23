const express = require('express');
const session = require('express-session');
const app = express();

const MORSE_SEQUENCES = {
    'top-left': '.... . .-.. .-.. ---',      // HELLO
    'top-right': '... --- ...',               // SOS
    // etc.
};

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

/* ========================================
   MORSE CODE FLICKER SEQUENCE MAPPING
   
   Define your morse code sequences here.
   Each flicker section (top-left, top-right, middle-left, middle-right, bottom-left, bottom-right)
   gets its own morse sequence that plays continuously.
   
   Morse code format:
   - "." = dot (short flash)
   - "-" = dash (long flash)
   - "/" = letter separator (pause between letters)
   - " " = word separator (longer pause)
   
   Example: ".... . .-.. .-.. ---" = "HELLO"
   
   The flickers will cycle through the 4-second loop.
   Adjust timing in look.css if needed.
   ======================================== */

const MORSE_SEQUENCES = {
    'top-left': '.... . .-.. .-.. ---',      // HELLO
    'top-right': '... --- ...',               // SOS
    'middle-left': '.-.-.-',                  // Error/repeating
    'middle-right': '.... . -.-- -.--',       // HEYY
    'bottom-left': '--. --- --- -..   .-..-- ..-.', // GOOD LY
    'bottom-right': '-.-- . ...'              // YET
};

/* ========================================
   FLICKER TIMING CONFIGURATION
   
   Map morse code to CSS animation keyframes.
   Each section has a base timing offset in the 4-second cycle.
   
   Sections and their base offsets:
   - top-left: 8-12% (320-480ms into 4s cycle)
   - top-right: 25-35% (1000-1400ms)
   - middle-left: 50-60% (2000-2400ms)
   - middle-right: 75-85% (3000-3400ms)
   - bottom-left: 10-20% (400-800ms)
   - bottom-right: 40-50% (1600-2000ms)
   ======================================== */

const FLICKER_CONFIG = {
    'top-left': { offset: 10, duration: 4000 },
    'top-right': { offset: 33, duration: 4000 },
    'middle-left': { offset: 58, duration: 4000 },
    'middle-right': { offset: 83, duration: 4000 },
    'bottom-left': { offset: 18, duration: 4000 },
    'bottom-right': { offset: 48, duration: 4000 }
};

// Helper function to convert morse code to CSS animation keyframes
function morseToKeyframes(morseCode, sectionName) {
    // This would be sent to client-side JavaScript to dynamically generate keyframes
    // For now, the morse sequences are stored and can be read by frontend
    return {
        section: sectionName,
        morse: morseCode,
        config: FLICKER_CONFIG[sectionName]
    };
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/morse-sequences', (req, res) => {
    // Endpoint to fetch morse sequences for dynamic animation generation
    res.json(MORSE_SEQUENCES);
});

app.get('/api/flicker-config', (req, res) => {
    // Endpoint to fetch flicker configuration
    res.json(FLICKER_CONFIG);
});

app.post('/login', (req, res) => {
    const { uname, psw } = req.body;
    
    // Check against database (not hardcoded!)
    if (uname === "XLTL3902SEADMIN" && psw === "CULLEDENERGY") {
        // Create secure session
        req.session.authenticated = true;
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
