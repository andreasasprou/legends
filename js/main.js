// Loader
window.addEventListener('load', () => {
    let counter = 0;
    const loaderNumber = document.querySelector('.loader-number span');
    const loader = document.querySelector('.loader');
    
    const interval = setInterval(() => {
        counter += 5;
        loaderNumber.textContent = counter;
        
        if (counter >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                initAnimations();
            }, 500);
        }
    }, 50);
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorTrail = document.querySelector('.cursor-trail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// Cursor trail animation
function animateTrail() {
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;
    
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
    cursorTrail.style.opacity = '0.3';
    
    requestAnimationFrame(animateTrail);
}
animateTrail();

// Hover effects
const hoverElements = document.querySelectorAll('a, button, .collage-item, .play-button, .menu-toggle');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// Navigation
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');
const fullscreenMenu = document.getElementById('fullscreenMenu');
let lastScroll = 0;

// Scroll effect
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Menu toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    fullscreenMenu.classList.toggle('active');
    document.body.style.overflow = fullscreenMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu on link click
document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        fullscreenMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Hero Canvas Animation
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(255, 77, 0, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if (distance < 150) {
                    ctx.strokeStyle = `rgba(255, 77, 0, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Trajectory Canvas Animation
function initTrajectoryCanvas() {
    const canvas = document.getElementById('trajectoryCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let time = 0;
    
    function drawTrajectory() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        
        for (let i = 0; i < canvas.height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Draw trajectory path
        ctx.strokeStyle = '#FF4D00';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FF4D00';
        
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 5) {
            const t = x / canvas.width;
            const y = canvas.height * 0.8 - 
                     (Math.sin(t * Math.PI) * 300) + 
                     (Math.sin(t * Math.PI * 4 + time) * 20);
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Draw ball
        const ballT = (Math.sin(time * 0.5) + 1) / 2;
        const ballX = ballT * canvas.width;
        const ballY = canvas.height * 0.8 - 
                     (Math.sin(ballT * Math.PI) * 300) + 
                     (Math.sin(ballT * Math.PI * 4 + time) * 20);
        
        ctx.fillStyle = '#FFD600';
        ctx.shadowColor = '#FFD600';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 15, 0, Math.PI * 2);
        ctx.fill();
        
        time += 0.02;
        requestAnimationFrame(drawTrajectory);
    }
    
    drawTrajectory();
}

// Reveal animations
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal, .reveal-scale');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    reveals.forEach(el => observer.observe(el));
}

// Initialize animations
function initAnimations() {
    initHeroCanvas();
    initTrajectoryCanvas();
    initRevealAnimations();
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Play button interaction
const playButton = document.querySelector('.play-button');
if (playButton) {
    playButton.addEventListener('click', () => {
        console.log('Game experience would start here');
        // Add game initialization
    });
}

// Parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    document.querySelectorAll('.floating-element').forEach((el, i) => {
        const speed = (i + 1) * 20;
        el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// 1. Blob Cursor Effect
const blobCursor = document.querySelector('.blob-cursor');
let blobX = 0, blobY = 0;
let currentBlobX = 0, currentBlobY = 0;

document.addEventListener('mousemove', (e) => {
    blobX = e.clientX - 100;
    blobY = e.clientY - 100;
});

function animateBlobCursor() {
    currentBlobX += (blobX - currentBlobX) * 0.05;
    currentBlobY += (blobY - currentBlobY) * 0.05;
    
    blobCursor.style.transform = `translate(${currentBlobX}px, ${currentBlobY}px)`;
    requestAnimationFrame(animateBlobCursor);
}
animateBlobCursor();

// 2. Magnetic Buttons
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// 3. Particle System
const particleCanvas = document.getElementById('particleCanvas');
const pCtx = particleCanvas.getContext('2d');

particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.5 ? '#FF4D00' : '#00FF88';
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > particleCanvas.width) this.x = 0;
        if (this.x < 0) this.x = particleCanvas.width;
        if (this.y > particleCanvas.height) this.y = 0;
        if (this.y < 0) this.y = particleCanvas.height;
        
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            this.x -= dx * force * 0.03;
            this.y -= dy * force * 0.03;
        }
    }
    
    draw() {
        pCtx.fillStyle = this.color;
        pCtx.globalAlpha = this.opacity;
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fill();
    }
}

const particles = Array.from({ length: 100 }, () => new Particle());

function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateParticles);
}
animateParticles();

// 5. 3D Tilt Effect
const tiltCards = document.querySelectorAll('.collage-item');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const tiltX = (y - 0.5) * 20;
        const tiltY = (x - 0.5) * -20;
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// 6. Text Scramble Effect
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += char;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply text scramble to section titles on hover
document.querySelectorAll('.section-title').forEach(title => {
    const fx = new TextScramble(title);
    const originalText = title.innerText;
    
    // Store original dimensions (now fixed at 320px height via CSS)
    const originalWidth = title.offsetWidth;
    
    title.addEventListener('mouseenter', () => {
        // Lock width and ensure fixed height is maintained during animation
        title.style.width = originalWidth + 'px';
        title.style.height = '320px';
        title.style.overflow = 'hidden';
        title.style.display = 'flex';
        title.style.flexDirection = 'column';
        title.style.justifyContent = 'center';
        title.style.alignItems = 'flex-start';
        
        fx.setText(originalText);
    });
    
    title.addEventListener('mouseleave', () => {
        // Reset only width, keep height fixed
        setTimeout(() => {
            title.style.width = '';
            // Don't reset height - keep it at 320px from CSS
        }, 100);
    });
});

// 7. Audio-reactive elements (visual only)
let audioVisualizerActive = false;
const playBtn = document.querySelector('.play-button');

playBtn.addEventListener('click', () => {
    audioVisualizerActive = !audioVisualizerActive;
    
    if (audioVisualizerActive) {
        document.body.style.background = 'radial-gradient(circle at center, #0a0a0a, #000)';
        
        // Simulate audio visualization
        const visualize = () => {
            if (!audioVisualizerActive) return;
            
            document.querySelectorAll('.floating-element').forEach(el => {
                const scale = 1 + Math.random() * 0.5;
                el.style.transform = `scale(${scale})`;
            });
            
            setTimeout(visualize, 100);
        };
        visualize();
    }
});

// 8. Smooth Parallax Scrolling Sections
const parallaxSections = document.querySelectorAll('.collage-section, .trajectory-section, .play-section');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxSections.forEach((section, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        section.style.transform = `translateY(${yPos}px)`;
    });
});

// 9. Mouse Trail Effect
const createTrail = (e) => {
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.width = '10px';
    trail.style.height = '10px';
    trail.style.background = '#FF4D00';
    trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.opacity = '1';
    trail.style.transition = 'all 1s ease-out';
    trail.style.zIndex = '9999';
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(2) translateY(20px)';
    }, 10);
    
    setTimeout(() => {
        trail.remove();
    }, 1000);
};

let mouseTrailActive = false;
document.addEventListener('click', () => {
    mouseTrailActive = !mouseTrailActive;
});

document.addEventListener('mousemove', (e) => {
    if (mouseTrailActive && Math.random() > 0.9) {
        createTrail(e);
    }
});

// 10. Dynamic Color Theme
const colors = ['#FF4D00', '#00FF88', '#FFD600', '#FF00FF', '#00FFFF'];
let currentColorIndex = 0;

document.addEventListener('keypress', (e) => {
    if (e.key === 'c') {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        document.documentElement.style.setProperty('--orange', colors[currentColorIndex]);
        
        // Color wave effect
        const wave = document.createElement('div');
        wave.style.position = 'fixed';
        wave.style.top = '50%';
        wave.style.left = '50%';
        wave.style.width = '0';
        wave.style.height = '0';
        wave.style.background = colors[currentColorIndex];
        wave.style.borderRadius = '50%';
        wave.style.opacity = '0.5';
        wave.style.transform = 'translate(-50%, -50%)';
        wave.style.transition = 'all 1s ease-out';
        wave.style.pointerEvents = 'none';
        wave.style.zIndex = '9998';
        
        document.body.appendChild(wave);
        
        setTimeout(() => {
            wave.style.width = '3000px';
            wave.style.height = '3000px';
            wave.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            wave.remove();
        }, 1000);
    }
});

// Window resize handler
window.addEventListener('resize', () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
});

// 11. Glass Shatter Effect on Double Click
let shatterActive = false;
document.addEventListener('dblclick', (e) => {
    if (shatterActive) return;
    shatterActive = true;
    
    const shatterContainer = document.createElement('div');
    shatterContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    
    // Create glass shards
    for (let i = 0; i < 50; i++) {
        const shard = document.createElement('div');
        const size = Math.random() * 100 + 20;
        const x = e.clientX + (Math.random() - 0.5) * 200;
        const y = e.clientY + (Math.random() - 0.5) * 200;
        
        shard.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
            border: 1px solid rgba(255,255,255,0.5);
            transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg);
            clip-path: polygon(
                ${Math.random() * 100}% ${Math.random() * 100}%,
                ${Math.random() * 100}% ${Math.random() * 100}%,
                ${Math.random() * 100}% ${Math.random() * 100}%
            );
            animation: shardFall 1.5s ease-out forwards;
        `;
        
        shatterContainer.appendChild(shard);
    }
    
    document.body.appendChild(shatterContainer);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shardFall {
            to {
                transform: translate(-50%, 500%) rotate(${Math.random() * 720}deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        shatterContainer.remove();
        style.remove();
        shatterActive = false;
    }, 1500);
});

// 12. Gravity Points - Elements attracted to mouse
const gravityElements = document.querySelectorAll('.stat-block');
let gravityActive = false;

document.addEventListener('keypress', (e) => {
    if (e.key === 'g') {
        gravityActive = !gravityActive;
    }
});

document.addEventListener('mousemove', (e) => {
    if (!gravityActive) return;
    
    gravityElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < 300) {
            const force = (300 - distance) / 300;
            const moveX = deltaX * force * 0.1;
            const moveY = deltaY * force * 0.1;
            
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
});

 