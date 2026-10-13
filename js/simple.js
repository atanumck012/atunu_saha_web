// JavaScript for Dr. Atanu Saha's Medical Portfolio

// ECG / Heart Rhythm Background Canvas Animation - Bright, Glowing and Clearly Visible
class EcgSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.points = [];
        this.x = 0;
        this.speed = 2.6; // Energetic heartbeat pulse
        this.animationId = null;

        this.handleResize = this.handleResize.bind(this);
        this.animate = this.animate.bind(this);

        this.handleResize();
        window.addEventListener('resize', this.handleResize, { passive: true });
        this.start();
    }

    handleResize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent ? parent.offsetWidth : window.innerWidth;
        this.canvas.height = parent ? parent.offsetHeight : 600;
        this.ctx.fillStyle = '#061526';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.points = [];
        this.x = 0;
    }

    getY(t) {
        const mid = this.canvas.height * 0.55;
        const cycle = t % 320;

        // Accurate physiological P-Q-R-S-T waveform with amplified height for clear visibility
        if (cycle > 70 && cycle < 98) {
            // P wave
            const pProgress = (cycle - 70) / 28;
            return mid - Math.sin(pProgress * Math.PI) * 22;
        } else if (cycle >= 120 && cycle < 132) {
            // Q wave
            const qProgress = (cycle - 120) / 12;
            return mid + Math.sin(qProgress * Math.PI) * 26;
        } else if (cycle >= 132 && cycle < 150) {
            // R wave - intense sharp deflection
            const rProgress = (cycle - 132) / 18;
            return mid - Math.sin(rProgress * Math.PI) * 140;
        } else if (cycle >= 150 && cycle < 168) {
            // S wave
            const sProgress = (cycle - 150) / 18;
            return mid + Math.sin(sProgress * Math.PI) * 42;
        } else if (cycle >= 195 && cycle < 245) {
            // T wave
            const tProgress = (cycle - 195) / 50;
            return mid - Math.sin(tProgress * Math.PI) * 36;
        }

        // Slight micro-variation on the isoelectric line
        return mid + Math.sin(t * 0.05) * 1.8;
    }

    animate() {
        // Controlled persistence trail
        this.ctx.fillStyle = 'rgba(6, 21, 38, 0.04)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const newY = this.getY(this.x);
        this.points.push({ x: this.x % this.canvas.width, y: newY });

        if (this.points.length > 2) {
            const prev = this.points[this.points.length - 2];
            const curr = this.points[this.points.length - 1];

            if (curr.x > prev.x) {
                // Secondary glow line
                this.ctx.beginPath();
                this.ctx.moveTo(prev.x, prev.y);
                this.ctx.lineTo(curr.x, curr.y);
                this.ctx.strokeStyle = '#38bdf8';
                this.ctx.lineWidth = 3.2; // Thicker & more apparent
                this.ctx.shadowBlur = 14;
                this.ctx.shadowColor = '#00f2fe';
                this.ctx.stroke();

                // Core bright line
                this.ctx.beginPath();
                this.ctx.moveTo(prev.x, prev.y);
                this.ctx.lineTo(curr.x, curr.y);
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 1.4;
                this.ctx.shadowBlur = 0;
                this.ctx.stroke();
            } else {
                this.points = [curr];
            }
        }

        this.x += this.speed;
        this.animationId = requestAnimationFrame(this.animate);
    }

    start() {
        if (!this.animationId) {
            this.animate();
        }
    }
}

// Navigation & Auto-Smooth Setup
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Glowing ECG Waveform Canvas
    const canvas = document.getElementById('ecgCanvas');
    if (canvas) {
        new EcgSystem(canvas);
    }

    // 2. Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpened = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpened ? 'true' : 'false');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 3. Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
