document.addEventListener("DOMContentLoaded", function() {
    const videoElement = document.querySelector('.hero-video video');
  
    if (videoElement) {
        // Play the video on initial load
        videoElement.play();
  
        // Use the Intersection Observer to play the video when it becomes visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    videoElement.play();
                }
            });
        });
  
        observer.observe(videoElement);
  
        // Play video when page becomes visible again (e.g., switching tabs)
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                videoElement.play();
            }
        });
  
        // Ensure video plays after back navigation
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                // Reload the video when coming back from history
                videoElement.load();
                videoElement.play();
            }
        });
    }
  
    // Other DOM content loaded functions and event listeners can go here
    setupInitialStates();
    setupEventListeners();
    setupAnimations();
    handleFirstClassButton();
  
    // Set up the popup to display after 8 seconds
    setTimeout(checkForPopupDisplay, 8000);
    
    function setupInitialStates() {
        const callout = document.querySelector('.hero-video .callout');
        if (callout) {
            gsap.set(callout, { autoAlpha: 0 });
            gsap.to(callout, {
                autoAlpha: 1,
                duration: 0.25,
                ease: "power3.out"
            });
        }
    }
  
    function setupEventListeners() {
        const menu = document.querySelector('#mobile-menu');
        const menuLinks = document.querySelector('.navbar__menu');
        const body = document.querySelector('body');
  
        if (menu && menuLinks) {
            menu.addEventListener('click', function() {
                menu.classList.toggle('is-active');
                menuLinks.classList.toggle('active');
                body.classList.toggle('active');
            });
        } else {
            console.error("#mobile-menu or .navbar__menu not found");
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
        } else {
            console.error(".navbar not found in the DOM.");
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
            gsap.fromTo(popupContainer, {
                autoAlpha: 0
            }, {
                autoAlpha: 1,
                duration: 0.5,
                ease: "power3.out"
            });
            popupContainer.classList.remove('hidden');
        }
    }
  
    function closePopup() {
        const popupContainer = document.querySelector('.popup-container-outer');
        if (popupContainer) {
            popupContainer.classList.add('hidden');
        }
    }
  
    function handleFirstClassButton() {
        const firstClassButton = document.getElementById("firstClassButton");
        if (firstClassButton) {
            firstClassButton.addEventListener("click", function() {
                console.log("Button clicked!");
                window.open("https://www.wellnessliving.com/rs/catalog-view.html?k_business=291139&id_sale=1&k_id=3374746", "_blank");
                closePopup();
            });
        } else {
            console.error("firstClassButton not found in the DOM.");
        }
    }
  
    // Slide Carousel Functionality
    let slideIndex = 1;
    showSlide(slideIndex);
  
    function moveSlide(n) {
        showSlide(slideIndex += n);
    }
  
    function showSlide(n) {
        let slides = document.getElementsByClassName("carousel-slide");
  
        if (slides.length === 0) {
            console.error("No slides found with the class 'carousel-slide'");
            return;
        }
  
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
  
        for (let i = 0; i < slides.length; i++) {
            if (slides[i]) {
                slides[i].style.display = "none";
            } else {
                console.warn(`Slide at index ${i} is undefined`);
            }
        }
  
        if (slides[slideIndex - 1]) {
            slides[slideIndex - 1].style.display = "block";
        } else {
            console.error(`Slide at index ${slideIndex - 1} is undefined`);
        }
    }
  
    // ACTIVE LINK HOVER EFFECT
    let links = document.querySelectorAll('.navbar__link, .dropdown-content a');
    let currentPageUrl = window.location.href;
  
    links.forEach((link) => {
        if (link.href === currentPageUrl) {
            link.classList.add('active-link');
            let parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.classList.add('dropdown-active');
            }
        } else {
            link.classList.remove('active-link');
            let parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.classList.remove('dropdown-active');
            }
        }
    });
  
    let dropdownLinks = document.querySelectorAll('.dropdown-content a');
    dropdownLinks.forEach((link) => {
        link.addEventListener('click', function() {
            links.forEach((l) => {
                l.classList.remove('active-link');
            });
            this.classList.add('active-link');
            let dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach((dropdown) => {
                dropdown.classList.remove('active-child');
            });
            this.closest('.dropdown').classList.add('active-child');
        });
    });
  
    let navLinks = document.querySelectorAll('.navbar__link:not(.dropdown .navbar__link)');
    navLinks.forEach((link) => {
        link.addEventListener('click', function() {
            let dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach((dropdown) => {
                dropdown.classList.remove('active-child');
            });
        });
    });
  
    // ACCORDION
    let acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
  
            let panel = this.nextElementSibling;
            if (panel) {
                panel.style.display = (panel.style.display === "block") ? "none" : "block";
            }
  
            let trainersCard = this.closest('.trainers__card');
            if (trainersCard) {
                trainersCard.style.height = trainersCard.classList.contains('active') ? 'auto' : '';
            }
  
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