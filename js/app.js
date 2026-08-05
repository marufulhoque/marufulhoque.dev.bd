/* ==========================================================================
   app.js — Interactive behaviors for the portfolio
   - Smooth scrolling
   - Mobile nav toggle
   - Intersection Observer reveal animations
   - Typing animation for hero subtitle
   - Back to top button
   - Active nav highlighting
   - Project modal
   ========================================================================== */

(function () {
  'use strict';

  // DOM selectors
  const doc = document;
  const navToggle = doc.getElementById('nav-toggle');
  const navList = doc.getElementById('nav-list');
  const navLinks = doc.querySelectorAll('.nav-link');
  const backToTop = doc.getElementById('back-to-top');
  const yearEl = doc.getElementById('year');

  // Insert current year in footer
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll for internal links
  function smoothScroll(e) {
    if (!this.hash) return;
    e.preventDefault();
    const target = doc.querySelector(this.hash);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Close mobile nav when clicked
    if (navList.classList.contains('open')) toggleNav(false);
  }

  navLinks.forEach(link => link.addEventListener('click', smoothScroll));

  // Nav toggle (mobile)
  function toggleNav(force) {
    const isOpen = typeof force === 'boolean' ? force : !navList.classList.contains('open');
    navList.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      toggleNav();
    });
  }

  // Intersection Observer for reveal animations
  const revealElems = doc.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Optional: unobserve after reveal for performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealElems.forEach(el => revealObserver.observe(el));

  // Back to top button visibility
  window.addEventListener('scroll', () => {
    const y = window.scrollY || window.pageYOffset;
    if (y > 600) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Active nav link highlighting via IntersectionObserver
  const sections = Array.from(doc.querySelectorAll('main .section')).map(s => {
    return { id: s.id, el: s };
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        doc.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s.el));

  // Typing animation (accessible)
  class Typer {
    constructor(el) {
      this.el = el;
      this.strings = JSON.parse(el.getAttribute('data-strings') || '[]');
      this.delay = 80;
      this.pause = 1200;
      this.loop = true;
      this.index = 0;
      this.pos = 0;
      this.typing = true;
      this._mounted = false;
      this.ariaSpan = null;
      // create inner span for aria-live
      this.init();
    }

    init() {
      this.ariaSpan = document.createElement('span');
      this.ariaSpan.setAttribute('aria-live', 'polite');
      this.ariaSpan.className = 'typing-inner';
      this.el.appendChild(this.ariaSpan);
      this._mounted = true;
      this.tick();
    }

    tick() {
      if (!this._mounted) return;
      const current = this.strings[this.index] || '';
      if (this.typing) {
        this.pos++;
        if (this.pos <= current.length) {
          this.ariaSpan.textContent = current.slice(0, this.pos);
          setTimeout(() => this.tick(), this.delay + Math.random() * 40);
        } else {
          this.typing = false;
          setTimeout(() => this.tick(), this.pause);
        }
      } else {
        this.pos--;
        if (this.pos >= 0) {
          this.ariaSpan.textContent = current.slice(0, this.pos);
          setTimeout(() => this.tick(), this.delay / 2);
        } else {
          this.typing = true;
          this.index = (this.index + 1) % this.strings.length;
          setTimeout(() => this.tick(), 250);
        }
      }
    }
  }

  const typingEl = doc.getElementById('typing');
  if (typingEl) new Typer(typingEl);

  // Project modal behavior
  const projectCards = doc.querySelectorAll('.project-card');
  const modal = doc.getElementById('project-modal');
  const modalTitle = doc.getElementById('modal-title');
  const modalSub = doc.querySelector('.modal-sub');
  const modalDesc = doc.querySelector('.modal-desc');
  const modalVisit = doc.getElementById('modal-visit');
  const modalClose = doc.getElementById('modal-close');
  const modalClose2 = doc.getElementById('modal-close-2');

  const projectData = {
    1: {
      title: 'Premium Portfolio Website',
      sub: 'Editorial, Minimal, Responsive',
      desc: 'A handcrafted portfolio focusing on typographic scale, whitespace and subtle motion. Built with semantic HTML, vanilla CSS and JavaScript for smooth interactions.',
      visit: 'https://github.com/MUHIB-143'
    },
    2: {
      title: 'Python Django Web Application',
      sub: 'Server-rendered app with Django',
      desc: 'A structured Django web application prototype with clear models, templates and accessible UI patterns.',
      visit: 'https://github.com/MUHIB-143'
    },
    3: {
      title: 'Flutter Mobile Application',
      sub: 'Cross-platform mobile prototype',
      desc: 'A mobile application built using Flutter that prioritizes native performance and polished UI components.',
      visit: 'https://github.com/MUHIB-143'
    }
  };

  function openModal(id) {
    const data = projectData[id];
    if (!data || !modal) return;
    modalTitle.textContent = data.title;
    if (modalSub) modalSub.textContent = data.sub;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalVisit) {
      modalVisit.href = data.visit || '#';
    }
    modal.setAttribute('aria-hidden', 'false');
    // trap focus inside modal
    modal.querySelector('.modal-dialog').focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-project');
      openModal(id);
    });
    // keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = card.getAttribute('data-project');
        openModal(id);
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalClose2) modalClose2.addEventListener('click', closeModal);

  // Close modal on backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Close modal on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal && modal.getAttribute('aria-hidden') === 'false') closeModal();
      if (navList.classList.contains('open')) toggleNav(false);
    }
  });

  // Contact form demo handler (prevent default & show minimal feedback)
  const contactForm = doc.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('#name').value || 'there';
      // minimal accessible feedback
      alert(`Thanks ${name}! This demo form does not send messages. Please email me at mhmuhib143@gmail.com`);
      contactForm.reset();
    });
  }

  // Ensure focus outline for keyboard users
  (function focusOutline() {
    let mouseDown = false;
    document.addEventListener('mousedown', () => { mouseDown = true; document.documentElement.classList.add('using-mouse'); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') { mouseDown = false; document.documentElement.classList.remove('using-mouse'); }
    });
  })();

  // Prefers-reduced-motion: disable animations where applicable
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery && motionQuery.matches) {
    // Remove transition styles by adding a class or settings if needed (left simple)
    document.documentElement.classList.add('reduce-motion');
  }

})();
