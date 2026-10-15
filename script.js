/* ==========================================================================
   SpoTV — Interactive Engine Script
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ----------------------------------------------------------------------
    // 1. Dynamic Canvas Atmosphere (Grayscale Cloud & Particle Particles)
    // ----------------------------------------------------------------------
    const bgCanvas = document.getElementById('bgCanvas');
    const ctx = bgCanvas.getContext('2d');

    function resizeCanvas() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * bgCanvas.width;
            this.y = Math.random() * bgCanvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = -(Math.random() * 0.3 + 0.1);
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.y += this.speedY;
            if (this.y < 0) this.reset();
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particles = Array.from({ length: 65 }, () => new Particle());

    function animateBg() {
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateBg);
    }
    animateBg();

    // ----------------------------------------------------------------------
    // 2. Countdown Timer
    // ----------------------------------------------------------------------
    const targetDate = new Date("October 15, 2026 21:00:00 GMT+0700").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = String(days).padStart(2, '0');
            document.getElementById('hours').innerText = String(hours).padStart(2, '0');
            document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
            document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
        } else {
            document.getElementById('days').innerText = "00";
            document.getElementById('hours').innerText = "00";
            document.getElementById('minutes').innerText = "00";
            document.getElementById('seconds').innerText = "00";
        }
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // ----------------------------------------------------------------------
    // 3. Audio Synthesizer & Visualizer (Web Audio API)
    // ----------------------------------------------------------------------
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const playIcon = document.getElementById('playIcon');
    const vizCanvas = document.getElementById('visualizerCanvas');
    const vizCtx = vizCanvas.getContext('2d');

    let audioCtx = null;
    let isPlaying = false;
    let osc = null;

    function drawVisualizer() {
        vizCtx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);
        const bars = 28;
        const barWidth = (vizCanvas.width / bars) - 2;

        for (let i = 0; i < bars; i++) {
            const barHeight = isPlaying 
                ? Math.random() * (vizCanvas.height - 5) + 5 
                : 4;

            vizCtx.fillStyle = '#ffffff';
            vizCtx.fillRect(i * (barWidth + 2), vizCanvas.height - barHeight, barWidth, barHeight);
        }
        requestAnimationFrame(drawVisualizer);
    }
    drawVisualizer();

    audioToggleBtn.addEventListener('click', () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (!isPlaying) {
            osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();

            isPlaying = true;
            playIcon.className = 'fa-solid fa-pause';
            showToast("Playing SpoTV Ambient Synthesizer Audio");
        } else {
            if (osc) osc.stop();
            isPlaying = false;
            playIcon.className = 'fa-solid fa-play';
            showToast("Audio Paused");
        }
    });

    // ----------------------------------------------------------------------
    // 4. Image Gallery Slider
    // ----------------------------------------------------------------------
    const sliderTrack = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');
    const dotsContainer = document.getElementById('sliderDots');

    let currentSlide = 0;

    // Create Dots
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        currentSlide = index;
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    });

    // Auto Slide
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }, 5000);

    // ----------------------------------------------------------------------
    // 5. Modal Quick Links
    // ----------------------------------------------------------------------
    const linkModal = document.getElementById('linkModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    openModalBtn.addEventListener('click', () => linkModal.classList.add('active'));
    closeModalBtn.addEventListener('click', () => linkModal.classList.remove('active'));
    linkModal.addEventListener('click', (e) => {
        if (e.target === linkModal) linkModal.classList.remove('active');
    });

    // ----------------------------------------------------------------------
    // 6. RSVP & Attendance System (localStorage)
    // ----------------------------------------------------------------------
    const rsvpForm = document.getElementById('rsvpForm');
    const attendanceFeed = document.getElementById('attendanceFeed');
    const attendeeCount = document.getElementById('attendeeCount');

    let attendees = JSON.parse(localStorage.getItem('spotv_attendees')) || [
        { name: "SpoTV_Host", status: "Hadir", msg: "Welcome sweet club! 🔥" },
        { name: "VibeMaster99", status: "Hadir", msg: "Ready for Sunday night party!" }
    ];

    function renderFeed() {
        attendanceFeed.innerHTML = '';
        attendees.forEach(item => {
            const feedCard = document.createElement('div');
            feedCard.className = 'feed-item';
            feedCard.innerHTML = `
                <div>
                    <div class="feed-user">${escapeHtml(item.name)}</div>
                    <div class="feed-msg">${escapeHtml(item.msg || 'No message')}</div>
                </div>
                <span class="feed-status">${item.status}</span>
            `;
            attendanceFeed.appendChild(feedCard);
        });
        attendeeCount.innerText = attendees.length;
    }

    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, (m) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
        })[m]);
    }

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const status = document.getElementById('status').value;
        const message = document.getElementById('message').value.trim();

        if (username) {
            attendees.unshift({ name: username, status: status, msg: message });
            localStorage.setItem('spotv_attendees', JSON.stringify(attendees));
            renderFeed();
            rsvpForm.reset();
            showToast("Terima kasih! RSVP kamu telah dicatat 🎉");
        }
    });

    renderFeed();

    // ----------------------------------------------------------------------
    // 7. Mobile Navigation Toggle
    // ----------------------------------------------------------------------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });

    // ----------------------------------------------------------------------
    // 8. Toast Helper
    // ----------------------------------------------------------------------
    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
});
