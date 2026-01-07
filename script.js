document.addEventListener('DOMContentLoaded', () => {
    // --- Render Events ---
    const eventsGrid = document.getElementById('events-grid');

    // --- Sound Logic ---
    const clickSound = document.getElementById('ui-click');
    function playClickSound() {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log("Audio play blocked", e));
        }
    }

    // Render Event Cards
    eventData.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.setAttribute('data-id', event.id);

        card.innerHTML = `
            <div class="card-icon"><i class="fas ${event.icon}"></i></div>
            <h3 class="card-title">${event.title}</h3>
            <div style="color: var(--highlight); font-family: var(--font-mono); margin-bottom: 15px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px;">
                ${event.subtitle || ''}
            </div>
            <p class="card-desc">${event.description}</p>
            <div class="read-more">Access Data <i class="fas fa-chevron-right"></i></div>
        `;

        card.addEventListener('click', () => {
            playClickSound();
            // Small delay to ensure sound starts before navigation
            setTimeout(() => {
                window.location.href = `rules.html?id=${event.id}`;
            }, 150);
        });
        eventsGrid.appendChild(card);
    });

    // --- Countdown Timer ---
    // Target Date: January 30, 2026, 09:00:00 (Assuming start time)
    const eventDate = new Date('January 30, 2026 09:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            document.querySelector('.countdown-container').innerHTML = '<h2 style="color:var(--accent)">PROTOCOL INITIATED</h2>';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- Glitch Text Effect (Optional Randomizer) ---
    const glitchElement = document.querySelector('.glitch-large');
    setInterval(() => {
        const original = glitchElement.getAttribute('data-text');
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let glitched = '';
        if (Math.random() > 0.9) {
            // Briefly glitch text
            for (let i = 0; i < original.length; i++) {
                if (Math.random() > 0.7) {
                    glitched += chars[Math.floor(Math.random() * chars.length)];
                } else {
                    glitched += original[i];
                }
            }
            glitched = glitched.substring(0, original.length); // Ensure length match
            glitched = "SYSTEM_FAIL"; // Force a specific glitch sometimes

            glitchElement.classList.add('active-glitch');
            setTimeout(() => {
                glitchElement.classList.remove('active-glitch');
            }, 100);
        }
    }, 2000);

    // --- Matrix Rain Effect ---
    const canvas = document.getElementById('matrix-rain');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops = [];
    for (let i = 0; i < columns; i++) {
        rainDrops[i] = 1;
    }

    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0'; // Green text
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    setInterval(draw, 30);

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // --- Typing Effect for Sub-Hero ---
    const subHero = document.querySelector('.sub-hero');
    const textToType = "KONGU ENGINEERING COLLEGE";
    subHero.textContent = "";
    subHero.classList.add('typing-effect');

    let charIndex = 0;
    function typeText() {
        if (charIndex < textToType.length) {
            subHero.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 75); // Typing speed
        } else {
            subHero.classList.remove('typing-effect'); // Stop blinking cursor
        }
    }

    // Start typing after a short delay
    setTimeout(typeText, 500);

    // --- Doomsday Sound Control ---
    const audio = document.getElementById('doomsday-theme');

    // Create Toggle Button
    const soundBtn = document.createElement('button');
    soundBtn.className = 'sound-toggle';
    soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    soundBtn.title = "Initialize Audio Protocol";
    document.body.appendChild(soundBtn); // Append to body for fixed positioning

    let isPlaying = false;
    audio.volume = 0.6;

    // Browser Autoplay Policy Workaround: Start on first user interaction
    function initAudio() {
        audio.play().then(() => {
            isPlaying = true;
            soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            soundBtn.classList.add('active');
        }).catch(err => {
            console.log("Audio autoplay blocked, waiting for interaction.");
        });
        document.removeEventListener('click', initAudio);
    }

    document.addEventListener('click', initAudio, { once: true });

    soundBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent re-triggering initAudio if clicked first
        if (isPlaying) {
            audio.pause();
            soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            soundBtn.classList.remove('active');
            isPlaying = false;
        } else {
            audio.play();
            soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            soundBtn.classList.add('active');
            isPlaying = true;
        }
    });

});
