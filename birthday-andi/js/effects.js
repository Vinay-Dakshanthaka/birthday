(function () {
  "use strict";

  const namespace = window.BirthdayAndi = window.BirthdayAndi || {};

  namespace.utils = {
    throttle(fn, wait) {
      let last = 0;
      let timer = null;
      return function throttled(...args) {
        const now = Date.now();
        const remaining = wait - (now - last);
        if (remaining <= 0) {
          clearTimeout(timer);
          timer = null;
          last = now;
          fn.apply(this, args);
        } else if (!timer) {
          timer = setTimeout(() => {
            last = Date.now();
            timer = null;
            fn.apply(this, args);
          }, remaining);
        }
      };
    }
  };

  namespace.effects = {
    init({ reducedMotion }) {
      this.reducedMotion = reducedMotion;
      this.bindPointerSparkles();
      this.bindAudio();
    },

    bindPointerSparkles() {
      if (this.reducedMotion) return;
      addEventListener("pointermove", namespace.utils.throttle((event) => {
        if (Math.random() > 0.62) return;
        this.spark(event.clientX, event.clientY);
      }, 70), { passive: true });
    },

    spark(x, y) {
      const el = document.createElement("span");
      el.className = "spark";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      document.body.appendChild(el);
      const dx = -18 + Math.random() * 36;
      const dy = -28 - Math.random() * 30;
      if (window.gsap) {
        gsap.to(el, { x: dx, y: dy, opacity: 0, scale: 0, duration: 0.7, ease: "power2.out", onComplete: () => el.remove() });
      } else {
        setTimeout(() => el.remove(), 700);
      }
    },

    sparkleAtElement(element, count) {
      const rect = element.getBoundingClientRect();
      for (let i = 0; i < count; i += 1) {
        this.spark(rect.left + Math.random() * rect.width, rect.top + Math.random() * rect.height);
      }
    },

    bindAudio() {
      const button = document.getElementById("audio-toggle");
      if (!button) return;
      let audio = null;
      let playing = false;

      const createAudio = () => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const master = ctx.createGain();
        master.gain.value = 0.03;
        master.connect(ctx.destination);
        const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
        let step = 0;
        const timer = setInterval(() => {
          if (!playing) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.value = notes[step % notes.length] * (step % 5 === 0 ? 2 : 1);
          gain.gain.setValueAtTime(0.0001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.42, ctx.currentTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.34);
          osc.connect(gain);
          gain.connect(master);
          osc.start();
          osc.stop(ctx.currentTime + 0.36);
          step += 1;
        }, 390);
        return { ctx, timer };
      };

      button.addEventListener("click", async () => {
        if (!audio) audio = createAudio();
        if (audio.ctx.state === "suspended") await audio.ctx.resume();
        playing = !playing;
        button.setAttribute("aria-pressed", String(playing));
        button.classList.toggle("is-playing", playing);
        button.querySelector(".audio-icon").textContent = playing ? "\u266b" : "\u266a";
      });
    },

    grandFinale() {
      namespace.confetti.mega();
      for (let i = 0; i < 12; i += 1) {
        setTimeout(() => namespace.fireworks.burst(Math.random() * innerWidth, innerHeight * (0.12 + Math.random() * 0.45)), i * 220);
      }
      if (window.gsap) {
        gsap.fromTo(".finale-copy h2", { scale: 0.92, filter: "brightness(1)" }, { scale: 1.06, filter: "brightness(1.65)", yoyo: true, repeat: 3, duration: 0.42, ease: "power2.inOut" });
        gsap.fromTo(".crown", { rotate: -5 }, { rotate: 5, yoyo: true, repeat: 9, duration: 0.12, ease: "power1.inOut" });
      }
    }
  };
})();
