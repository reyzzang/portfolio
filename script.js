/* ===========================
   MATE GAPRINDASHVILI PORTFOLIO
   script.js — Clean & Purposeful
   =========================== */

'use strict';

// -----------------------------------------------
// 1. CUSTOM CURSOR
// -----------------------------------------------
(function initCursor() {
  const root = document.documentElement;

  document.addEventListener('mousemove', (e) => {
    root.style.setProperty('--cx', e.clientX + 'px');
    root.style.setProperty('--cy', e.clientY + 'px');
  });
})();

// -----------------------------------------------
// 2. NAV — scroll behavior & mobile toggle
// -----------------------------------------------
(function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Scroll: add .scrolled class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// -----------------------------------------------
// 3. SCROLL REVEAL
// -----------------------------------------------
(function initReveal() {
  const els = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children within the same parent
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach(sib => {
          if (!sib.classList.contains('visible')) {
            sib.style.transitionDelay = delay + 'ms';
            delay += 80;
          }
        });
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  els.forEach(el => observer.observe(el));
})();

// -----------------------------------------------
// 4. ACTIVE NAV LINK on scroll
// -----------------------------------------------
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + currentId) {
        link.style.color = 'var(--yellow)';
      }
    });
  }, { passive: true });
})();

// -----------------------------------------------
// 5. CONTACT FORM
// -----------------------------------------------
(function initForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  // Simple validation
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(input, show) {
    if (show) {
      input.style.borderColor = '#e24b4a';
    } else {
      input.style.borderColor = '';
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    let valid = true;

    // Name
    if (!name.value.trim()) {
      setError(name, true);
      valid = false;
    } else {
      setError(name, false);
    }

    // Email
    if (!validateEmail(email.value.trim())) {
      setError(email, true);
      valid = false;
    } else {
      setError(email, false);
    }

    // Message
    if (!message.value.trim()) {
      setError(message, true);
      valid = false;
    } else {
      setError(message, false);
    }

    if (!valid) return;

    // Simulate send (replace with real backend / formspree / emailjs)
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.6';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message';
      btn.style.opacity = '';
      btn.disabled = false;
      success.style.display = 'block';

      setTimeout(() => {
        success.style.display = 'none';
      }, 5000);
    }, 1400);
  });

  // Remove error state on input
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => setError(el, false));
  });
})();

// -----------------------------------------------
// 6. PROJECT CARDS — subtle hover line
// -----------------------------------------------
(function initProjectHover() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderTopColor = 'var(--yellow)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderTopColor = '';
    });
  });
})();

// -----------------------------------------------
// 7. YEAR IN FOOTER
// -----------------------------------------------
(function updateYear() {
  const copy = document.querySelector('.footer-copy');
  if (copy) {
    const year = new Date().getFullYear();
    copy.textContent = `© ${year} — Built by hand. No templates.`;
  }
})();