document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Header Scroll State Handler
    // ==========================================================================
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial load check

    // ==========================================================================
    // Scroll-Reveal Intersection Observer (Fade and Slide Up)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters fully
        threshold: 0.05
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it is a service card or project card, map hover values initially
                if (entry.target.classList.contains('service-card') || entry.target.classList.contains('project-card')) {
                    entry.target.style.setProperty('--mouse-x', `0px`);
                    entry.target.style.setProperty('--mouse-y', `0px`);
                }
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // Skills Progress Indicator and Percentage Counter Animation
    // ==========================================================================
    const skillsContainer = document.getElementById('skills-list-container');
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    const skillPercentages = document.querySelectorAll('.skill-percentage');
    let skillsAnimated = false;
    
    const animateSkills = () => {
        skillBars.forEach((bar, index) => {
            const percentageTextElement = skillPercentages[index];
            const targetVal = parseInt(percentageTextElement.getAttribute('data-target'), 10);
            
            // Set width of the bar (CSS handles transitions smoothly)
            bar.style.width = `${targetVal}%`;
            
            // Text count up timer
            let currentVal = 0;
            const duration = 1800; // ms
            const intervalTime = 25; // ms
            const stepsCount = duration / intervalTime;
            const stepVal = targetVal / stepsCount;
            
            const textCounter = setInterval(() => {
                currentVal += stepVal;
                if (currentVal >= targetVal) {
                    percentageTextElement.textContent = `${targetVal}%`;
                    clearInterval(textCounter);
                } else {
                    percentageTextElement.textContent = `${Math.floor(currentVal)}%`;
                }
            }, intervalTime);
        });
    };
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                animateSkills();
                skillsAnimated = true;
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    if (skillsContainer) {
        skillsObserver.observe(skillsContainer);
    }

    // ==========================================================================
    // Mouse Glow Spotlight Coordinates Mapping (Optimized with RAF)
    // ==========================================================================
    const spotlightCards = document.querySelectorAll('.service-card, .project-card');
    
    spotlightCards.forEach(card => {
        let isMoving = false;
        
        card.addEventListener('mousemove', (e) => {
            if (isMoving) return;
            isMoving = true;
            
            // Request Animation Frame for 60fps performance
            window.requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                isMoving = false;
            });
        });
    });

    // ==========================================================================
    // Card 3D Perspective Tilt on Hover
    // ==========================================================================
    const tiltCards = document.querySelectorAll('.project-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            window.requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const maxTiltAngleX = 6;
                const maxTiltAngleY = 6;
                
                const rotateX = -((y - centerY) / centerY) * maxTiltAngleX;
                const rotateY = ((x - centerX) / centerX) * maxTiltAngleY;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
        });
        
        card.addEventListener('mouseleave', () => {
            window.requestAnimationFrame(() => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
    
    // ==========================================================================
    // Nav Link Active state clicking updates
    // ==========================================================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, footer');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-40% 0px -50% 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ==========================================================================
    // Cosmos Parallax Particles Background
    // ==========================================================================
    const canvas = document.getElementById('cosmos-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        let numStars = 120;
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                const r = Math.floor(167 + Math.random() * 50);
                const g = Math.floor(139 + Math.random() * 50);
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.5 + 0.5,
                    color: `rgba(${r}, ${g}, 250, `,
                    speedX: (Math.random() - 0.5) * 0.05,
                    speedY: -Math.random() * 0.15 - 0.05, // Float upwards slowly
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    alpha: Math.random(),
                    alphaDirection: Math.random() > 0.5 ? 1 : -1,
                    parallaxFactor: Math.random() * 12 + 2 // Deeper stars move slower
                });
            }
        };

        window.addEventListener('resize', resizeCanvas, { passive: true });
        window.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX - window.innerWidth / 2);
            targetMouseY = (e.clientY - window.innerHeight / 2);
        }, { passive: true });

        const drawStars = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Interpolate mouse coordinates for smooth lag-free parallax
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            stars.forEach(star => {
                // Update coordinates
                star.x += star.speedX;
                star.y += star.speedY;

                // Screen boundaries wraps
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                // Twinkle alphas
                star.alpha += star.twinkleSpeed * star.alphaDirection;
                if (star.alpha <= 0.1) {
                    star.alpha = 0.1;
                    star.alphaDirection = 1;
                } else if (star.alpha >= 0.7) {
                    star.alpha = 0.7;
                    star.alphaDirection = -1;
                }

                // Render star with parallax offset
                const drawX = star.x - (mouseX / star.parallaxFactor);
                const drawY = star.y - (mouseY / star.parallaxFactor);

                ctx.beginPath();
                ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
                ctx.fillStyle = star.color + star.alpha + ')';
                ctx.fill();
            });

            requestAnimationFrame(drawStars);
        };

        resizeCanvas();
        drawStars();
    }

    // ==========================================================================
    // Lenis Smooth Inertial Scrolling
    // ==========================================================================
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Deceleration curve
            smoothWheel: true,
            smoothTouch: false
        });

        const lenisRaf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(lenisRaf);
        };
        requestAnimationFrame(lenisRaf);

        // Intercept anchor link jumps for smooth transitions
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    lenis.scrollTo(targetElement, {
                        offset: -20, // Offset for the fixed header
                        duration: 1.5
                    });
                }
            });
        });
    }
});
