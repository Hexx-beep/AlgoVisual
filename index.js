// ======================
// DOM ELEMENT REFERENCES
// ======================
const elements = {
  mobileMenuButton: document.getElementById('mobile-menu-button'),
  mobileMenu: document.getElementById('mobile-menu'),
  tutorialBtn: document.getElementById('tutorial-btn'),
  tutorialModal: document.getElementById('tutorial-modal'),
  closeTutorial: document.getElementById('close-tutorial'),
  themeToggle: document.getElementById('theme-toggle'),
  html: document.documentElement,
  particleContainer: document.querySelector('.fixed.inset-0')
};

// =================
// UTILITY FUNCTIONS
// =================
const utils = {
  // Debounce function for scroll events
  debounce: (func, wait = 100) => {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  },

  // Check if element exists
  exists: (element) => {
    return element !== null && element !== undefined;
  }
};

// ================
// MOBILE MENU
// ================
const mobileMenu = {
  init: () => {
    if (!utils.exists(elements.mobileMenuButton) || !utils.exists(elements.mobileMenu)) return;

    elements.mobileMenuButton.addEventListener('click', mobileMenu.toggle);
    
    // Close menu when clicking on links
    document.querySelectorAll('#mobile-menu a').forEach(link => {
      link.addEventListener('click', mobileMenu.close);
    });
  },

  toggle: () => {
    elements.mobileMenu.classList.toggle('hidden');
    const icon = elements.mobileMenuButton.querySelector('i');
    
    if (elements.mobileMenu.classList.contains('hidden')) {
      icon.classList.replace('fa-times', 'fa-bars');
    } else {
      icon.classList.replace('fa-bars', 'fa-times');
    }
  },

  close: () => {
    elements.mobileMenu.classList.add('hidden');
    const icon = elements.mobileMenuButton.querySelector('i');
    icon.classList.replace('fa-times', 'fa-bars');
  }
};

// ================
// TUTORIAL MODAL
// ================
const tutorialModal = {
  init: () => {
    if (!utils.exists(elements.tutorialBtn) || 
        !utils.exists(elements.tutorialModal) || 
        !utils.exists(elements.closeTutorial)) return;

    elements.tutorialBtn.addEventListener('click', tutorialModal.open);
    elements.closeTutorial.addEventListener('click', tutorialModal.close);
    
    // Close when clicking outside modal content
    elements.tutorialModal.addEventListener('click', (e) => {
      if (e.target === elements.tutorialModal) {
        tutorialModal.close();
      }
    });
  },

  open: () => {
    elements.tutorialModal.classList.remove('hidden');
    elements.tutorialModal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  },

  close: () => {
    elements.tutorialModal.classList.add('hidden');
    elements.tutorialModal.classList.remove('flex');
    document.body.style.overflow = ''; // Re-enable scrolling
  }
};

// ================
// THEME TOGGLE
// ================
const theme = {
  init: () => {
    if (!utils.exists(elements.themeToggle)) return;

    // Set initial theme
    theme.setInitialTheme();
    
    // Add event listener
    elements.themeToggle.addEventListener('click', theme.toggle);
  },

  setInitialTheme: () => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      theme.enableDarkMode();
    } else {
      theme.enableLightMode();
    }
  },

  toggle: () => {
    if (elements.html.classList.contains('light')) {
      theme.enableLightMode();
    } else {
      theme.enableDarkMode();
    }
  },

  enableDarkMode: () => {
    elements.html.classList.add('light');
    elements.themeToggle.innerHTML = '<i class="fas fa-moon text-xl"></i>';
    localStorage.setItem('theme', 'dark');
  },

  enableLightMode: () => {
    elements.html.classList.remove('dark');
    elements.themeToggle.innerHTML = '<i class="fas fa-sun text-xl"></i>';
    localStorage.setItem('theme', 'light');
  }
};

// ================
// PARTICLE EFFECTS
// ================
const particles = {
  init: () => {
    if (!utils.exists(elements.particleContainer)) return;
    particles.create();
  },

  create: () => {
    // Clear existing particles
    elements.particleContainer.querySelectorAll('.particle-bg').forEach(el => el.remove());

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      const colors = ['indigo', 'purple', 'blue'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      particle.className = `particle-bg absolute rounded-full bg-${randomColor}-400/30`;
      particle.style.width = `${Math.random() * 4 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite ${Math.random() * 5}s`;
      
      elements.particleContainer.appendChild(particle);
    }
  }
};

// ================
// SCROLL ANIMATIONS
// ================
const scrollAnimations = {
  init: () => {
    window.addEventListener('scroll', utils.debounce(scrollAnimations.animateElements));
    window.addEventListener('load', scrollAnimations.animateElements);
  },

  animateElements: () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.8;

    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      
      if (elementPosition < triggerPoint) {
        element.classList.add('animated');
      }
    });
  }
};

// ================
// INITIALIZATION
// ================
document.addEventListener('DOMContentLoaded', () => {
  mobileMenu.init();
  tutorialModal.init();
  theme.init();
  particles.init();
  scrollAnimations.init();
});
