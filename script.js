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
function initReveal(container = document) {
  const els = container.querySelectorAll('.reveal:not(.visible)');

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent ? parent.querySelectorAll('.reveal') : [entry.target];
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
}

// Initial reveal initialization
initReveal();

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
// 5. FETCH EMPLOYEES (JSONPlaceholder API)
// -----------------------------------------------
(function initEmployees() {
  const container = document.getElementById('employeesGrid');
  if (!container) return;

  fetch('https://jsonplaceholder.typicode.com/users')
    .then(res => {
      if (!res.ok) throw new Error('Network response failed');
      return res.json();
    })
    .then(users => {
      container.innerHTML = users.map(user => `
        <article class="employee-card reveal">
          <div>
            <div class="employee-meta">
              <span class="employee-type">Partner / Dev</span>
              <span class="employee-company">${user.company.name}</span>
            </div>
            <h3 class="employee-name">${user.name}</h3>
            <p class="employee-desc">"${user.company.catchPhrase}"</p>
          </div>
          <div class="employee-contact">
            <a href="mailto:${user.email}" class="employee-link">✉ ${user.email}</a>
            <a href="http://${user.website}" target="_blank" rel="noopener noreferrer" class="employee-link">🌐 ${user.website}</a>
            <span class="employee-link" style="color:var(--white-dim)">📍 ${user.address.city}</span>
          </div>
        </article>
      `).join('');

      // Re-trigger scroll reveal observer for dynamically created elements
      initReveal(container);
    })
    .catch(err => {
      console.error('Error fetching employees:', err);
      container.innerHTML = `
        <div class="employee-card reveal">
          <h3 class="employee-name" style="color:#e24b4a">Failed to load</h3>
          <p class="employee-desc">Unable to retrieve employee data right now. Please check your internet connection.</p>
        </div>
      `;
      initReveal(container);
    });
})();

// -----------------------------------------------
// 6. CONTACT FORM
// -----------------------------------------------
(function initForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');

  if (!form) return;

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

    if (!name.value.trim()) {
      setError(name, true);
      valid = false;
    } else {
      setError(name, false);
    }

    if (!validateEmail(email.value.trim())) {
      setError(email, true);
      valid = false;
    } else {
      setError(email, false);
    }

    if (!message.value.trim()) {
      setError(message, true);
      valid = false;
    } else {
      setError(message, false);
    }

    if (!valid) return;

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

  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => setError(el, false));
  });
})();

// -----------------------------------------------
// 7. PROJECT CARDS — subtle hover line
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
// 8. YEAR IN FOOTER
// -----------------------------------------------
(function updateYear() {
  const copy = document.querySelector('.footer-copy');
  if (copy) {
    const year = new Date().getFullYear();
    copy.textContent = `© ${year} — Built by hand. No templates.`;
  }
})();