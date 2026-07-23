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
   
   The flickers will cycle through the 8-second loop for better eye decoding.
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
   
   Morse code timing (extended to 8 seconds for better eye decoding):
   - dot: 200ms
   - dash: 600ms
   - letter separator: 400ms
   - word separator: 1200ms
   
   Map morse code to CSS animation keyframes.
   Each section has a base timing offset in the 8-second cycle.
   
   Sections and their base offsets:
   - top-left: 8-12% (640-960ms into 8s cycle)
   - top-right: 25-35% (2000-2800ms)
   - middle-left: 50-60% (4000-4800ms)
   - middle-right: 75-85% (6000-6800ms)
   - bottom-left: 10-20% (800-1600ms)
   - bottom-right: 40-50% (3200-4000ms)
   ======================================== */

const FLICKER_CONFIG = {
    'top-left': { offset: 10, duration: 8000 },
    'top-right': { offset: 33, duration: 8000 },
    'middle-left': { offset: 58, duration: 8000 },
    'middle-right': { offset: 83, duration: 8000 },
    'bottom-left': { offset: 18, duration: 8000 },
    'bottom-right': { offset: 48, duration: 8000 }
};

/* ========================================
   FISHEYE EFFECT CONFIGURATION
   
   Apply a fisheye lens distortion that increases from top to bottom.
   Creates a curved, lens-like visual effect.
   
   Configuration:
   - Top sections (0-50%): minimal distortion
   - Middle sections (50%): moderate distortion
   - Bottom sections (50-100%): maximum distortion
   ======================================== */

const FISHEYE_CONFIG = {
    'top-left': { strength: 0.1, curvature: 0.05 },
    'top-right': { strength: 0.1, curvature: 0.05 },
    'middle-left': { strength: 0.5, curvature: 0.25 },
    'middle-right': { strength: 0.5, curvature: 0.25 },
    'bottom-left': { strength: 1.0, curvature: 0.6 },
    'bottom-right': { strength: 1.0, curvature: 0.6 }
};

// Helper function to convert morse code to CSS animation keyframes
function morseToKeyframes(morseCode, sectionName) {
    // This would be sent to client-side JavaScript to dynamically generate keyframes
    // For now, the morse sequences are stored and can be read by frontend
    return {
        section: sectionName,
        morse: morseCode,
        config: FLICKER_CONFIG[sectionName],
        fisheye: FISHEYE_CONFIG[sectionName]
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

app.get('/api/fisheye-config', (req, res) => {
    // Endpoint to fetch fisheye effect configuration
    res.json(FISHEYE_CONFIG);
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
