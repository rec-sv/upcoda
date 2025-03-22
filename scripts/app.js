document.addEventListener('DOMContentLoaded', function() {

    const particleSystem = new ParticleSystem();
    

    updateClock();
    setInterval(updateClock, 1000);
    

    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    
    startButton.addEventListener('click', function(e) {
        e.stopPropagation();
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
        playSound('click');
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#start-button') && !e.target.closest('#start-menu')) {
            startMenu.style.display = 'none';
        }
    });
    

    const icons = document.querySelectorAll('.icon');
    let draggedIcon = null;
    let startX, startY;
    
    icons.forEach(icon => {
        icon.addEventListener('mousedown', function(e) {
            draggedIcon = this;
            const rect = this.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
            draggedIcon.style.zIndex = '100';
        });
        
        icon.addEventListener('dblclick', function() {
            if (this.dataset.url) {
                window.open(this.dataset.url, '_blank');
                playSound('click');
            } else if (this.dataset.action === 'text-file') {
                const content = {
                    upcoda: 'upcodaOS\n\nmade by upcoda:\n-email: upcoda.g@gmail.com\n discord: up_coda.'
                }[this.dataset.content];
                openWindow('upcoda.txt', content);
                playSound('window_open');
            }
        });
    });
    
    document.addEventListener('mousemove', function(e) {
        if (draggedIcon) {
            const desktop = document.querySelector('.desktop');
            const desktopRect = desktop.getBoundingClientRect();
            
            const maxX = desktopRect.width - draggedIcon.offsetWidth;
            const maxY = desktopRect.height - draggedIcon.offsetHeight;
            
            let x = e.clientX - desktopRect.left - startX;
            let y = e.clientY - desktopRect.top - startY;
            
            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));
            
            draggedIcon.style.left = `${x}px`;
            draggedIcon.style.top = `${y}px`;
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (draggedIcon) {
            draggedIcon.style.zIndex = 'auto';
            draggedIcon = null;
        }
    });
    

    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        if (item.dataset.action === 'about') {
            item.addEventListener('click', function() {
                openAboutWindow();
                playSound('window_open');
            });
        }
    });
    

    setTimeout(() => {
        document.querySelector('.loading-screen').style.display = 'none';
        playSound('boot');  
    }, 1000);
});


function updateClock() {
    const now = new Date();
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = 
            `${now.getHours().toString().padStart(2, '0')}:` +
            `${now.getMinutes().toString().padStart(2, '0')}:` +
            `${now.getSeconds().toString().padStart(2, '0')}`;
    }
}

function openWindow(title, content) {
    const windowTemplate = document.getElementById('window-template');
    const windowElement = windowTemplate.cloneNode(true);
    windowElement.style.display = 'block';
    windowElement.style.left = '200px';
    windowElement.style.top = '100px';
    
    const windowTitle = windowElement.querySelector('.window-title');
    const windowContent = windowElement.querySelector('.window-content');
    
    windowTitle.textContent = title;
    windowContent.textContent = content;
    
    document.body.appendChild(windowElement);
    
    makeWindowDraggable(windowElement);
}

function openAboutWindow() {
    const aboutContent = `
upcodaOS v0.76.8 (Alpha Build) — May contain bugs and incomplete features.
    `;
    openWindow('About upcodaOS', aboutContent);
}

function makeWindowDraggable(windowElement) {
    const header = windowElement.querySelector('.window-header');
    let isDragging = false;
    let offsetX, offsetY;
    
    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    function startDrag(e) {
        isDragging = true;
        offsetX = e.clientX - windowElement.offsetLeft;
        offsetY = e.clientY - windowElement.offsetTop;
        windowElement.style.zIndex = 1000;
    }
    
    function drag(e) {
        if (!isDragging) return;
        windowElement.style.left = (e.clientX - offsetX) + 'px';
        windowElement.style.top = (e.clientY - offsetY) + 'px';
    }
    
    function stopDrag() {
        isDragging = false;
        windowElement.style.zIndex = 500;
    }
    

    const closeBtn = windowElement.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
        windowElement.style.display = 'none';
        playSound('click');
    });
    

    const minimizeBtn = windowElement.querySelector('.minimize-btn');
    minimizeBtn.addEventListener('click', function() {
        playSound('click');
    });
    

    const maximizeBtn = windowElement.querySelector('.maximize-btn');
    let isMaximized = false;
    
    maximizeBtn.addEventListener('click', function() {
        playSound('click');
        if (isMaximized) {
            windowElement.style.width = 'auto';
            windowElement.style.height = 'auto';
            windowElement.style.left = '200px';
            windowElement.style.top = '100px';
        } else {
            windowElement.style.width = '80%';
            windowElement.style.height = '80%';
            windowElement.style.left = '10%';
            windowElement.style.top = '10%';
        }
        isMaximized = !isMaximized;
    });
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particle-system');
        this.createParticles(100);
        this.animate();
    }
    
    createParticles(quantity) {
        for (let i = 0; i < quantity; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            Object.assign(particle.style, {
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1
            });
            this.container.appendChild(particle);
            this.particles.push({
                element: particle,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2
            });
        }
    }
    
    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            

            if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
            
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

function playSound(soundType) {
    const soundMap = {
        boot: 'sounds/boot.mp3',
        click: 'sounds/click.mp3',
        window_open: 'sounds/window_open.mp3'
    };
    
    const audio = new Audio(soundMap[soundType]);
    audio.play().catch(error => {
        console.error('banana:', error);
    });
}
