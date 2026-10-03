// Auth Pages Particle Background Generator
(function () {
  'use strict';

  function initAuthParticles() {
    const bg = document.querySelector('.fb-auth-bg');
    if (!bg) return;

    // Create canvas for particles
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';
    bg.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = 0;
    let height = 0;
    let animationId = null;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = Math.random() * 0.3 + 0.1;
        this.opacity = Math.random() * 0.4 + 0.05;
        this.color = Math.random() > 0.5
          ? 'rgba(30, 58, 138,' // navy
          : 'rgba(59, 130, 246,'; // blue
      }
      update() {
        this.x += this.speedX;
        this.y -= this.speedY;
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
          this.y = height + 10;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
      }
    }

    function init() {
      resize();
      particles = [];
      const count = Math.min(50, Math.floor((width * height) / 25000));
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      animationId = requestAnimationFrame(animate);
    }

    function start() {
      if (animationId) cancelAnimationFrame(animationId);
      init();
      animate();
    }

    function stop() {
      if (animationId) cancelAnimationFrame(animationId);
    }

    window.addEventListener('resize', () => { resize(); init(); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthParticles);
  } else {
    initAuthParticles();
  }
})();