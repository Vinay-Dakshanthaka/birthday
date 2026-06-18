(function () {
  "use strict";

  const namespace = window.BirthdayAndi = window.BirthdayAndi || {};

  namespace.route = {
    init({ reducedMotion }) {
      this.svg = document.getElementById("route-svg");
      this.layer = document.querySelector(".route-layer");
      this.path = document.getElementById("celebration-route");
      this.shadow = document.getElementById("celebration-route-shadow");
      this.textPath = document.getElementById("route-text-path");
      this.reducedMotion = reducedMotion;
      this.refresh();
      this.animateText();
      addEventListener("scroll", namespace.utils.throttle(() => this.syncRouteProgress(), 40), { passive: true });
    },

    buildPath() {
      const height = Math.max(document.documentElement.scrollHeight, innerHeight);
      const width = innerWidth;
      const step = Math.max(480, innerHeight * 0.54);
      let y = 80;
      let d = `M ${width * 0.5} ${y}`;
      let flip = 1;
      while (y < height + innerHeight) {
        const x1 = width * (flip > 0 ? 0.9 : 0.1);
        const x2 = width * (flip > 0 ? 0.12 : 0.88);
        const y1 = y + step * 0.34;
        const y2 = y + step * 0.68;
        y += step;
        d += ` C ${x1} ${y1}, ${x2} ${y2}, ${width * 0.5} ${y}`;
        flip *= -1;
      }
      return { d, height };
    },

    refresh() {
      if (!this.svg) return;
      const route = this.buildPath();
      this.svg.setAttribute("viewBox", `0 0 ${innerWidth} ${route.height}`);
      this.svg.style.height = `${route.height}px`;
      this.layer.style.height = `${route.height}px`;
      this.path.setAttribute("d", route.d);
      this.shadow.setAttribute("d", route.d);
      this.syncRouteProgress();
    },

    syncRouteProgress() {
      if (!this.path) return;
      const len = this.path.getTotalLength();
      const max = document.documentElement.scrollHeight - innerHeight;
      const progress = max > 0 ? scrollY / max : 0;
      this.path.style.strokeDashoffset = `${-progress * 260}`;
      this.shadow.style.opacity = String(0.42 + progress * 0.2);
      if (this.textPath && this.reducedMotion) {
        this.textPath.setAttribute("startOffset", `${progress * 100}%`);
      }
      this.path.style.strokeDasharray = `${18 + progress * 10} 16`;
      return len;
    },

    animateText() {
      if (!this.textPath || this.reducedMotion) return;
      if (window.gsap) {
        gsap.to(this.textPath, {
          attr: { startOffset: "100%" },
          repeat: -1,
          duration: 24,
          ease: "none"
        });
      } else {
        let offset = 0;
        const tick = () => {
          offset = (offset + 0.04) % 100;
          this.textPath.setAttribute("startOffset", `${offset}%`);
          requestAnimationFrame(tick);
        };
        tick();
      }
    }
  };
})();
