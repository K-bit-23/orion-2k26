document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // PAGE LOADER
    // =============================================
    const pageLoader = document.getElementById('pageLoader');

    // Hide loader after content is ready (with minimum display time)
    const minLoadTime = 2000; // Minimum 2 seconds to show animation
    const startTime = Date.now();

    window.addEventListener('load', () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);

        setTimeout(() => {
            if (pageLoader) {
                pageLoader.classList.add('hidden');
                // Trigger initial animations after loader hides
                setTimeout(triggerScrollAnimations, 100);
            }
        }, remainingTime);
    });

    // =============================================
    // THEME TOGGLE REMOVED (Always Dark)
    // =============================================
    // Code block removed as per user request to remove dark/light change option.

    // =============================================
    // MAGICAL CURSOR TRAIL EFFECT
    // =============================================
    const cursorTrailContainer = document.createElement('div');
    cursorTrailContainer.className = 'cursor-trail-container';
    document.body.appendChild(cursorTrailContainer);

    const trailSymbols = ['✦', '✧', '★', '⋆', '✴', '❋', '✵'];
    const trailColors = ['#ff0000', '#cc0000', '#ff4500', '#800000'];
    let mouseX = 0;
    let mouseY = 0;
    let lastTrailTime = 0;

    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-trail-particle';

        // Random symbol and color
        const symbol = trailSymbols[Math.floor(Math.random() * trailSymbols.length)];
        const color = trailColors[Math.floor(Math.random() * trailColors.length)];

        particle.textContent = symbol;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.color = color;
        particle.style.textShadow = `0 0 10px ${color}, 0 0 20px ${color}`;

        // Random size variation
        const size = 12 + Math.random() * 12;
        particle.style.fontSize = size + 'px';

        // Random movement direction
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        particle.style.setProperty('--dx', dx + 'px');
        particle.style.setProperty('--dy', dy + 'px');

        cursorTrailContainer.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        const now = Date.now();
        // Create trail particles every 50ms
        if (now - lastTrailTime > 50) {
            createTrailParticle(mouseX, mouseY);
            lastTrailTime = now;
        }
    });

    // Create extra sparkles on click
    document.addEventListener('click', (e) => {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                createTrailParticle(e.clientX, e.clientY);
            }, i * 30);
        }
    });

    // =============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // =============================================
    function triggerScrollAnimations() {
        // Section-level animations
        const sections = document.querySelectorAll('.events-section, .protocols-section, .contact-section, footer');

        const sectionObserverOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-animated');
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Card-level animations (for additional effects)
        const animateElements = document.querySelectorAll('.event-card, .protocol-card, .hud-card, .section-header');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for cards
                    const delay = index * 100;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    // =============================================
    // RENDER EVENTS
    // =============================================
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
    eventData.forEach(event => {
        const card = document.createElement('div');
        const isNonTech = event.type === 'non-technical';
        card.className = isNonTech ? 'event-card non-tech-card' : 'event-card';
        card.setAttribute('data-id', event.id);

        // Cartoon mascot block (only for non-technical events)
        const cartoonBlock = isNonTech ? `
            <div class="cartoon-mascot-wrap">
                <div class="cartoon-mascot" data-label="${event.cartoonLabel || ''}">
                    <span class="cartoon-emoji">${event.cartoon}</span>
                    <div class="cartoon-spotlight"></div>
                </div>
                <div class="non-tech-badge">⭐ NON-TECHNICAL</div>
            </div>
        ` : '';

        card.innerHTML = `
            ${cartoonBlock}
            <div class="card-icon ${isNonTech ? 'non-tech-icon' : ''}"><i class="fas ${event.icon}"></i></div>
            <h3 class="card-title">${event.title}</h3>
            <div style="color: ${isNonTech ? '#f9a8d4' : 'var(--highlight)'}; font-family: var(--font-mono); margin-bottom: 15px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px;">
                ${event.subtitle || ''}
            </div>
            <p class="card-desc">${event.description}</p>
            <div class="read-more ${isNonTech ? 'non-tech-readmore' : ''}">Access Data <i class="fas fa-chevron-right"></i></div>
        `;

        card.addEventListener('click', () => {
            playClickSound();
            // Increased delay to 400ms to ensure sound is audible
            setTimeout(() => {
                window.location.href = `rules.html?id=${event.id}`;
            }, 400);
        });
        eventsGrid.appendChild(card);
    });

    // =============================================
    // COUNTDOWN TIMER
    // =============================================
    // Target Date: March 05, 2026 08:00:00 (Assuming start time)
    const eventDate = new Date('March 05 , 2026 08:00:00').getTime();

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

        // Animate countdown numbers on change
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        updateCountElement(daysEl, days);
        updateCountElement(hoursEl, hours);
        updateCountElement(minutesEl, minutes);
        updateCountElement(secondsEl, seconds);
    }

    function updateCountElement(element, value) {
        const formattedValue = value < 10 ? '0' + value : value;
        if (element.innerText !== String(formattedValue)) {
            element.style.transform = 'scale(1.2)';
            element.style.color = '#ff0000';
            element.innerText = formattedValue;
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = 'var(--accent)';
            }, 150);
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Glitch Text Effect - Removed

    // =============================================
    // MATRIX RAIN EFFECT
    // =============================================
    const canvas = document.getElementById('matrix-rain');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Magical Runes and Symbols
    const magicRunes = '✦✧★☆✴✵❋❖⚝⚹⋆✶✷✸✹☄⍟✺⁂⁎⁑';
    const wizardSymbols = '᛭ᛮᛯᛰ᚛᚜ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬ';
    const alphabet = magicRunes + wizardSymbols;

    const fontSize = 18;
    const columns = canvas.width / fontSize;

    const rainDrops = [];
    for (let i = 0; i < columns; i++) {
        rainDrops[i] = Math.random() * canvas.height / fontSize;
    }

    const draw = () => {
        const isDarkMode = document.body.classList.contains('dark-mode');

        // Background fade - adapts to theme
        // Always dark background for new theme
        ctx.fillStyle = 'rgba(5, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Golden magical text - darker for light mode, brighter for dark
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#ff0000'); // CRITICAL RED
        gradient.addColorStop(0.5, '#cc0000'); // DARK RED
        gradient.addColorStop(1, '#800000'); // BLOOD RED
        ctx.fillStyle = gradient;
        ctx.font = fontSize + 'px serif';
        ctx.shadowColor = isDarkMode ? '#ffd700' : '#b8860b';
        ctx.shadowBlur = isDarkMode ? 10 : 5;

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.98) {
                rainDrops[i] = 0;
            }
            rainDrops[i] += 0.5; // Slower, more magical fall
        }
        ctx.shadowBlur = 0;
    };

    setInterval(draw, 30);

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // =============================================
    // TYPING EFFECT FOR SUB-HERO
    // =============================================
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

    // Start typing after loader finishes
    setTimeout(typeText, 2500);

    // =============================================
    // BACKGROUND AUDIO PERSISTENCE
    // =============================================
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

    // =============================================
    // ENHANCED HOVER EFFECTS
    // =============================================
    // Add tilt effect on cards
    const cards = document.querySelectorAll('.event-card, .protocol-card, .hud-card, .workshop-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    // =============================================
    // PARALLAX EFFECT ON SCROLL
    // =============================================
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });

});
