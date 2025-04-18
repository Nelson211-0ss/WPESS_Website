// Function to load HTML content
function loadHTML(url, elementId) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
            } else {
                console.error(`Element with id ${elementId} not found`);
            }
        })
        .catch(error => console.error(`Error loading ${url}:`, error));
}

// Function to load components
function loadComponents() {
    // Load components in sequence
    loadHTML('header.html', 'header-placeholder')
        .then(() => {
            // Initialize mobile menu and dropdown after header is loaded
            setupMobileMenu();
            initializeDesktopDropdown();
            return loadHTML('footer.html', 'footer-placeholder');
        })
        .then(() => {
            // Initialize AOS
            AOS.init({
                duration: 1000,
                once: true
            });

            // Initialize Swiper if it exists on the page
            if (document.querySelector('.partners-swiper')) {
                const swiper = new Swiper('.partners-swiper', {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    loop: true,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        640: {
                            slidesPerView: 2,
                        },
                        768: {
                            slidesPerView: 3,
                        },
                        1024: {
                            slidesPerView: 4,
                        },
                    },
                });
            }

            // Initialize counters if they exist on the page
            if (document.querySelector('.counter')) {
                initializeCounters();
            }
        })
        .catch(error => console.error('Error loading components:', error));
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', loadComponents);

// Mobile menu functionality
function setupMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    const closeButton = document.getElementById('mobile-menu-close');
    const projectsButton = document.getElementById('mobile-projects-button');
    const projectsDropdown = document.getElementById('mobile-projects-dropdown');

    if (!menuButton || !menu || !closeButton) {
        console.error('Mobile menu elements not found');
        return;
    }

    // Open menu
    menuButton.addEventListener('click', () => {
        menu.classList.remove('hidden');
        menu.style.display = 'block';
        menu.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
    });

    // Close menu
    function closeMenu() {
        menu.classList.add('hidden');
        menu.style.display = 'none';
        menu.style.visibility = 'hidden';
        document.body.style.overflow = '';
        if (projectsDropdown) {
            projectsDropdown.classList.add('hidden');
        }
    }

    // Close menu events
    closeButton.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
            closeMenu();
        }
    });

    // Projects dropdown
    if (projectsButton && projectsDropdown) {
        projectsButton.addEventListener('click', () => {
            projectsDropdown.classList.toggle('hidden');
            const arrow = projectsButton.querySelector('svg');
            if (arrow) {
                arrow.classList.toggle('rotate-180');
            }
        });
    }

    // Close menu when clicking any link
    const links = menu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Desktop dropdown functionality
function initializeDesktopDropdown() {
    const projectsButton = document.querySelector('.group button');
    const dropdown = document.querySelector('.group .hidden');

    if (!projectsButton || !dropdown) return;

    projectsButton.addEventListener('click', () => {
        dropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!projectsButton.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

// Counter animation
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const startTime = performance.now();
                
                const animate = (currentTime) => {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    const easeOutQuad = t => t * (2 - t);
                    const currentValue = Math.floor(easeOutQuad(progress) * target);
                    
                    counter.innerText = currentValue;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                requestAnimationFrame(animate);
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
} 