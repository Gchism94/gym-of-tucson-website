// Selecting elements from the DOM
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const navlogo = document.querySelector('#navbar__logo');
const body = document.querySelector('body');

// Event listener to run the script after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  setupInitialStates();
  setupEventListeners();
  setupAnimations();
  checkForPopupDisplay();

  // Handle the first class button
  const firstClassButton = document.getElementById("firstClassButton");
  console.log(firstClassButton); // Should log the button element or null if not found
  if (firstClassButton) {
      firstClassButton.addEventListener("click", function() {
          console.log("Button clicked!"); // This should log when the button is clicked
          window.open("https://www.wellnessliving.com/rs/catalog-view.html?k_business=291139&id_sale=1&k_id=824943", "_blank");
          closePopup();
      });
  } else {
      console.error("firstClassButton not found in the DOM.");
  }
});

function setupInitialStates() {
  // Set initial states for elements like hiding the callout
  const callout = document.querySelector('.hero-video .callout');
  if (callout) {
      gsap.set(callout, { autoAlpha: 0 }); // Prepare the callout for a smooth fadeIn
  }
}

function setupEventListeners() {
  // Navbar interactions
  menu.addEventListener('click', function() {
      menu.classList.toggle('is-active');
      menuLinks.classList.toggle('active');
      body.classList.toggle('active');
  });

  // Scroll interactions
  window.addEventListener('scroll', shrinkNavbar);

  // Popup interaction
  const closeButton = document.getElementById('close-popup-btn');
  const noThanksBtn = document.getElementById('no-thanks-btn');
  if (closeButton) closeButton.addEventListener('click', closePopup);
  if (noThanksBtn) noThanksBtn.addEventListener('click', closePopup);
}

function shrinkNavbar() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 0) {
      navbar.classList.add('shrink');
  } else {
      navbar.classList.remove('shrink');
  }
}

function setupAnimations() {
  // Define any GSAP animations for parts of your site here
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
  // Check if the popup should be displayed or not
  const popupContainer = document.querySelector('.popup-container-outer');
  const navigatedFromSite = sessionStorage.getItem('navigatedFromSite');
  if (!navigatedFromSite && popupContainer) {
      popupContainer.classList.remove('hidden');
  }
}

function closePopup() {
  const popupContainer = document.querySelector('.popup-container-outer');
  const callout = document.querySelector('.hero-video .callout');
  popupContainer.classList.add('hidden');

  if (callout) {
      gsap.to(callout, {
          autoAlpha: 1,
          duration: 0.25,
          ease: "power3.out"
      });
  }

  // Optionally play the video here, if applicable
  const videoElement = document.querySelector('.hero-video video');
  if (videoElement) videoElement.play();
}

function fadeInBetterEveryDayText() {
  const betterEveryDayText = document.querySelector('.callout h2');
  if (betterEveryDayText) {
      gsap.to(betterEveryDayText, {
          duration: 3,
          opacity: 1,
          y: 0,
          ease: 'power3.out',
      });
  }
}

// ACTIVE LINK HOVER EFFECT
let links = document.querySelectorAll('.navbar__link, .dropdown-content a');

// Get the current page URL
let currentPageUrl = window.location.href;

// Loop through all the links
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

// Handle dropdown link clicks
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

// Display Mobile Menu
const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
    body.classList.toggle('active');
};

menu.addEventListener('click', mobileMenu);

// Animations
gsap.registerPlugin(ScrollTrigger);

var animateTeamElements = document.querySelectorAll('.animate-team');
if (animateTeamElements.length > 0) {
  gsap.from(animateTeamElements, {
    scrollTrigger: animateTeamElements,
    duration: 1,
    opacity: 0,
    y: -150,
    stagger: 0.1, // Reduce the stagger delay to speed up the sequence
    delay: 0.2
  });
}

var animateTrainersElements = document.querySelectorAll('.animate-trainers');
if (animateTrainersElements.length > 0) {
  gsap.from(animateTrainersElements, {
    scrollTrigger: animateTrainersElements,
    duration: 1,
    opacity: 0,
    y: -150,
    stagger: 0.1, // Reduce the stagger delay to speed up the sequence
    delay: 0.2
  });
}

var animateEmailElements = document.querySelectorAll('.animate-email');
if (animateEmailElements.length > 0) {
  gsap.from(animateEmailElements, {
    scrollTrigger: animateEmailElements,
    duration: 1,
    opacity: 0,
    y: -150,
    stagger: 0.3,
    delay: 0.4
  });
}

// POPUP
document.addEventListener('DOMContentLoaded', () => {
  // Set up GSAP animations
  gsap.registerPlugin(ScrollTrigger);

  // Hide "Better Every Day" text initially
  const betterEveryDayText = document.querySelector('.callout h2');
  if (betterEveryDayText) {
      betterEveryDayText.style.opacity = 0;
  }

  // Handle popup close
  const closeButton = document.getElementById('close-popup-btn');
  const noThanksBtn = document.getElementById('no-thanks-btn');
  const popupContainer = document.querySelector('.popup-container-outer');
  const signupForm = document.getElementById("signup-form");

  // Check if the user has come from another page in the site.
  const navigatedFromSite = sessionStorage.getItem('navigatedFromSite');
  if (!navigatedFromSite) {
      // If not, display the popup and remove the hidden class.
      popupContainer.classList.remove('hidden');
  }
  else if (betterEveryDayText) {
    // If navigated from site (i.e., popup is not displayed), fade in the text.
    fadeInBetterEveryDayText();
  }

  const closePopup = () => {
    popupContainer.classList.add('hidden'); // This hides the popup
  
    // Fade in the .callout element
    const callout = document.querySelector('.hero-video .callout');
    if (callout) {
      callout.classList.remove('hidden-callout'); // Remove the class that hides the element
      gsap.to(callout, {
        autoAlpha: 1, // GSAP will handle the opacity and visibility
        duration: 1,
        ease: "power3.out"
      });
    }
  
    // Select the video element and play it
    const videoElement = document.querySelector('.hero-video video');
    if (videoElement) {
      videoElement.play();
    }
  
    // Fade in "Better Every Day" text
    fadeInBetterEveryDayText();
  };

  if(closeButton) {
      closeButton.addEventListener('click', closePopup);
  }

  if(noThanksBtn) {
      noThanksBtn.addEventListener('click', closePopup);
  }

  // Add event listener for the "Subscribe" button
  const subscribeButton = document.querySelector(".go952291206");
  if (subscribeButton) {
      subscribeButton.addEventListener("click", function(event) {
          event.preventDefault(); // Prevent the form from being submitted immediately

          // Check if the email input value is valid before submitting the form and hiding the popup
          const emailInput = signupForm.querySelector('input[type="email"]');
          if (emailInput.checkValidity()) {
              signupForm.submit();
              closePopup(); // Hide the popup container
          }
      });
  }
});

// ACCORDION
var acc = document.getElementsByClassName("accordion");
var i;

for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");

    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }

    // Here's the new part where we adjust the wrapper height
    var trainersCard = this.closest('.trainers__card');
    if (trainersCard.classList.contains('active')) {
      // if the accordion is active, set the wrapper height to auto
      trainersCard.style.height = 'auto';
    } else {
      // if the accordion is not active, remove the height style
      trainersCard.style.height = '';
    }

    // Here's the new part where we change the SVGs
    var inactiveIcon = this.querySelector('.accordion-icon-inactive');
    var activeIcon = this.querySelector('.accordion-icon-active');
    if (this.classList.contains('active')) {
      // if the accordion is active, hide the inactive SVG and show the active one
      inactiveIcon.style.display = 'none';
      activeIcon.style.display = 'inline-block';
    } else {
      // if the accordion is not active, show the inactive SVG and hide the active one
      inactiveIcon.style.display = 'inline-block';
      activeIcon.style.display = 'none';
    }
  });
}

// Powerlifting page image carousel
let slideIndex = 1;
showSlide(slideIndex);

function moveSlide(n) {
    showSlide(slideIndex += n);
}

function showSlide(n) {
    let slides = document.getElementsByClassName("carousel-slide");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slides[slideIndex-1].style.display = "block";  
}
