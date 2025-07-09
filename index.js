// Utility Functions
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Particle Effects
function createParticles() {
    const container = document.querySelector('.fixed.inset-0');
    if (!container) return;

    // Clear existing particles
    const existingParticles = container.querySelectorAll('.particle-bg');
    existingParticles.forEach(particle => particle.remove());

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        const colors = ['indigo', 'purple', 'blue'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        particle.className = `particle-bg absolute rounded-full bg-${randomColor}-400/20`;
        particle.style.width = `${Math.random() * 4 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite ${Math.random() * 5}s`;
        container.appendChild(particle);
    }
}

function navigateWithParticles(url) {
    // Create particle transition
    const particleTransition = document.createElement('div');
    particleTransition.className = 'particle-transition fixed inset-0 z-50 pointer-events-none';
    document.body.appendChild(particleTransition);

    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle absolute rounded-full bg-indigo-400/80';
        
        // Random direction and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 400;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        // Random position
        particle.style.left = `${50 + (Math.random() - 0.5) * 70}%`;
        particle.style.top = `${50 + (Math.random() - 0.5) * 70}%`;
        
        // Random size and delay
        particle.style.width = `${5 + Math.random() * 10}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        
        particleTransition.appendChild(particle);
    }

    // Activate transition
    setTimeout(() => {
        particleTransition.classList.add('active');
        
        // Fade out main content
        document.body.classList.add('page-fade-out');
        
        // Redirect after animation
        setTimeout(() => {
            window.location.href = url;
        }, 1500);
    }, 50);
}

// Navigation Functions
function setupNavigation() {
    // Back button
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            navigateWithParticles('index.html');
        });
    }

    // Page links with particle transitions
    const pageLinks = ['graph.html', 'trees.html', 'sort.html', 'search.html'];
    pageLinks.forEach(page => {
        document.querySelectorAll(`a[href="${page}"]`).forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateWithParticles(this.href);
            });
        });
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            this.classList.add('animate-spin');
            document.body.classList.add('page-fade-out');
            setTimeout(() => {
                const isDark = document.documentElement.classList.contains('dark');
                window.location.href = isDark ? 'index.html' : 'index_dark.html';
            }, 600);
        });
    }
}

// Mobile Menu
function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            // Toggle the menu-open class
            mobileMenu.classList.toggle('menu-open');
            
            // Change icon based on menu state
            const icon = mobileMenuButton.querySelector('i');
            if (mobileMenu.classList.contains('menu-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when a link is clicked
        const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('menu-open');
                const icon = mobileMenuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Tutorial Modal
function setupTutorialModal() {
    const tutorialBtn = document.getElementById('tutorial-btn');
    const closeTutorial = document.getElementById('close-tutorial');
    const tutorialModal = document.getElementById('tutorial-modal');

    if (tutorialBtn && tutorialModal && closeTutorial) {
        tutorialBtn.addEventListener('click', function() {
            tutorialModal.classList.remove('hidden');
            setTimeout(() => {
                tutorialModal.classList.add('modal-enter');
                tutorialModal.querySelector('.bg-white').classList.add('modal-content-enter');
            }, 10);
        });

        closeTutorial.addEventListener('click', function() {
            tutorialModal.classList.remove('modal-enter');
            tutorialModal.querySelector('.bg-white').classList.remove('modal-content-enter');
            setTimeout(() => {
                tutorialModal.classList.add('hidden');
            }, 300);
        });

        // Close when clicking outside modal
        tutorialModal.addEventListener('click', function(e) {
            if (e.target === tutorialModal) {
                tutorialModal.classList.remove('modal-enter');
                tutorialModal.querySelector('.bg-white').classList.remove('modal-content-enter');
                setTimeout(() => {
                    tutorialModal.classList.add('hidden');
                }, 300);
            }
        });
    }
}

// Animation Functions
function animateOnScroll() {
    const cards = document.querySelectorAll('.card-hover, .animate-slide-in');
    cards.forEach((card, index) => {
        const cardPosition = card.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        if (cardPosition < screenPosition) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

function initializeAnimations() {
    const headerTitle = document.querySelector('header h1');
    const headerSubtitle = document.querySelector('header p');
    
    if (headerTitle) headerTitle.style.opacity = '0';
    if (headerSubtitle) headerSubtitle.style.opacity = '0';
    
    setTimeout(() => {
        if (headerTitle) headerTitle.style.opacity = '1';
        if (headerSubtitle) headerSubtitle.style.opacity = '1';
    }, 300);
}

// Theme Management
function setupTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (savedTheme === 'dark') {
        html.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-moon text-xl"></i>';
    } else {
        html.classList.remove('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun text-xl"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-moon text-xl"></i>' : '<i class="fas fa-sun text-xl"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
    setupTheme();
    setupMobileMenu();
    setupTutorialModal();
    setupNavigation();
    initializeAnimations();
    createParticles();
    
    // Add scroll listener with debounce
    window.addEventListener('scroll', debounce(animateOnScroll));
});

window.addEventListener('load', function() {
    // Final check for animations after all assets load
    animateOnScroll();
});
