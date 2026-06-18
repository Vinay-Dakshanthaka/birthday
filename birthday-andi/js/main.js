(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toast = document.getElementById("toast");
  let toastTimer = 0;

  function boot() {
    revealOnView();
    bindAudio();
    bindCelebrations();
    markActiveNav();
  }

  function revealOnView() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || prefersReduced) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

    items.forEach((item) => observer.observe(item));
  }

  function markActiveNav() {
    const links = Array.from(document.querySelectorAll(".stop-nav a"));
    const targets = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { threshold: 0.45 });

    targets.forEach((target) => observer.observe(target));
  }

  function bindAudio() {
    const button = document.getElementById("audio-toggle");
    const label = document.getElementById("audio-label");
    if (!button || !label) return;

    let sound = null;
    let playing = false;

    button.addEventListener("click", async () => {
      if (!sound) sound = createMusicBox();
      await sound.resume();
      playing = !playing;
      sound.setPlaying(playing);
      button.setAttribute("aria-pressed", String(playing));
      label.textContent = playing ? "Pause Music" : "Play Music";
      showToast(playing ? "A soft little birthday tune is playing." : "Music paused.");
    });
  }

  function createMusicBox() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    const pad = ctx.createGain();
    const bell = ctx.createGain();
    const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 392.0];
    let playing = false;
    let step = 0;

    master.gain.value = 0.045;
    pad.gain.value = 0;
    bell.gain.value = 0;
    pad.connect(master);
    bell.connect(master);
    master.connect(ctx.destination);

    const low = ctx.createOscillator();
    const high = ctx.createOscillator();
    low.type = "sine";
    high.type = "triangle";
    low.frequency.value = 130.81;
    high.frequency.value = 196.0;
    low.connect(pad);
    high.connect(pad);
    low.start();
    high.start();

    const playBell = () => {
      if (!playing) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = notes[step % notes.length];
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.32, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.05);
      osc.connect(gain);
      gain.connect(bell);
      osc.start();
      osc.stop(ctx.currentTime + 1.1);
      step += 1;
    };

    setInterval(playBell, 1320);

    return {
      resume: () => ctx.state === "suspended" ? ctx.resume() : Promise.resolve(),
      setPlaying(value) {
        playing = value;
        const now = ctx.currentTime;
        pad.gain.cancelScheduledValues(now);
        bell.gain.cancelScheduledValues(now);
        pad.gain.linearRampToValueAtTime(value ? 0.36 : 0.0001, now + 0.35);
        bell.gain.linearRampToValueAtTime(value ? 0.5 : 0.0001, now + 0.35);
      }
    };
  }

  function bindCelebrations() {
    document.querySelectorAll(".talent-card, .checkpoint-card, .bird-card, .final-card").forEach((card) => {
      card.addEventListener("click", () => {
        smallPetals(card, 10);
      });
    });

    document.getElementById("celebrate-button")?.addEventListener("click", (event) => {
      smallPetals(event.currentTarget, 24);
      showToast("Birthday wishes sent. Red velvet cake is strongly recommended.");
    });
  }

  function smallPetals(source, count) {
    if (prefersReduced) return;
    const rect = source.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    for (let i = 0; i < count; i += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = `${originX}px`;
      petal.style.top = `${originY}px`;
      petal.style.setProperty("--x", `${-90 + Math.random() * 180}px`);
      petal.style.setProperty("--y", `${-95 - Math.random() * 70}px`);
      petal.style.setProperty("--r", `${Math.random() * 180}deg`);
      document.body.appendChild(petal);
      setTimeout(() => petal.remove(), 950);
    }
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
