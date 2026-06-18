(function () {
  "use strict";

  const namespace = window.BirthdayAndi = window.BirthdayAndi || {};

  namespace.universe = {
    init({ reducedMotion }) {
      const canvas = document.getElementById("universe-canvas");
      if (!canvas || !window.THREE) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1800);
      camera.position.z = 460;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
      renderer.setSize(innerWidth, innerHeight);

      const starGeometry = new THREE.BufferGeometry();
      const starCount = matchMedia("(max-width: 800px)").matches ? 900 : 1800;
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const palette = [new THREE.Color("#fffaf0"), new THREE.Color("#f6d36b"), new THREE.Color("#7dc9bc"), new THREE.Color("#d789a7")];

      for (let i = 0; i < starCount; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 1500;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1300;
        const c = palette[i % palette.length];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({
        size: 2.4,
        transparent: true,
        opacity: 0.82,
        vertexColors: true,
        blending: THREE.AdditiveBlending
      }));
      scene.add(stars);

      const orbGroup = new THREE.Group();
      for (let i = 0; i < 18; i += 1) {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(6 + Math.random() * 18, 24, 24),
          new THREE.MeshBasicMaterial({ color: palette[i % palette.length], transparent: true, opacity: 0.14 })
        );
        mesh.position.set((Math.random() - 0.5) * 900, (Math.random() - 0.5) * 700, (Math.random() - 0.5) * 800);
        orbGroup.add(mesh);
      }
      scene.add(orbGroup);

      let mouseX = 0;
      let mouseY = 0;
      addEventListener("pointermove", (event) => {
        mouseX = (event.clientX / innerWidth - 0.5) * 2;
        mouseY = (event.clientY / innerHeight - 0.5) * 2;
      }, { passive: true });

      addEventListener("resize", namespace.utils.throttle(() => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
      }, 150));

      const render = () => {
        const t = performance.now() * 0.00012;
        stars.rotation.y = t + scrollY * 0.00005 + mouseX * 0.025;
        stars.rotation.x = t * 0.55 + mouseY * 0.02;
        orbGroup.rotation.z = -t * 1.8;
        camera.position.y = -scrollY * 0.025;
        renderer.render(scene, camera);
        if (!reducedMotion) requestAnimationFrame(render);
      };
      render();
    }
  };
})();
