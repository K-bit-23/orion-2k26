document.addEventListener('DOMContentLoaded', () => {
    // --- Render Events ---
    const eventsGrid = document.getElementById('events-grid');

    // --- Sound Logic ---
    const clickSound = document.getElementById('ui-click');
    function playClickSound() {
        if (clickSound) {
            clickSound.volume = 1.0;
            clickSound.currentTime = 0;
            const playPromise = clickSound.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Audio play failed:", error);
                });
            }
        }
    }

    // Render Event Cards
    const renderCategory = (events, title, containerClass) => {
        const titleEl = document.createElement('h3');
        titleEl.className = 'event-category-title';
        titleEl.textContent = title;
        eventsGrid.appendChild(titleEl);

        const gridEl = document.createElement('div');
        gridEl.className = 'events-grid ' + containerClass;
        
        events.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card reveal-on-scroll';
            card.setAttribute('data-id', event.id);
            card.style.transitionDelay = `${(events.indexOf(event) % 3) * 0.1}s`;

            card.innerHTML = `
                <div class="card-gfx">
                    <div class="card-icon"><i class="fas ${event.icon}"></i></div>
                    ${event.category ? `<div class="category-tag"><i class="fas fa-star"></i> ${event.category}</div>` : ''}
                </div>
                <h3 class="card-title">${event.title}</h3>
                <div style="color: var(--highlight); font-family: var(--font-mono); margin-bottom: 15px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px;">
                    ${event.subtitle || ''}
                </div>
                <p class="card-desc">${event.description}</p>
                <div class="read-more">Access Data <i class="fas fa-chevron-right"></i></div>
            `;

            card.addEventListener('click', () => {
                playClickSound();
                setTimeout(() => {
                    window.location.href = `rules.html?id=${event.id}`;
                }, 400);
            });
            gridEl.appendChild(card);
        });

        eventsGrid.appendChild(gridEl);
    };

    const techEvents = eventData.filter(e => e.category !== 'NON-TECHNICAL');
    const nonTechEvents = eventData.filter(e => e.category === 'NON-TECHNICAL');

    renderCategory(techEvents, 'TECHNICAL EVENTS', 'tech-grid');
    renderCategory(nonTechEvents, 'NON-TECHNICAL EVENTS', 'non-tech-grid');

    // Render Workshop Cards
    const workshopGrid = document.getElementById('workshop-grid');
    if (workshopGrid && typeof workshopData !== 'undefined') {
        workshopData.forEach(workshop => {
            const card = document.createElement('div');
            card.className = 'event-card workshop-card reveal-on-scroll';
            card.setAttribute('data-id', workshop.id);

            card.innerHTML = `
                <div class="card-gfx">
                    <div class="card-icon"><i class="fas ${workshop.icon}"></i></div>
                </div>
                <h3 class="card-title">${workshop.title}</h3>
                <div style="color: var(--highlight); font-family: var(--font-mono); margin-bottom: 15px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px;">
                    ${workshop.subtitle || ''}
                </div>
                <p class="card-desc">${workshop.description}</p>
                <div class="read-more">Access Data <i class="fas fa-chevron-right"></i></div>
            `;

            card.addEventListener('click', () => {
                playClickSound();
                setTimeout(() => {
                    window.location.href = `rules.html?id=${workshop.id}`;
                }, 400);
            });
            workshopGrid.appendChild(card);
        });
    }

    // --- Countdown Timer ---
    // Target Date: March 5, 2026, 09:00:00 (Assuming start time)
    const eventDate = new Date('March 5, 2026 09:00:00').getTime();

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

    // --- Background Audio Persistence ---
    // Ensure the ID matches the HTML element
    const audio = document.getElementById('doomsday-theme');

    if (audio) {
        audio.volume = 0.5; // Set a reasonable background volume

        // 1. Restore Playback Position from LocalStorage
        const savedTime = localStorage.getItem('audio_time');
        if (savedTime) {
            audio.currentTime = parseFloat(savedTime);
        }

        // 2. Play Function (Handles persistence state)
        const startAudio = () => {
            audio.play().then(() => {
                // If successful, we are "playing"
                localStorage.setItem('audio_playing', 'true');
            }).catch(error => {
                console.log("Autoplay blocked:", error);
                // If blocked, wait for interaction (which is handled by the global click listener below)
            });
        };

        // 3. Try to play immediately (Works if "audio_playing" was true and browser allows, or just try anyway)
        // Note: Browsers usually block this unless there was a previous interaction on the domain, 
        // but restoring context might help in some browsers or if the user refreshed.
        startAudio();

        // 4. Global fallback: Start audio on ANY first interaction if not playing
        const interactionStart = () => {
            if (audio.paused) {
                audio.play().then(() => {
                    localStorage.setItem('audio_playing', 'true');
                }).catch(e => console.log("Still blocked", e));
            }
            // Once interacted, we can likely remove this listener or let it be harmless
            document.removeEventListener('click', interactionStart);
            document.removeEventListener('keydown', interactionStart);
        };

        document.addEventListener('click', interactionStart);
        document.addEventListener('keydown', interactionStart);

        // 5. Save Playback Position on Unload (Refresh/Navigate)
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('audio_time', audio.currentTime);
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                scrollObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

});
