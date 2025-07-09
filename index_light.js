// Floating particles
function createParticles() {
    const container = document.querySelector('.fixed.inset-0');
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = `absolute rounded-full bg-${['indigo','purple','blue'][Math.floor(Math.random()*3)]}-400/40`;
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
    navigateTo('index2.html');
});

// Theme toggle navigation with animation
document.getElementById('theme-toggle').addEventListener('click', function() {
    this.classList.add('animate-spin');
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 600);
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

window.addEventListener('scroll', animateOnScroll);