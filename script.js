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
    loadHTML('components/top-bar.html', 'top-bar-placeholder')
        .then(() => loadHTML('header.html', 'header-placeholder'))
        .then(() => {
            // Initialize mobile menu and dropdown after header is loaded
            initializeMobileMenu();
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
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const projectsButton = document.querySelector('#mobile-menu button');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    if (projectsButton) {
        projectsButton.addEventListener('click', () => {
            const dropdown = projectsButton.nextElementSibling;
            dropdown.classList.toggle('hidden');
            
            // Toggle arrow rotation
            const arrow = projectsButton.querySelector('svg');
            arrow.classList.toggle('rotate-180');
        });
    }
}

// Desktop dropdown functionality
function initializeDesktopDropdown() {
    const projectsButton = document.querySelector('.group button');
    const dropdown = document.querySelector('.group .hidden');

    if (projectsButton && dropdown) {
        // Remove any existing event listeners
        const newProjectsButton = projectsButton.cloneNode(true);
        projectsButton.parentNode.replaceChild(newProjectsButton, projectsButton);

        // Add new event listeners
        newProjectsButton.addEventListener('click', () => {
            dropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!newProjectsButton.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    }
}

// Counter animation
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(initializeCounters, 1);
        } else {
            counter.innerText = target;
        }
    });
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
        // Here you would typically send the form data to a server
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
} 