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
    // ==========================================================================
    // Nav Link Active State & Ambient Glow Transition Section Observer
    // ==========================================================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, footer');
    
    // Mapping of section IDs to color palettes for background ambient lights
    const glowColorPalettes = {
        'about': {
            glow1: 'rgba(139, 92, 246, 0.22)',
            glow2: 'rgba(99, 102, 241, 0.22)'
        },
        'services': {
            glow1: 'rgba(99, 102, 241, 0.24)',
            glow2: 'rgba(168, 85, 247, 0.24)'
        },
        'work': {
            glow1: 'rgba(6, 182, 212, 0.24)',
            glow2: 'rgba(59, 130, 246, 0.24)'
        },
        'contact': {
            glow1: 'rgba(236, 72, 153, 0.26)',
            glow2: 'rgba(139, 92, 246, 0.26)'
        }
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // Update nav links active class
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });

                // Smoothly update global CSS custom variables for glows
                if (glowColorPalettes[activeId]) {
                    const palette = glowColorPalettes[activeId];
                    document.documentElement.style.setProperty('--glow-color-1', palette.glow1);
                    document.documentElement.style.setProperty('--glow-color-2', palette.glow2);
                }
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
    // Interactive Terminal Controller
    // ==========================================================================
    const termInput = document.getElementById('terminal-input');
    const termOutput = document.getElementById('terminal-output');
    const shortcutBtns = document.querySelectorAll('.shortcut-btn');

    const addTerminalLine = (text, delay = 0, isSystem = false) => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            if (isSystem) {
                line.innerHTML = `<span class="system-tag">[SYS]</span> ${text}`;
            } else {
                line.innerHTML = text;
            }
            termOutput.appendChild(line);
            termOutput.scrollTop = termOutput.scrollHeight;
        }, delay);
    };

    const handleCommand = (cmd) => {
        const cleanCmd = cmd.trim().toLowerCase();
        if (!cleanCmd) return;

        // Print typed command
        addTerminalLine(`<span class="text-purple">arvi@core:~$</span> ${cmd}`);

        switch (cleanCmd) {
            case 'help':
                addTerminalLine('Available commands:', 100);
                addTerminalLine('  <span class="text-green">about</span>    - Display info about Arvi', 150);
                addTerminalLine('  <span class="text-green">skills</span>   - List specialized technologies', 200);
                addTerminalLine('  <span class="text-green">projects</span> - View active project details', 250);
                addTerminalLine('  <span class="text-green">contact</span>  - Connect directly on Telegram', 300);
                addTerminalLine('  <span class="text-green">clear</span>    - Clear the terminal logs', 350);
                break;
            case 'about':
                addTerminalLine('Running profile diagnostics...', 100, true);
                addTerminalLine('Subject: Arvi — AI & Web Systems Engineer.', 220);
                addTerminalLine('Core thesis: Build automated pipelines & custom architectures.', 320);
                addTerminalLine('Stack profile: LLMs, LangChain, Next.js, Node.js, Python.', 420);
                break;
            case 'skills':
                addTerminalLine('Fetching skill matrices...', 100, true);
                addTerminalLine('  • AI Integrations: LLMs, RAG, Agents (95%)', 200);
                addTerminalLine('  • Web architecting: Node, modern JS, React (92%)', 280);
                addTerminalLine('  • Micro-Automation: APIs, webhooks, bots (90%)', 360);
                break;
            case 'projects':
                addTerminalLine('Scanning filesystem for projects...', 100, true);
                addTerminalLine('  1. <span class="text-green">AI Financial Dashboard</span> [Status: Deployed]', 200);
                addTerminalLine('  2. <span class="text-green">Smart Analytics SaaS</span>   [Status: Active]', 300);
                addTerminalLine('  3. <span class="text-green">Telegram Commerce App</span> [Status: Finished]', 400);
                addTerminalLine('  * Click project cards below for full inspection.', 480);
                break;
            case 'contact':
                addTerminalLine('Establishing secure secure channel...', 100, true);
                addTerminalLine('Telegram: <a href="https://t.me/aclhemists" target="_blank" style="color:var(--accent-glow); text-decoration: underline;">@aclhemists</a>', 220);
                addTerminalLine('Send a message to start engineering.', 300);
                break;
            case 'clear':
                termOutput.innerHTML = '';
                addTerminalLine('<span class="system-tag">[SYS]</span> Logs cleared. System status: OPTIMAL.', 50);
                break;
            default:
                addTerminalLine(`Command not found: '${cmd}'. Type 'help' for options.`, 100);
        }
    };

    if (termInput) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = termInput.value;
                handleCommand(cmd);
                termInput.value = '';
            }
        });
    }

    shortcutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            handleCommand(cmd);
        });
    });

    // ==========================================================================
    // Custom Glowing Cursor Controller
    // ==========================================================================
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = cursor?.querySelector('.cursor-dot');
    const cursorRing = cursor?.querySelector('.cursor-ring');

    // Track absolute client coords for particles and cursor
    let absMouseX = 0;
    let absMouseY = 0;

    if (cursor && cursorDot && cursorRing) {
        let ringX = 0, ringY = 0;
        let isFirstMove = true;

        window.addEventListener('mousemove', (e) => {
            absMouseX = e.clientX;
            absMouseY = e.clientY;

            if (isFirstMove) {
                document.documentElement.classList.add('custom-cursor-active');
                cursor.style.opacity = '1';
                ringX = absMouseX;
                ringY = absMouseY;
                isFirstMove = false;
            }

            cursorDot.style.left = `${absMouseX}px`;
            cursorDot.style.top = `${absMouseY}px`;
        });

        // Smooth ring trailing using cubic interpolation
        const updateRing = () => {
            if (!isFirstMove) {
                ringX += (absMouseX - ringX) * 0.16;
                ringY += (absMouseY - ringY) * 0.16;
                cursorRing.style.left = `${ringX}px`;
                cursorRing.style.top = `${ringY}px`;
            }
            requestAnimationFrame(updateRing);
        };
        updateRing();

        // Register hover triggers
        const registerHoverListeners = () => {
            const targets = document.querySelectorAll('a, button, input, .project-card, .service-card, .logo, .shortcut-btn');
            targets.forEach(target => {
                target.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
                target.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
            });
        };
        registerHoverListeners();
    }

    // ==========================================================================
    // Cosmos Parallax & Cursor Reactive Particles Background
    // ==========================================================================
    const canvas = document.getElementById('cosmos-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        let numStars = 130;
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        // Smooth mouse coords tracking for particles
        let interpMouseX = 0;
        let interpMouseY = 0;

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
                    size: Math.random() * 1.6 + 0.4,
                    color: `rgba(${r}, ${g}, 250, `,
                    speedX: (Math.random() - 0.5) * 0.05,
                    speedY: -Math.random() * 0.12 - 0.04,
                    twinkleSpeed: Math.random() * 0.015 + 0.005,
                    alpha: Math.random(),
                    alphaDirection: Math.random() > 0.5 ? 1 : -1,
                    parallaxFactor: Math.random() * 10 + 3
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

            // Interpolate parallax offsets
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            // Interpolate absolute mouse positions for particle deflection
            interpMouseX += (absMouseX - interpMouseX) * 0.1;
            interpMouseY += (absMouseY - interpMouseY) * 0.1;

            stars.forEach(star => {
                // Natural drift
                star.x += star.speedX;
                star.y += star.speedY;

                // Screen boundary wrap
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                // Twinkle glow pulse
                star.alpha += star.twinkleSpeed * star.alphaDirection;
                if (star.alpha <= 0.1) {
                    star.alpha = 0.1;
                    star.alphaDirection = 1;
                } else if (star.alpha >= 0.75) {
                    star.alpha = 0.75;
                    star.alphaDirection = -1;
                }

                // Render with parallax offset
                let drawX = star.x - (mouseX / star.parallaxFactor);
                let drawY = star.y - (mouseY / star.parallaxFactor);

                // Cursor deflection math
                const dx = drawX - interpMouseX;
                const dy = drawY - interpMouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const repelRadius = 140;

                if (dist < repelRadius) {
                    // Push particles away proportionally to proximity
                    const force = (repelRadius - dist) / repelRadius * 15;
                    const angle = Math.atan2(dy, dx);
                    drawX += Math.cos(angle) * force;
                    drawY += Math.sin(angle) * force;
                }

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
    // Lenis Smooth Scroll Initialization & Jump Interceptor
    // ==========================================================================
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false
        });

        const lenisRaf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(lenisRaf);
        };
        requestAnimationFrame(lenisRaf);

        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    lenis.scrollTo(targetElement, {
                        offset: -20,
                        duration: 1.5
                    });
                }
            });
        });
    }
});
