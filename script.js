const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
const topbar = document.querySelector('.topbar');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuButton.textContent = open ? '×' : '☰';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      menuButton.textContent = '☰';
    });
  });
}

// Give the sticky navigation a little more definition after scrolling.
const updateTopbar = () => {
  if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 12);
};
window.addEventListener('scroll', updateTopbar, { passive: true });
updateTopbar();

// Keep the navigation highlight in sync with the section being viewed.
const navLinks = [...document.querySelectorAll('#nav a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-28% 0px -58% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
}

// Subtle scroll-in reveal; content remains visible when reduced motion is preferred.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  document.body.classList.add('reveal-ready');
  const revealItems = document.querySelectorAll('.section-title, .about-copy, .about-side, .exp-card, .highlight-grid article, .contact-section > *');
  revealItems.forEach(item => item.classList.add('reveal'));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
}

const copyButton = document.querySelector('#copy-discord');
const feedback = document.querySelector('#copy-feedback');
if (copyButton && feedback) {
  copyButton.addEventListener('click', async () => {
    const username = '_positive1234';
    try {
      await navigator.clipboard.writeText(username);
      feedback.textContent = 'Discord username copied!';
    } catch (error) {
      feedback.textContent = `Discord username: ${username}`;
    }
  });
}
