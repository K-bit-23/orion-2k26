document.addEventListener('DOMContentLoaded', () => {
    // --- Render Events ---
    const eventsGrid = document.getElementById('events-grid');
    const modal = document.getElementById('event-modal');
    const closeModal = document.querySelector('.close-modal');

    // Modal Elements
    const mTitle = document.getElementById('modal-title');
    const mDesc = document.getElementById('modal-desc');
    const mTeam = document.getElementById('modal-team');
    const mRules = document.getElementById('modal-rules');
    const mCoords = document.getElementById('modal-coordinators');

    // Render Event Cards
    eventData.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.setAttribute('data-id', event.id);

        card.innerHTML = `
            <div class="card-icon"><i class="fas ${event.icon}"></i></div>
            <h3 class="card-title">${event.title} <span style="font-size:0.8em; color:var(--accent);">${event.subtitle || ''}</span></h3>
            <p class="card-desc">${event.description}</p>
            <div class="read-more">Access Data <i class="fas fa-chevron-right"></i></div>
        `;

        card.addEventListener('click', () => openModal(event));
        eventsGrid.appendChild(card);
    });

    // --- Modal Logic ---
    function openModal(event) {
        mTitle.textContent = event.title;
        mDesc.textContent = event.description;
        mTeam.textContent = event.teamSize;

        // Clear previous list items
        mRules.innerHTML = '';
        mCoords.innerHTML = '';

        // Populate Rules
        event.rules.forEach(rule => {
            const li = document.createElement('li');
            li.textContent = rule;
            mRules.appendChild(li);
        });

        // Populate Coordinators
        event.coordinators.forEach(coord => {
            const li = document.createElement('li');
            li.textContent = coord;
            mCoords.appendChild(li);
        });

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
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
});
