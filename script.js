/* ===================================================
   San Valentín — Sergio & Eluney
   Interactive Script
   =================================================== */

(function () {
  'use strict';

  // ── Configuration ──
  const RELATIONSHIP_START = new Date(2022, 7, 11); // August 11, 2022 (month is 0-indexed)

  // ── DOM Elements ──
  const counterYears   = document.getElementById('counter-years');
  const counterDays    = document.getElementById('counter-days');
  const counterHours   = document.getElementById('counter-hours');
  const counterMinutes = document.getElementById('counter-minutes');
  const counterSeconds = document.getElementById('counter-seconds');
  const btnAccept      = document.getElementById('btn-accept');
  const confettiContainer = document.getElementById('confetti-container');
  const climaxSection  = document.getElementById('climax');

  // ===================================================
  // 1. LIVE COUNTER
  // ===================================================
  function updateCounter() {
    const now    = new Date();
    const diff   = now - RELATIONSHIP_START;

    // Calculate years
    let years = now.getFullYear() - RELATIONSHIP_START.getFullYear();
    const tempDate = new Date(RELATIONSHIP_START);
    tempDate.setFullYear(tempDate.getFullYear() + years);
    if (tempDate > now) {
      years--;
      tempDate.setFullYear(tempDate.getFullYear() - 1);
    }

    // Remaining time after full years
    const remainingMs = now - tempDate;
    const totalSeconds = Math.floor(remainingMs / 1000);
    const days    = Math.floor(totalSeconds / 86400);
    const hours   = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Update DOM with animation
    animateNumber(counterYears,   years);
    animateNumber(counterDays,    days);
    animateNumber(counterHours,   hours);
    animateNumber(counterMinutes, minutes);
    animateNumber(counterSeconds, seconds);
  }

  function animateNumber(element, value) {
    const current = element.textContent;
    const next    = String(value);
    if (current !== next) {
      element.style.transform = 'scale(1.1)';
      element.textContent = next;
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 200);
    }
  }

  // Start counter immediately, then update every second
  updateCounter();
  setInterval(updateCounter, 1000);

  // ===================================================
  // 2. INTERSECTION OBSERVER — Timeline Animations
  // ===================================================
  const timelineItems = document.querySelectorAll('.timeline-item');

  const timelineObserverOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15,
  };

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, timelineObserverOptions);

  timelineItems.forEach((item) => timelineObserver.observe(item));

  // ===================================================
  // 3. INTERSECTION OBSERVER — Clímax Background Change
  // ===================================================
  const climaxObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3,
  };

  const climaxObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        climaxSection.classList.add('climax--active');
      }
    });
  }, climaxObserverOptions);

  climaxObserver.observe(climaxSection);

  // ===================================================
  // 4. CONFETTI HEARTS — On Button Click
  // ===================================================
  const HEART_CHARS  = ['♥', '❤', '💕', '💖', '💗', '💘', '♡'];
  const HEART_COLORS = ['#DB7093', '#E8849E', '#C4537A', '#F2A5B8', '#C9A96E', '#FF6B8A', '#FF85A1'];

  function createConfettiHeart() {
    const heart = document.createElement('span');
    heart.classList.add('confetti-heart');
    heart.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];

    // Random positioning & styling
    heart.style.left            = Math.random() * 100 + '%';
    heart.style.fontSize        = (Math.random() * 1.5 + 0.8) + 'rem';
    heart.style.color           = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
    heart.style.animationDelay  = Math.random() * 1.5 + 's';

    confettiContainer.appendChild(heart);

    // Clean up after animation
    const totalDuration = (parseFloat(heart.style.animationDuration) + parseFloat(heart.style.animationDelay)) * 1000 + 200;
    setTimeout(() => heart.remove(), totalDuration);
  }

  function launchConfetti(count = 80) {
    for (let i = 0; i < count; i++) {
      createConfettiHeart();
    }
  }

  // Button click handler
  btnAccept.addEventListener('click', () => {
    // Launch confetti
    launchConfetti(80);

    // Change button state
    btnAccept.classList.add('accepted');
    btnAccept.querySelector('.climax__button-text').textContent = '¡GRACIAS, MI AMOR!';

    // Add response message
    const afterMsg = document.createElement('p');
    afterMsg.classList.add('climax__after-message');
    afterMsg.textContent = '¡Te amo con todo mi corazón! ♥';
    btnAccept.parentElement.appendChild(afterMsg);

    // Second wave of confetti
    setTimeout(() => launchConfetti(50), 2000);
  });

})();
