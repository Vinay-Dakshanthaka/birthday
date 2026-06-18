(function () {
  "use strict";

  const namespace = window.BirthdayAndi = window.BirthdayAndi || {};

  namespace.checkpoints = {
    init() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.celebrated) {
            entry.target.dataset.celebrated = "true";
            this.celebrate(entry.target);
          }
        });
      }, { threshold: 0.45 });

      document.querySelectorAll(".checkpoint-card").forEach((card) => this.observe(card));

      if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll(".checkpoint-card"), {
          max: 9,
          speed: 600,
          glare: true,
          "max-glare": 0.28
        });
      }
    },

    observe(card) {
      if (!card) return;
      this.observer?.observe(card);
      card.addEventListener("pointerenter", () => namespace.effects.sparkleAtElement(card, 12));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.click();
        }
      });
    },

    celebrate(card) {
      const rect = card.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      namespace.confetti.burst(x, y, 220);
      namespace.fireworks.burst(x, Math.max(80, y - 120));
      namespace.effects.sparkleAtElement(card, 24);

      if (card.closest(".finale")) {
        namespace.effects.grandFinale();
      }
    }
  };
})();
