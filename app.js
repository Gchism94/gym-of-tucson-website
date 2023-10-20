const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const navlogo = document.querySelector('#navbar__logo');
const body = document.querySelector('body');

// Select the navbar element
const navbar = document.querySelector('.navbar');

// Function to handle the scroll event
function shrinkNavbar() {
  if (window.scrollY > 0) {
    navbar.classList.add('shrink');
  } else {
    navbar.classList.remove('shrink');
  }
}

// Get the dropdown element
var dropdown = document.getElementById('servicesDropdown');

// Get the dropdown content
var dropdownContent = dropdown.getElementsByClassName('dropdown-content')[0];

// Variable to hold setTimeout
var timeout;

// Add an event listener for when the mouse enters the dropdown
dropdown.addEventListener('mouseenter', function() {
    clearTimeout(timeout);
    dropdownContent.style.display = 'block';
});

// Add an event listener for when the mouse leaves the dropdown
dropdown.addEventListener('mouseleave', function() {
    timeout = setTimeout(function() {
        dropdownContent.style.display = 'none';
    }, 200); 
});

// Add an event listener for when the mouse enters the dropdown content
dropdownContent.addEventListener('mouseenter', function() {
    clearTimeout(timeout);
});

// Add an event listener for when the mouse leaves the dropdown content
dropdownContent.addEventListener('mouseleave', function() {
    timeout = setTimeout(function() {
        dropdownContent.style.display = 'none';
    }, 200); 
});

// when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Add click event to dropdown trigger for mobile
  if (window.innerWidth <= 768) { 
    dropdown.addEventListener('click', function() {
      if (dropdownContent.style.display === 'none' || dropdownContent.style.display === '') {
        dropdownContent.style.display = 'block';
      } else {
        dropdownContent.style.display = 'none';
      }
    });

    // Remove hover event listeners for desktop
    dropdown.removeEventListener('mouseenter', showDropdown);
    dropdown.removeEventListener('mouseleave', hideDropdown);
  }
});

document.addEventListener("DOMContentLoaded", function() {
  var navbar = document.querySelector(".navbar__link, .navbar__logo"); // Replace ".navbar" with the appropriate selector for your navbar element
  navbar.classList.add("loaded");
});

// ACTIVE LINK HOVER EFFECT
// Get all navigation links and dropdown links
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

// Get all dropdown-content links
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

// Add the scroll event listener
window.addEventListener('scroll', shrinkNavbar);

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
      popupContainer.classList.add('hidden'); // Here we add 'hidden' class instead of setting display to 'none'

      // Fade in "Better Every Day" text
    fadeInBetterEveryDayText();
  };

  const firstClassButton = document.getElementById("firstClassButton");
  if (firstClassButton) {
      firstClassButton.addEventListener("click", function() {
          window.open("https://www.wellnessliving.com/rs/catalog-view.html?k_business=291139&id_sale=1&k_id=824943", "_blank");
          closePopup();
      });
  }

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
  function fadeInBetterEveryDayText() {
    if (betterEveryDayText) {
      gsap.to(betterEveryDayText, {
        duration: 3,
        opacity: 1,
        y: 0,
        ease: 'power3.out',
      });
    }
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

