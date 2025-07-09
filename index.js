// Mobile menu functionality
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenu = document.getElementById('close-mobile-menu');

mobileMenuButton.addEventListener('click', function() {
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
        mobileMenu.querySelector('.absolute').classList.remove('translate-x-full');
    }, 10);
});

closeMobileMenu.addEventListener('click', function() {
    mobileMenu.querySelector('.absolute').classList.add('translate-x-full');
    setTimeout(() => {
        mobileMenu.classList.add('hidden');
    }, 300);
});

// Close mobile menu when clicking on a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', function() {
        mobileMenu.querySelector('.absolute').classList.add('translate-x-full');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
    });
});

// Tutorial button for mobile
document.getElementById('tutorial-btn-mobile').addEventListener('click', function() {
    // Close mobile menu first
    mobileMenu.querySelector('.absolute').classList.add('translate-x-full');
    setTimeout(() => {
        mobileMenu.classList.add('hidden');
        
        // Open tutorial modal
        const modal = document.getElementById('tutorial-modal');
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('modal-enter');
            modal.querySelector('.bg-white').classList.add('modal-content-enter');
        }, 10);
    }, 300);
});

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', function() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        this.innerHTML = '<i class="fas fa-moon text-xl"></i>';
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        this.innerHTML = '<i class="fas fa-sun text-xl"></i>';
    }
});

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun text-xl"></i>';
} else {
    document.documentElement.classList.remove('dark');
    document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon text-xl"></i>';
}

// Tutorial modal functionality
document.getElementById('tutorial-btn').addEventListener('click', function() {
    const modal = document.getElementById('tutorial-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('modal-enter');
        modal.querySelector('.bg-white').classList.add('modal-content-enter');
    }, 10);
});

document.getElementById('close-tutorial').addEventListener('click', function() {
    const modal = document.getElementById('tutorial-modal');
    modal.classList.remove('modal-enter');
    modal.querySelector('.bg-white').classList.remove('modal-content-enter');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
});

// Create floating particles
function createParticles() {
    const container = document.querySelector('.fixed.inset-0');
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = `absolute rounded-full bg-${['indigo','purple','blue'][Math.floor(Math.random()*3)]}-400/20`;
        particle.style.width = `${Math.random() * 4 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite ${Math.random() * 5}s`;
        container.appendChild(particle);
    }
}

// Navigation with particle transition
function navigateWithParticles(url) {
    // Create particle transition
    const particleTransition = document.createElement('div');
    particleTransition.className = 'fixed inset-0 bg-black/70 z-50 flex items-center justify-center';
    particleTransition.style.backdropFilter = 'blur(5px)';
    document.body.appendChild(particleTransition);

    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'relative w-full h-full';
    particleTransition.appendChild(particlesContainer);

    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full bg-white';
        
        // Random position
        particle.style.left = `${50 + (Math.random() - 0.5) * 70}%`;
        particle.style.top = `${50 + (Math.random() - 0.5) * 70}%`;
        
        // Random size
        const size = 5 + Math.random() * 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random animation
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 400;
        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
        particle.style.opacity = '0';
        particle.style.transition = `all ${0.5 + Math.random() * 0.5}s ease-in ${Math.random() * 0.3}s`;
        
        particlesContainer.appendChild(particle);
    }

    // Fade out content
    document.body.classList.add('opacity-0', 'transition-opacity', 'duration-500');

    // Activate particle animation
    setTimeout(() => {
        particlesContainer.querySelectorAll('div').forEach(particle => {
            particle.style.transform = 'translate(0, 0)';
            particle.style.opacity = '0.7';
        });
        
        // Redirect after animation
        setTimeout(() => {
            window.location.href = url;
        }, 800);
    }, 50);
}

// Apply navigation to all links
document.getElementById('back-button').addEventListener('click', function(e) {
    e.preventDefault();
    navigateWithParticles('index.html');
});

document.querySelectorAll('a[href="graph.html"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navigateWithParticles(this.href);
    });
});

document.querySelectorAll('a[href="trees.html"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navigateWithParticles(this.href);
    });
});

document.querySelectorAll('a[href="sort.html"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navigateWithParticles(this.href);
    });
});

document.querySelectorAll('a[href="search.html"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navigateWithParticles(this.href);
    });
});

// Initialize on load
window.addEventListener('load', () => {
    createParticles();
    
    // Fade in content
    setTimeout(() => {
        document.body.classList.remove('opacity-0');
    }, 100);
});

// Animate elements on scroll
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

window.addEventListener('scroll', animateOnScroll);
