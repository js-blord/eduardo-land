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

const AUTO_SEQUENCES = {
    'top-left': '..-/-./-.-/-./---/.--/-. -.-./---/-./-././-.-./-/../---/-.',      // UNKNOWN CONNECTION
    'top-right': '-.-./---/--/-- ./.../-/.-/-.../.-../../.../...././-..',               // COMM ESTABLISHED
    'middle-left': '...././.-../.-../--- ...././.-./---/./...',                  // HELLO HEROES
    'middle-right': '.-/-./-.. .--/./.-../-.-./---/--/.',       // AND WELCOME
    'bottom-left': '. --./--. -../../.-.', // EGG DIR
    'bottom-right': '-..././--./../-.'              // BEGIN
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
    'top-left': { offset: 10, duration: 6000 },
    'top-right': { offset: 33, duration: 6000 },
    'middle-left': { offset: 58, duration: 6000 },
    'middle-right': { offset: 83, duration: 6000 },
    'bottom-left': { offset: 18, duration: 6000 },
    'bottom-right': { offset: 48, duration: 6000 }
};

// Helper function to convert morse code to CSS animation keyframes
function flickerAutoKeyframes(morseCode, sectionName) {
    const config = FLICKER_CONFIG[sectionName];
    const animationName = `${sectionName}-anim-dynamic`;
    
    // Cycle defined as 8 seconds in the server configuration notes
    const totalDurationMs = 8000; 
    let currentTime = 0;
    
    // CSS States mapping back to your front-end look.css styles
    const offState = `opacity: 0.05; background: rgba(0, 255, 0, 0.02);`;
    const onState = `opacity: 0.25; background: rgba(0, 255, 0, 0.12);`;
    
    let keyframes = `@keyframes ${animationName} {\n`;
    keyframes += `  0% { ${offState} }\n`;
    
    for (let i = 0; i < morseCode.length; i++) {
        const char = morseCode[i];
        let isOn = false;
        let duration = 0;
        
        // Map morse symbols to timings (in ms)
        if (char === '.') {
            isOn = true;
            duration = 200;
        } else if (char === '-') {
            isOn = true;
            duration = 600;
        } else if (char === '/') {
            currentTime += 400; // Letter separator pause
            continue;
        } else if (char === ' ') {
            currentTime += 1200; // Word separator pause
            continue;
        }
        
        if (isOn) {
            // Convert milliseconds to CSS keyframe percentages
            let startPct = (currentTime / totalDurationMs * 100);
            let endPct = ((currentTime + duration) / totalDurationMs * 100);
            
            // Add a tiny 0.1% buffer to create sharp on/off transitions rather than slow fades
            keyframes += `  ${Math.max(0, startPct - 0.1).toFixed(2)}% { ${offState} }\n`;
            keyframes += `  ${startPct.toFixed(2)}% { ${onState} }\n`;
            keyframes += `  ${endPct.toFixed(2)}% { ${onState} }\n`;
            keyframes += `  ${Math.min(100, endPct + 0.1).toFixed(2)}% { ${offState} }\n`;
            
            currentTime += duration;
            
            // Intra-character gap (standard 200ms gap between dots/dashes of the same letter)
            if (i + 1 < morseCode.length && (morseCode[i+1] === '.' || morseCode[i+1] === '-')) {
                currentTime += 200; 
            }
        }
    }
    
    // Ensure the animation closes on the off state
    keyframes += `  100% { ${offState} }\n}`;
    
    return {
        section: sectionName,
        morse: morseCode,
        css: keyframes,
        config: config
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
