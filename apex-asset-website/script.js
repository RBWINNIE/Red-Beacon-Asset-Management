/* ═══════════════════════════════════════════════════
   APEX ASSET MANAGEMENT — script.js
   Eight self-contained init functions, called in
   order once the DOM is ready.
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initFadeIn();
  initCounters();
  initCarousel();
  initForm();
  initYear();
});

/* ──────────────────────────────────────────────────
   1. NAVBAR — adds .scrolled after 40px of scroll
────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggle = () =>
    navbar.classList.toggle('scrolled', window.scrollY > 40);

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });

  // Smooth-scroll nav links (supplements CSS scroll-behavior for older browsers)
  navbar.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ──────────────────────────────────────────────────
   2. HAMBURGER — toggles .open on #nav-links;
      closes on outside click or Escape key
────────────────────────────────────────────────── */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  const open  = () => { links.classList.add('open');    btn.setAttribute('aria-expanded', 'true');  btn.classList.add('open'); };
  const close = () => { links.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.classList.remove('open'); };

  btn.addEventListener('click', () =>
    links.classList.contains('open') ? close() : open()
  );

  // Close when a nav link is clicked
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Close on outside click
  document.addEventListener('click', e => {
    if (links.classList.contains('open') && !links.contains(e.target) && !btn.contains(e.target))
      close();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && links.classList.contains('open')) { close(); btn.focus(); }
  });
}

/* ──────────────────────────────────────────────────
   3. FADE-IN — IntersectionObserver adds .visible
      to .fade-in elements; staggers grid siblings
────────────────────────────────────────────────── */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  // Assign stagger delay to siblings within the same grid parent
  const calcSiblingDelay = el => {
    const parent = el.parentElement;
    const siblings = [...parent.querySelectorAll(':scope > .fade-in')];
    if (siblings.length <= 1) return 0;
    return siblings.indexOf(el) * 90; // 90 ms per sibling
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = calcSiblingDelay(el);
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('visible');
        observer.unobserve(el);
      });
    },
    { threshold: 0.12 }
  );

  els.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────────────
   4. COUNTERS — animates .stat-number when
      .hero-stats enters the viewport
────────────────────────────────────────────────── */
function initCounters() {
  const statsSection = document.querySelector('.hero-stats');
  const counters     = document.querySelectorAll('.stat-number');
  if (!statsSection || !counters.length) return;

  let started = false;

  const animateCounter = (el, target, suffix) => {
    const duration = 1800;
    const start    = performance.now();

    const step = now => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      counters.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
      });
      observer.disconnect();
    },
    { threshold: 0.3 }
  );

  observer.observe(statsSection);
}

/* ──────────────────────────────────────────────────
   5. CAROUSEL — drives .carousel-track via
      translateX(-N*100%); auto-rotates every 5 s,
      pauses on hover, supports touch & keyboard
────────────────────────────────────────────────── */
function initCarousel() {
  const track    = document.getElementById('carousel-track');
  const dotsWrap = document.getElementById('carousel-dots');
  const prevBtn  = document.getElementById('prev-btn');
  const nextBtn  = document.getElementById('next-btn');
  if (!track) return;

  const slides = [...track.children];
  const total  = slides.length;
  let   current = 0;
  let   timer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className  = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.querySelectorAll('.carousel-dot')];

  const render = () => {
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', String(i === current));
    });
  };

  const goTo = idx => {
    current = (idx + total) % total;
    render();
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const startAuto = () => { timer = setInterval(next, 5000); };
  const stopAuto  = () => { clearInterval(timer); };

  prevBtn && prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

  // Keyboard arrows when carousel is focused
  track.closest('.carousel-wrapper').addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { stopAuto(); prev(); startAuto(); }
    if (e.key === 'ArrowRight') { stopAuto(); next(); startAuto(); }
  });

  // Pause on hover / focus
  const wrapper = track.closest('.carousel-wrapper');
  wrapper.addEventListener('mouseenter', stopAuto);
  wrapper.addEventListener('focusin',    stopAuto);
  wrapper.addEventListener('mouseleave', startAuto);
  wrapper.addEventListener('focusout',   e => {
    if (!wrapper.contains(e.relatedTarget)) startAuto();
  });

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      stopAuto();
      delta < 0 ? next() : prev();
      startAuto();
    }
  });

  render();
  startAuto();
}

/* ──────────────────────────────────────────────────
   6. FORM — validates name + email, POSTs via
      fetch to FormSubmit AJAX endpoint, shows
      inline .form-feedback banners
────────────────────────────────────────────────── */
function initForm() {
  const form     = document.getElementById('enquiry-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  const nameInput  = document.getElementById('full-name');
  const emailInput = document.getElementById('email');
  const nameError  = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');

  // Simple email regex
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const validateForm = () => {
    let ok = true;

    // Name
    if (!nameInput.value.trim()) {
      setFieldError(nameInput, nameError, 'Please enter your full name.');
      ok = false;
    } else {
      clearFieldError(nameInput, nameError);
    }

    // Email
    if (!emailInput.value.trim()) {
      setFieldError(emailInput, emailError, 'Please enter your email address.');
      ok = false;
    } else if (!validEmail(emailInput.value)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address.');
      ok = false;
    } else {
      clearFieldError(emailInput, emailError);
    }

    return ok;
  };

  const setFieldError = (input, errorEl, msg) => {
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) errorEl.textContent = msg;
  };

  const clearFieldError = (input, errorEl) => {
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    if (errorEl) errorEl.textContent = '';
  };

  // Clear errors on input
  [nameInput, emailInput].forEach(input => {
    input.addEventListener('input', () => {
      const errEl = document.getElementById(input.id + '-error');
      clearFieldError(input, errEl);
    });
  });

  const setLoading = loading => {
    const text    = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.btn-spinner');
    submitBtn.disabled = loading;
    text.hidden    = loading;
    spinner.hidden = !loading;
  };

  const showFeedback = (msg, type) => {
    feedback.textContent = msg;
    feedback.className   = `form-feedback ${type}`;
    feedback.hidden      = false;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    feedback.hidden = true;

    // FormSubmit AJAX endpoint: replace formsubmit.co/ with formsubmit.co/ajax/
    const action     = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
    const formData   = new FormData(form);

    try {
      const res  = await fetch(action, { method: 'POST', body: formData });
      const json = await res.json();

      // FormSubmit returns { success: "true" } (string, not boolean)
      if (json.success === 'true' || json.success === true) {
        showFeedback(
          'Thank you — your enquiry has been received. A member of our team will be in touch within one business day.',
          'success'
        );
        form.reset();
      } else {
        throw new Error('Submission rejected by server.');
      }
    } catch {
      showFeedback(
        'Something went wrong. Please try again or contact us directly at info@apexam.com.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  });
}

/* ──────────────────────────────────────────────────
   7. YEAR — writes current year into #year
────────────────────────────────────────────────── */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
