(function () {
  'use strict';
  var doc = document;
  doc.documentElement.classList.add('js');

  var toggle = doc.getElementById('navToggle');
  var nav = doc.getElementById('nav');
  var links = Array.prototype.slice.call(doc.querySelectorAll('.nav-link'));

  function closeNav() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close mobile menu after choosing any nav item
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  // Active link highlighting
  var sections = links
    .map(function (a) { return doc.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function setActive() {
    var y = window.scrollY + 140;
    var current = null;
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
    links.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // Reveal on scroll (content stays visible if IntersectionObserver is unavailable)
  var items = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Contact form: validate, then open the visitor's email app with a prefilled message
  var form = doc.getElementById('contactForm');
  var status = doc.getElementById('formStatus');
  var TO = 'hdmanfull@gmail.com';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = doc.getElementById('fName');
    var email = doc.getElementById('fEmail');
    var msg = doc.getElementById('fMsg');
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

    [name, email, msg].forEach(function (f) { f.classList.remove('invalid'); });
    status.classList.remove('ok');

    if (!name.value.trim()) { name.classList.add('invalid'); status.textContent = 'Please enter your name.'; name.focus(); return; }
    if (!emailOk) { email.classList.add('invalid'); status.textContent = 'Please enter a valid email address.'; email.focus(); return; }
    if (!msg.value.trim()) { msg.classList.add('invalid'); status.textContent = 'Please write a short message.'; msg.focus(); return; }

    var body = msg.value.trim() + '\n\n— ' + name.value.trim() + '\n' + email.value.trim();
    var href = 'mailto:' + TO +
      '?subject=' + encodeURIComponent('Inquiry from ' + name.value.trim()) +
      '&body=' + encodeURIComponent(body);

    status.classList.add('ok');
    status.textContent = 'Opening your email app… If nothing happens, write to ' + TO + '.';
    window.location.href = href;
    form.reset();
  });

  var year = doc.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
