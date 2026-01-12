document.addEventListener('DOMContentLoaded', () => {
    // Page Navigation with Transition Animation
    document.querySelectorAll('a:not([href^="#"])').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Only animate for internal navigation
            if (href && (href.endsWith('.html') || href === 'index.html')) {
                e.preventDefault();
                document.body.classList.add('page-exit');
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            }
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header height
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Optional: Add simple fade-in on scroll using IntersectionObserver
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial styles for animation
    const animatedElements = document.querySelectorAll('.hero-content, .project-card, .service-item, .stat-box, .mission-grid, .step-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        fadeObserver.observe(el);
    });

    // Form Submission Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formWrapper = contactForm.closest('.form-wrapper');
            const successMessage = document.getElementById('success-message');
            const formData = new FormData(contactForm);

            if (formWrapper && successMessage) {
                // Start submission transition
                formWrapper.classList.add('is-submitting');

                try {
                    const response = await fetch(contactForm.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    // Formspree returns 200 on success
                    if (response.ok) {
                        // Fade out form
                        formWrapper.classList.add('is-sent');

                        // After form fades out, show success message
                        setTimeout(() => {
                            formWrapper.classList.add('hidden');
                            successMessage.classList.add('show');
                            contactForm.reset();
                        }, 500);
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('There was an error sending your message. Please try again.');
                    formWrapper.classList.remove('is-submitting');
                }
            }
        });
    }

    // Service Accordion Functionality
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close other items
            serviceItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});
