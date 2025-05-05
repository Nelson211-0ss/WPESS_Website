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

// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', setupMobileMenu); 