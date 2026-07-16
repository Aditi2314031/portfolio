/* ==========================================================================
   JavaScript Interactivity - Aditi Tripathi Portfolio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STATE VARIABLES ---
    let currentPersona = 'ai-ml'; // Default persona
    let typingTimer = null;
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    // Typist strings mapping
    const typingStrings = {
        'ai-ml': [
            'AI / ML Engineering',
            'Deep Neural Networks',
            'Computer Vision & NLP',
            'Algorithmic Problem Solving'
        ],
        'web-dev': [
            'Frontend Development',
            'React Applications',
            'Responsive UI/UX Design',
            'Interactive Web Experiences'
        ]
    };

    // --- DOM ELEMENT SELECTORS ---
    const body = document.body;
    const btnAi = document.getElementById('btn-ai');
    const btnWeb = document.getElementById('btn-web');
    const typingTextEl = document.querySelector('.typing-text');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const header = document.querySelector('.header');
    
    // Mobile Nav selectors
    const mobileNavBtn = document.getElementById('mobile-nav-btn');
    const mobileNavCloseBtn = document.getElementById('mobile-nav-close-btn');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Project filter selectors
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Contact form elements
    const contactForm = document.getElementById('contact-form');
    const formMsg = document.getElementById('form-msg');
    
    // Scroll indicators & other elements
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // --------------------------------------------------------------------------
    // 1. Theme Management (Dark / Light)
    // --------------------------------------------------------------------------
    const initTheme = () => {
        const savedTheme = localStorage.getItem('aditi-portfolio-theme') || 'dark-theme';
        body.classList.remove('dark-theme', 'light-theme');
        body.classList.add(savedTheme);
        
        // Update icon based on theme
        const icon = themeToggleBtn.querySelector('i');
        if (savedTheme === 'light-theme') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    };

    themeToggleBtn.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-theme');
        const nextTheme = isDark ? 'light-theme' : 'dark-theme';
        
        body.classList.remove('dark-theme', 'light-theme');
        body.classList.add(nextTheme);
        localStorage.setItem('aditi-portfolio-theme', nextTheme);
        
        const icon = themeToggleBtn.querySelector('i');
        icon.className = nextTheme === 'light-theme' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });

    // --------------------------------------------------------------------------
    // 2. Mobile Navigation Toggle
    // --------------------------------------------------------------------------
    const openMobileMenu = () => {
        mobileNavMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scroll
    };

    const closeMobileMenu = () => {
        mobileNavMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    mobileNavBtn.addEventListener('click', openMobileMenu);
    mobileNavCloseBtn.addEventListener('click', closeMobileMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // Close on click outside side-menu
    document.addEventListener('click', (e) => {
        if (mobileNavMenu.classList.contains('active') && 
            !mobileNavMenu.contains(e.target) && 
            !mobileNavBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // --------------------------------------------------------------------------
    // 3. Dynamic Typing Text Animation
    // --------------------------------------------------------------------------
    const startTypingEffect = () => {
        // Clear existing intervals or timeouts
        if (typingTimer) clearTimeout(typingTimer);
        
        textIndex = 0;
        charIndex = 0;
        isDeleting = false;
        
        type();
    };

    const type = () => {
        const strings = typingStrings[currentPersona];
        const currentStr = strings[textIndex];
        
        if (isDeleting) {
            // Remove characters
            charIndex--;
        } else {
            // Add characters
            charIndex++;
        }
        
        typingTextEl.textContent = currentStr.substring(0, charIndex);
        
        // Typing speed calculations
        let speed = isDeleting ? 40 : 100;
        
        // Finished typing one full string
        if (!isDeleting && charIndex === currentStr.length) {
            speed = 1800; // Pause at the end of word
            isDeleting = true;
        } 
        // Finished deleting one full string
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % strings.length;
            speed = 400; // Pause before typing next word
        }
        
        typingTimer = setTimeout(type, speed);
    };

    // --------------------------------------------------------------------------
    // 4. Persona (Focus Profile) Switching Logic
    // --------------------------------------------------------------------------
    const switchPersona = (persona) => {
        if (persona === currentPersona) return;
        currentPersona = persona;
        
        // Update body attribute
        body.setAttribute('data-persona', persona);
        
        // Update switcher buttons
        if (persona === 'ai-ml') {
            btnAi.classList.add('active');
            btnWeb.classList.remove('active');
        } else {
            btnWeb.classList.add('active');
            btnAi.classList.remove('active');
        }

        // --- Visual Swapping of Text Elements ---
        const aiTextElements = document.querySelectorAll('.text-ai');
        const webTextElements = document.querySelectorAll('.text-web');
        
        if (persona === 'ai-ml') {
            aiTextElements.forEach(el => el.classList.remove('d-none'));
            webTextElements.forEach(el => el.classList.add('d-none'));
            
            // Auto click corresponding project filter
            triggerProjectFilter('ai-ml');
        } else {
            webTextElements.forEach(el => el.classList.remove('d-none'));
            aiTextElements.forEach(el => el.classList.add('d-none'));
            
            // Auto click corresponding project filter
            triggerProjectFilter('web-dev');
        }

        // Update resume download button href & text dynamically
        const resumeBtn = document.getElementById('resume-download-btn');
        if (resumeBtn) {
            if (persona === 'ai-ml') {
                resumeBtn.setAttribute('href', 'Aditi_Tripathi_ML_Resume.pdf');
                resumeBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download ML Resume';
            } else {
                resumeBtn.setAttribute('href', 'Aditi_Tripathi_Web_Resume.pdf');
                resumeBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download Web Resume';
            }
        }

        // --- Skill Card & Certification Highlights ---
        updateSkillHighlights();
        updateCertHighlights();
        
        // Reset typing animation
        startTypingEffect();
    };

    // Skills highlighting based on relevance (Keep all skills highlighted all the time)
    const updateSkillHighlights = () => {
        const skillItems = document.querySelectorAll('.skill-chip');
        skillItems.forEach(item => {
            item.classList.remove('dimmed');
        });
    };

    // Certifications highlighting based on relevance (Keep all certs highlighted all the time)
    const updateCertHighlights = () => {
        const certCards = document.querySelectorAll('.cert-card');
        certCards.forEach(card => {
            card.classList.remove('dimmed');
        });
    };

    btnAi.addEventListener('click', () => switchPersona('ai-ml'));
    btnWeb.addEventListener('click', () => switchPersona('web-dev'));

    // --------------------------------------------------------------------------
    // 5. Project Filtering Mechanics
    // --------------------------------------------------------------------------
    const triggerProjectFilter = (category) => {
        // Find corresponding button
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Filter projects
        projectCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
                card.classList.remove('dimmed');
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                card.classList.add('dimmed');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300); // match fade transition duration
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterVal = btn.getAttribute('data-filter');
            
            // Toggle active classes
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            triggerProjectFilter(filterVal);
        });
    });

    // --------------------------------------------------------------------------
    // 6. Number Counter Animation (Intersection Observer)
    // --------------------------------------------------------------------------
    const statNums = document.querySelectorAll('.stat-num');
    let hasCounted = false;

    const startCounters = () => {
        if (hasCounted) return;
        hasCounted = true;

        statNums.forEach(numEl => {
            const targetVal = parseInt(numEl.getAttribute('data-val'), 10);
            let currentVal = 0;
            const duration = 1500; // Total count duration in ms
            const stepTime = Math.max(Math.floor(duration / targetVal), 10);
            
            const counter = setInterval(() => {
                if (targetVal >= 100) {
                    currentVal += Math.ceil(targetVal / 50); // Larger steps for large numbers
                } else {
                    currentVal++;
                }

                if (currentVal >= targetVal) {
                    currentVal = targetVal;
                    clearInterval(counter);
                }
                
                // Add positive suffix for rating / counts if needed
                if (targetVal === 750) {
                    numEl.textContent = currentVal + '+';
                } else if (targetVal === 1500) {
                    numEl.textContent = currentVal + ' Rating';
                } else if (targetVal === 5) {
                    numEl.textContent = currentVal + ' ★';
                } else {
                    numEl.textContent = currentVal;
                }
            }, stepTime);
        });
    };

    // Setup intersection observer for statistics section
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        statsObserver.observe(statsSection);
    } else {
        // Fallback for browsers without IntersectionObserver
        setTimeout(startCounters, 2000);
    }

    // --------------------------------------------------------------------------
    // 7. Navbar Styling & Scroll to Top Button
    // --------------------------------------------------------------------------
    window.addEventListener('scroll', () => {
        // Scroll header styling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Scroll to top button visibility
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }

        // Active link on scroll indicator
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset for nav bar
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // --------------------------------------------------------------------------
    // 8. Contact Form Verification & Submissions
    // --------------------------------------------------------------------------
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic UI verification indicators
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitBtnText = submitBtn.querySelector('span');
            const submitBtnIcon = submitBtn.querySelector('i');
            
            // Get values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !subject || !message) {
                showFormResponse('Please fill in all required fields.', 'error');
                return;
            }
            
            // Simple Email Regex check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormResponse('Please provide a valid email address.', 'error');
                return;
            }

            // Mock submission visual feedback
            submitBtn.disabled = true;
            submitBtnText.textContent = 'Sending...';
            submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin';
            
            setTimeout(() => {
                showFormResponse(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtnText.textContent = 'Send Message';
                submitBtnIcon.className = 'fa-solid fa-paper-plane';
            }, 1800);
        });
    }

    const showFormResponse = (msg, type) => {
        formMsg.textContent = msg;
        formMsg.className = `form-response-msg ${type}`;
        
        // Hide after 5 seconds
        setTimeout(() => {
            formMsg.textContent = '';
            formMsg.className = 'form-response-msg';
        }, 5000);
    };

    // --------------------------------------------------------------------------
    // 9. Initialisations
    // --------------------------------------------------------------------------
    initTheme();
    startTypingEffect();
    updateSkillHighlights();
    updateCertHighlights();
    
    // Triggers project sorting based on default persona
    triggerProjectFilter('ai-ml');
});
