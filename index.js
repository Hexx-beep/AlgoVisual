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

// Page transition for navigation
function navigateTo(url) {
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 600);
}

// Go back button functionality
document.getElementById('back-button').addEventListener('click', function() {
    navigateTo('index.html');
});

// Theme toggle navigation with animation
document.getElementById('theme-toggle').addEventListener('click', function() {
    this.classList.add('animate-spin');
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = 'index_light.html'; // Goes to light version
    }, 600);
});
// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
            // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Check if elements exist
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
    } else {
        console.error("Mobile menu elements not found");
    }

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

// Initialize animations
window.addEventListener('load', () => {
    createParticles();
    animateOnScroll();
    setTimeout(() => {
        document.querySelector('header h1').style.opacity = '1';
        document.querySelector('header p').style.opacity = '1';
    }, 300);
});

// Animate cards on scroll
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
function navigateWithParticles(url) {
// Create particle transition
const particleTransition = document.createElement('div');
particleTransition.className = 'particle-transition';
document.body.appendChild(particleTransition);

// Create particles
for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random direction and distance
    const angle = Math.random() * Math.PI * 7;
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

    // Apply to back button
    document.getElementById('back-button').addEventListener('click', function(e) {
        e.preventDefault();
        navigateWithParticles('index.html');
    });

    // Apply to all comp_graph2.html links
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

window.addEventListener('scroll', animateOnScroll);
