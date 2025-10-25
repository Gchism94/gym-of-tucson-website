document.addEventListener("DOMContentLoaded", function() {
  const desktopVideo = document.getElementById('desktopVideo');
  const mobileVideo = document.getElementById('mobileVideo');
  const soundToggle = document.getElementById('soundToggle');

  // Determine which video is active based on screen width
  let activeVideo = window.innerWidth <= 767 ? mobileVideo : desktopVideo;

  if (activeVideo) {
    activeVideo.muted = true;
    activeVideo.play();

    // Intersection Observer: play when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activeVideo.play();
      });
    });
    observer.observe(activeVideo);

    // Resume video on tab visibility change
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible') {
        activeVideo.play();
      }
    });

    // Ensure video reloads after back navigation
    window.addEventListener('pageshow', function(event) {
      if (event.persisted) {
        activeVideo.load();
        activeVideo.play();
      }
    });
  }

  // Handle resizing — swap active video
  window.addEventListener('resize', () => {
    const newActive = window.innerWidth <= 767 ? mobileVideo : desktopVideo;
    if (newActive !== activeVideo) {
      activeVideo.pause();
      newActive.currentTime = activeVideo.currentTime;
      newActive.play();
      activeVideo = newActive;
    }
  });

  // Sound toggle
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (activeVideo.muted) {
        activeVideo.muted = false;
        soundToggle.textContent = '🔊';
      } else {
        activeVideo.muted = true;
        soundToggle.textContent = '🔇';
      }
    });
  }

  // ======================================================
  // EXISTING BEHAVIOR BELOW (UNCHANGED)
  // ======================================================

  setupInitialStates();
  setupEventListeners();
  setupAnimations();
  handleFirstClassButton();
  setupPopupTrigger();

  function setupInitialStates() {
    const callout = document.querySelector('.hero-video .callout');
    if (callout) {
      gsap.set(callout, { autoAlpha: 0 });
      gsap.to(callout, { autoAlpha: 1, duration: 0.25, ease: "power3.out" });
    }
  }

  function setupEventListeners() {
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.navbar__menu');
    const body = document.querySelector('body');
    const links = document.querySelectorAll('.navbar__social-link, .navbar__link');

    if (menu && menuLinks) {
      menu.addEventListener('click', function() {
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
        body.classList.toggle('active');
      });

      links.forEach(link => {
        link.addEventListener('click', function() {
          menu.classList.remove('is-active');
          menuLinks.classList.remove('active');
          body.classList.remove('active');
        });
      });
    }

    window.addEventListener('scroll', shrinkNavbar);

    const closeButton = document.getElementById('close-popup-btn');
    const noThanksBtn = document.getElementById('no-thanks-btn');
    if (closeButton) closeButton.addEventListener('click', closePopup);
    if (noThanksBtn) noThanksBtn.addEventListener('click', closePopup);
  }

  function shrinkNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 0) {
        navbar.classList.add('shrink');
      } else {
        navbar.classList.remove('shrink');
      }
    }
  }

  function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    const animateElements = document.querySelectorAll('.animate-element');
    animateElements.forEach(elem => {
      gsap.from(elem, {
        scrollTrigger: elem,
        duration: 1,
        opacity: 0,
        y: -150,
        stagger: 0.1,
        delay: 0.2
      });
    });
  }

  function checkForPopupDisplay() {
    const popupContainer = document.querySelector('.popup-container-outer');
    const navigatedFromSite = sessionStorage.getItem('navigatedFromSite');
    if (!navigatedFromSite && popupContainer) {
      gsap.fromTo(popupContainer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power3.out" });
      popupContainer.classList.remove('hidden');
    }
  }

  function closePopup() {
    const popupContainer = document.querySelector('.popup-container-outer');
    if (popupContainer) popupContainer.classList.add('hidden');
  }

  function handleFirstClassButton() {
    const firstClassButton = document.getElementById("firstClassButton");
    if (firstClassButton) {
      firstClassButton.addEventListener("click", function() {
        window.open("https://app.glofox.com/portal/#/branch/6793fe663ab733c6800a4510/memberships/6814f346b302b1661c0a6b47/plan/1746203423691/buy", "_blank");
        closePopup();
      });
    }
  }

  // ======================================================
    // Popup Trigger: time OR scroll
    // ======================================================
    function setupPopupTrigger() {
    let popupShown = false;

    function showPopup() {
        // Prevent multiple shows or repeat in same session
        if (popupShown || sessionStorage.getItem('popupShown') === 'true') return;
        popupShown = true;
        sessionStorage.setItem('popupShown', 'true');
        checkForPopupDisplay();
    }

    // Fallback timer — show after 25 seconds
    setTimeout(showPopup, 25000);

    // Engagement trigger — show after 50 % scroll depth
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (!popupShown && scrollPos / scrollHeight > 0.5) {
        showPopup();
        }
    });
    }

  // Carousel
  let slideIndex = 1;
  showSlide(slideIndex);
  function moveSlide(n) { showSlide(slideIndex += n); }
  function showSlide(n) {
    let slides = document.getElementsByClassName("carousel-slide");
    if (slides.length === 0) return;
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
  }

  // Active link highlighting
  let links = document.querySelectorAll('.navbar__link, .dropdown-content a');
  let currentPageUrl = window.location.href;
  links.forEach((link) => {
    if (link.href === currentPageUrl) {
      link.classList.add('active-link');
      let parentDropdown = link.closest('.dropdown');
      if (parentDropdown) parentDropdown.classList.add('dropdown-active');
    } else {
      link.classList.remove('active-link');
      let parentDropdown = link.closest('.dropdown');
      if (parentDropdown) parentDropdown.classList.remove('dropdown-active');
    }
  });

  let dropdownLinks = document.querySelectorAll('.dropdown-content a');
  dropdownLinks.forEach((link) => {
    link.addEventListener('click', function() {
      links.forEach((l) => l.classList.remove('active-link'));
      this.classList.add('active-link');
      let dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach((dropdown) => dropdown.classList.remove('active-child'));
      this.closest('.dropdown').classList.add('active-child');
    });
  });

  let navLinks = document.querySelectorAll('.navbar__link:not(.dropdown .navbar__link)');
  navLinks.forEach((link) => {
    link.addEventListener('click', function() {
      let dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach((dropdown) => dropdown.classList.remove('active-child'));
    });
  });

  // Accordion
  let acc = document.getElementsByClassName("accordion");
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      let panel = this.nextElementSibling;
      if (panel) panel.style.display = (panel.style.display === "block") ? "none" : "block";
      let trainersCard = this.closest('.trainers__card');
      if (trainersCard) trainersCard.style.height = trainersCard.classList.contains('active') ? 'auto' : '';
      let inactiveIcon = this.querySelector('.accordion-icon-inactive');
      let activeIcon = this.querySelector('.accordion-icon-active');
      if (inactiveIcon && activeIcon) {
        if (this.classList.contains('active')) {
          inactiveIcon.style.display = 'none';
          activeIcon.style.display = 'inline-block';
        } else {
          inactiveIcon.style.display = 'inline-block';
          activeIcon.style.display = 'none';
        }
      }
    });
  }
});
