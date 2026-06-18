(function () {
  "use strict";

  const namespace = window.BirthdayAndi = window.BirthdayAndi || {};

  namespace.confetti = {
    init({ reducedMotion }) {
      this.reducedMotion = reducedMotion;
      if (reducedMotion || !window.confetti) return;
      this.cannon = confetti.create(undefined, { resize: true, useWorker: true });
      setInterval(() => this.rain(), 4200);
    },

    rain() {
      if (!this.cannon) return;
      this.cannon({
        particleCount: 44,
        spread: 72,
        startVelocity: 22,
        origin: { x: Math.random(), y: -0.05 },
        colors: ["#f6d36b", "#7dc9bc", "#d96b72", "#647aa3", "#fffaf0"]
      });
    },

    burst(x, y, amount) {
      if (!this.cannon) return;
      this.cannon({
        particleCount: amount || 130,
        spread: 110,
        ticks: 260,
        startVelocity: 42,
        origin: { x: x / innerWidth, y: y / innerHeight },
        colors: ["#f6d36b", "#7dc9bc", "#d96b72", "#d789a7", "#fffaf0"]
      });
    },

    mega() {
      if (!this.cannon) return;
      const end = Date.now() + 5200;
      const colors = ["#f6d36b", "#7dc9bc", "#d96b72", "#d789a7", "#fffaf0", "#647aa3"];
      const run = () => {
        this.cannon({ particleCount: 140, angle: 60, spread: 65, origin: { x: 0 }, colors });
        this.cannon({ particleCount: 140, angle: 120, spread: 65, origin: { x: 1 }, colors });
        this.cannon({ particleCount: 100, spread: 100, origin: { x: Math.random(), y: 0.2 * Math.random() }, colors });
        if (Date.now() < end) requestAnimationFrame(run);
      };
      run();
    }
  };
})();
