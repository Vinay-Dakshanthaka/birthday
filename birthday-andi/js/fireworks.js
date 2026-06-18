(function () {
  "use strict";

  const namespace = window.BirthdayAndi = window.BirthdayAndi || {};

  namespace.fireworks = {
    particles: [],
    rockets: [],

    init({ reducedMotion }) {
      this.canvas = document.getElementById("fireworks-canvas");
      this.ctx = this.canvas?.getContext("2d");
      this.reducedMotion = reducedMotion;
      if (!this.ctx) return;
      this.resize();
      addEventListener("resize", namespace.utils.throttle(() => this.resize(), 120));
      if (!reducedMotion) {
        setInterval(() => this.launchRandom(), 1700);
        requestAnimationFrame(() => this.frame());
      }
    },

    resize() {
      this.canvas.width = innerWidth * devicePixelRatio;
      this.canvas.height = innerHeight * devicePixelRatio;
      this.canvas.style.width = `${innerWidth}px`;
      this.canvas.style.height = `${innerHeight}px`;
      this.ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    },

    launchRandom() {
      this.rockets.push({
        x: innerWidth * (0.15 + Math.random() * 0.7),
        y: innerHeight + 20,
        vx: -1.6 + Math.random() * 3.2,
        vy: -9 - Math.random() * 5,
        target: innerHeight * (0.16 + Math.random() * 0.38),
        color: this.color()
      });
    },

    burst(x, y) {
      if (this.reducedMotion) return;
      for (let i = 0; i < 80; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 6.8;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 54 + Math.random() * 34,
          age: 0,
          color: this.color(),
          size: 1.4 + Math.random() * 2.6
        });
      }
    },

    color() {
      return ["#f6d36b", "#7dc9bc", "#d96b72", "#fffaf0", "#647aa3", "#d789a7"][Math.floor(Math.random() * 6)];
    },

    frame() {
      const ctx = this.ctx;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(5, 6, 18, 0.18)";
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      ctx.globalCompositeOperation = "lighter";

      for (let i = this.rockets.length - 1; i >= 0; i -= 1) {
        const r = this.rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.06;
        ctx.fillStyle = r.color;
        ctx.fillRect(r.x, r.y, 2, 12);
        if (r.y <= r.target || r.vy >= 0) {
          this.burst(r.x, r.y);
          this.rockets.splice(i, 1);
        }
      }

      for (let i = this.particles.length - 1; i >= 0; i -= 1) {
        const p = this.particles[i];
        p.age += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045;
        p.vx *= 0.99;
        const alpha = Math.max(0, 1 - p.age / p.life);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.age > p.life) this.particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(() => this.frame());
    }
  };
})();
