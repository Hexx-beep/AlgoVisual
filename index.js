document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // MOBILE MENU FUNCTIONALITY
    // ======================
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            // Toggle menu visibility
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');
            
            // Change icon
            const icon = this.querySelector('i');
            if (mobileMenu.classList.contains('block')) {
                icon.classList.replace('fa-bars', 'fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on links
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
                mobileMenuButton.querySelector('i').classList.replace('fa-times', 'fa-bars');
                document.body.style.overflow = '';
            });
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
                mobileMenuButton.querySelector('i').classList.replace('fa-times', 'fa-bars');
                document.body.style.overflow = '';
            }
        });
    }

    // ======================
    // TUTORIAL MODAL FUNCTIONALITY
    // ======================
    const tutorialBtn = document.getElementById('tutorial-btn');
    const tutorialModal = document.getElementById('tutorial-modal');
    const closeTutorial = document.getElementById('close-tutorial');

    if (tutorialBtn && tutorialModal && closeTutorial) {
        tutorialBtn.addEventListener('click', function() {
            tutorialModal.classList.remove('hidden');
            tutorialModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        });

        closeTutorial.addEventListener('click', function() {
            tutorialModal.classList.add('hidden');
            tutorialModal.classList.remove('flex');
            document.body.style.overflow = '';
        });

        // Close when clicking outside modal content
        tutorialModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
                this.classList.remove('flex');
                document.body.style.overflow = '';
            }
        });
    }

    // ======================
    // THEME TOGGLE FUNCTIONALITY
    // ======================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    if (themeToggle) {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            html.classList.add('dark');
            themeToggle.innerHTML = '<i class="fas fa-moon text-xl"></i>';
        } else {
            html.classList.remove('dark');
            themeToggle.innerHTML = '<i class="fas fa-sun text-xl"></i>';
        }

        // Toggle theme
        themeToggle.addEventListener('click', function() {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            
            // Update icon
            this.innerHTML = isDark ? '<i class="fas fa-moon text-xl"></i>' : '<i class="fas fa-sun text-xl"></i>';
            
            // Save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // ======================
    // BACK BUTTON FUNCTIONALITY
    // ======================
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Navigate to index_light.html with smooth transition
            document.body.classList.add('page-fade-out');
            setTimeout(() => {
                window.location.href = 'index_light.html';
            }, 500);
        });
    }

    // ======================
    // PARTICLE EFFECTS
    // ======================
    function createParticles() {
        const container = document.querySelector('.fixed.inset-0');
        if (!container) return;

        // Clear existing particles
        container.querySelectorAll('.particle-bg').forEach(el => el.remove());

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
            container.appendChild(particle);
        }
    }
    createParticles();

    // ======================
    // SCROLL ANIMATIONS
    // ======================
    function animateOnScroll() {
        const cards = document.querySelectorAll('.card-hover, .animate-slide-in');
        cards.forEach((card) => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});

// ======================
// PAGE TRANSITION EFFECTS
// ======================
function navigateWithTransition(url) {
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Apply to all navigation links
document.querySelectorAll('a[href^="index"], a[href^="sort"], a[href^="trees"], a[href^="search"], a[href^="graph"]').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('target') !== '_blank') {
            e.preventDefault();
            navigateWithTransition(this.href);
        }
    });
});
