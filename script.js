// Navigation and Menu
const navbar = document.getElementById('navbar');
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');

// Toggle mobile menu
mobileBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
});

// Hide mobile menu on link click
mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
    });
});

// Scroll Event for Navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.remove('transparent');
        navbar.classList.add('white');
    } else {
        navbar.classList.add('transparent');
        navbar.classList.remove('white');
    }
});

// Image Sequence for Canvas
const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');
const frameCount = 121;
const currentFrame = index => `assets/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

const images = [];
const imageObj = { frame: 0 };

// Resize canvas to cover screen properly and maintain high resolution
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    // Normalize coordinate system to use css pixels
    context.scale(dpr, dpr);

    renderImage();
}
window.addEventListener('resize', resizeCanvas);

// Preload Images
for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// Draw Image to Canvas covering the entire area (object-fit: cover equivalent)
function renderImage() {
    if (!images[imageObj.frame]) return;
    const img = images[imageObj.frame];

    if (!img.complete) {
        requestAnimationFrame(renderImage);
        return;
    }

    // calculate against the css display size, not the internal buff size
    const w = window.innerWidth;
    const h = window.innerHeight;

    const hRatio = w / img.width;
    const vRatio = h / img.height;
    const ratio = Math.max(hRatio, vRatio);

    const centerShift_x = (w - img.width * ratio) / 2;
    const centerShift_y = (h - img.height * ratio) / 2;

    context.clearRect(0, 0, w, h);
    context.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
}

// Initial draw once first image loads
images[0].onload = () => {
    resizeCanvas();
};

// Scroll Sequence logic
const heroContainer = document.getElementById('hero-scroll-container');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const containerTop = heroContainer.offsetTop;
    // We set height to 300vh, so scrollable distance = 200vh
    const containerHeight = heroContainer.offsetHeight - window.innerHeight;

    let scrollFraction = (scrollTop - containerTop) / containerHeight;
    scrollFraction = Math.max(0, Math.min(1, scrollFraction));

    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );

    if (imageObj.frame !== frameIndex) {
        imageObj.frame = frameIndex;
        requestAnimationFrame(renderImage);
    }

    // Fade out text as video progresses
    if (scrollFraction > 0.1) {
        heroContent.style.opacity = Math.max(0, 1 - (scrollFraction - 0.1) * 3);
        heroContent.style.transform = `translateY(${scrollFraction * 100}px)`;
    } else {
        heroContent.style.opacity = 1;
        heroContent.style.transform = `translateY(0)`;
    }
});


// Intersection Observer for fade-up animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(element => {
    observer.observe(element);
});
