document.addEventListener('DOMContentLoaded', function () {

  /* =============================================
     VIDEO HERO
     ============================================= */
  const desktopVideo = document.getElementById('desktopVideo');
  const mobileVideo  = document.getElementById('mobileVideo');
  const soundToggle  = document.getElementById('soundToggle');

  let activeVideo = window.innerWidth <= 767 ? mobileVideo : desktopVideo;

  if (activeVideo) {
    activeVideo.muted = true;
    activeVideo.play().catch(() => {});

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) activeVideo.play().catch(() => {}); });
    });
    observer.observe(activeVideo);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') activeVideo.play().catch(() => {});
    });

    window.addEventListener('pageshow', (e) => {
      if (e.persisted) { activeVideo.load(); activeVideo.play().catch(() => {}); }
    });
  }

  window.addEventListener('resize', () => {
    const newActive = window.innerWidth <= 767 ? mobileVideo : desktopVideo;
    if (newActive && newActive !== activeVideo) {
      if (activeVideo) activeVideo.pause();
      newActive.currentTime = activeVideo ? activeVideo.currentTime : 0;
      newActive.play().catch(() => {});
      activeVideo = newActive;
    }
  });

  if (soundToggle && activeVideo) {
    const iconOff = soundToggle.querySelector('.sound-icon--off');
    const iconOn  = soundToggle.querySelector('.sound-icon--on');
    soundToggle.addEventListener('click', () => {
      activeVideo.muted = !activeVideo.muted;
      if (iconOff && iconOn) {
        iconOff.style.display = activeVideo.muted ? '' : 'none';
        iconOn.style.display  = activeVideo.muted ? 'none' : '';
      }
    });
  }

  /* =============================================
     NAVBAR
     ============================================= */
  const navbar     = document.getElementById('navbar');
  const menuToggle = document.getElementById('mobile-menu');
  const navMenu    = document.getElementById('nav-menu');
  const body       = document.body;

  // Hamburger toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('is-active');
      navMenu.classList.toggle('active', isOpen);
      body.classList.toggle('nav-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('is-active');
        navMenu.classList.remove('active');
        body.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll: transparent → solid after 60px
  function handleNavScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Active link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar__link, .dropdown-content a').forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    if (linkPath === currentPath || (currentPath === '/' && linkPath === '/index.html')) {
      link.classList.add('active-link');
    }
  });

  /* =============================================
     MOBILE FLOATING CTA BAR
     ============================================= */
  const ctaBar     = document.getElementById('mobile-cta-bar');
  const ctaDismiss = document.getElementById('mobile-cta-dismiss');
  let ctaShown     = false;
  let ctaDismissed = false;

  if (ctaBar) {
    window.addEventListener('scroll', () => {
      if (ctaDismissed) return;
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (pct > 0.6 && !ctaShown) {
        ctaShown = true;
        ctaBar.classList.add('visible');
      }
    }, { passive: true });

    if (ctaDismiss) {
      ctaDismiss.addEventListener('click', () => {
        ctaDismissed = true;
        ctaBar.classList.remove('visible');
      });
    }
  }

  /* Hero text is hidden via CSS (opacity:0) so it doesn't flash before
     the GSAP entrance animates it in. This safety net force-reveals it
     after 1.5s in case GSAP fails to load or is slow. Runs unconditionally
     — placed BEFORE the GSAP guard so a CDN failure can't lose the text. */
  setTimeout(function () {
    document
      .querySelectorAll('.hero__overline, .hero__display, .hero__line1, .hero__line2, .hero__divider, .hero__bottom-row, .hero__tagline')
      .forEach(function (el) { el.style.opacity = '1'; el.style.visibility = 'visible'; });
  }, 1500);

  /* =============================================
     GSAP ANIMATIONS
     ============================================= */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ------- HERO ENTRANCE SEQUENCE -------
     CSS sets opacity:0 on hero elements so they're invisible at load.
     fromTo() explicitly drives them to opacity:1 + transform:none so the
     reveal works regardless of CSS initial state. */
  const heroLine1  = document.querySelector('.hero__line1');
  const heroLine2  = document.querySelector('.hero__line2');
  const heroDivider = document.querySelector('.hero__divider');
  const heroBottom = document.querySelector('.hero__bottom-row');

  if (heroLine1) {
    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo('.hero__overline',  { autoAlpha: 0, y: 12 },           { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.1)
      .fromTo(heroLine1,          { autoAlpha: 0, y: 30 },           { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.3)
      .fromTo(heroLine2,          { autoAlpha: 0, y: 30 },           { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.45)
      .fromTo(heroDivider,        { autoAlpha: 0, scaleX: 0, transformOrigin: 'left' }, { autoAlpha: 1, scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0.6)
      .fromTo(heroBottom,         { autoAlpha: 0, y: 16 },           { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.75);
  }

  /* =============================================
     SCROLL-TRIGGERED ANIMATIONS

     RULE: Every scroll-triggered element is fully visible in CSS by
     default (opacity:1, transform:none). GSAP only animates a slight
     translateY entrance — never opacity. If GSAP fails, is slow, or is
     blocked, content is still readable. Headings are NEVER hidden.
     ============================================= */

  const slideUp = (selector, opts = {}) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      gsap.from(el, {
        y: opts.y ?? 20,
        duration: opts.duration ?? 0.6,
        ease: 'power3.out',
        delay: (opts.delay ?? 0) + (opts.stagger ? i * opts.stagger : 0),
        scrollTrigger: {
          trigger: el,
          start: opts.start ?? 'top 88%',
          toggleActions: 'play none none none',
        }
      });
    });
  };

  slideUp('.page-hero__title');
  slideUp('.section-title');
  slideUp('.section-label, .overline', { y: 12, duration: 0.45 });
  slideUp('.testimonial-item', { y: 24, duration: 0.7 });
  slideUp('.trainer-panel', { y: 28, duration: 0.7 });
  slideUp('.about-grid, .service-lead, .award-stat, .trainer-callout', { y: 22, duration: 0.7 });
  slideUp('.animate-element', { y: 22, duration: 0.6 });
  slideUp('.cta-section__title, .cta-section__desc, .cta-section__actions', { y: 16, duration: 0.55 });

  /* Card grids — stagger children by y offset only */
  document.querySelectorAll(
    '.services-grid, .pricing-grid, .about-values, .trainers-preview, .powerlift-gallery, .steps-list'
  ).forEach(grid => {
    gsap.from(Array.from(grid.children), {
      y: 28,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: grid,
        start: 'top 86%',
        toggleActions: 'play none none none',
      }
    });
  });

  /* Homepage service panels — same rule */
  const panels = document.querySelectorAll('.service-panel');
  if (panels.length) {
    gsap.from(panels, {
      y: 24,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.service-panels',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  }

  /* =============================================
     POPUP — 7-day cookie suppression, homepage-only
     ============================================= */
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, null);
  }

  (function initPopup() {
    const popup = document.getElementById('popup');
    if (!popup) return;

    if (getCookie('gym_popup_seen')) return;

    const path = window.location.pathname;
    if (path !== '/' && path !== '/index.html') return;

    let popupShown = false;
    let popupTimer;

    function showPopup() {
      if (popupShown) return;
      popupShown = true;
      setCookie('gym_popup_seen', '1', 7);
      popup.classList.add('is-visible');
      popup.setAttribute('aria-hidden', 'false');
      window.removeEventListener('scroll', onScroll);
      clearTimeout(popupTimer);
    }

    function closePopup() {
      popup.classList.remove('is-visible');
      popup.setAttribute('aria-hidden', 'true');
    }

    function onScroll() {
      if (popupShown) return;
      const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPct >= 50) showPopup();
    }

    popupTimer = setTimeout(showPopup, 25000);
    window.addEventListener('scroll', onScroll, { passive: true });

    popup.querySelectorAll('[data-popup-close]').forEach((el) => {
      el.addEventListener('click', closePopup);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('is-visible')) closePopup();
    });
  })();

  /* =============================================
     CONTACT FORM — Formspree fetch + inline success state
     ============================================= */
  (function initContactForm() {
    const form = document.querySelector('form[action*="formspree"]');
    if (!form) return;

    const successMsg = document.createElement('div');
    successMsg.className = 'form-success';
    successMsg.setAttribute('role', 'alert');
    successMsg.setAttribute('aria-live', 'polite');
    successMsg.innerHTML =
      '<div class="form-success__icon" aria-hidden="true">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#79992F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
      '</div>' +
      '<h3 class="form-success__title">Message sent.</h3>' +
      '<p class="form-success__desc">Rosemary and the team will be in touch soon — usually within a day.</p>';
    successMsg.style.display = 'none';
    form.parentNode.insertBefore(successMsg, form.nextSibling);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Form submission failed');

        form.style.opacity = '0';
        form.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          form.style.display = 'none';
          successMsg.style.display = 'flex';
          successMsg.style.opacity = '0';
          successMsg.style.transition = 'opacity 0.4s ease';
          requestAnimationFrame(() => { successMsg.style.opacity = '1'; });
        }, 300);
      } catch (err) {
        if (submitBtn) { submitBtn.textContent = originalText; submitBtn.disabled = false; }
        let errorEl = form.querySelector('.form-error');
        if (!errorEl) {
          errorEl = document.createElement('p');
          errorEl.className = 'form-error';
          errorEl.style.color = '#ff6b6b';
          errorEl.style.fontSize = '0.875rem';
          errorEl.style.marginTop = '0.75rem';
          form.appendChild(errorEl);
        }
        errorEl.textContent = 'Something went wrong. Please try again or call us directly at (520) 965-8962.';
      }
    });
  })();

});
