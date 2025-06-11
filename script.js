// Wait until all assets are loaded
window.addEventListener("load", () => {
  document.getElementById("loader").style.display = "none";
  initThreeScene();
  initGSAPAnimations();
  setupCTA();
  setupModal();
});

/* -------------------------------
   THREE.JS: Rotating Sphere & Particles
----------------------------------- */
function initThreeScene() {
  const canvas = document.getElementById("three-canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 6;

  // Create a sphere to mimic an Earth-like object
  const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 64);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    roughness: 0.5,
    metalness: 0.3,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  // Add lights to give depth
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0x00ffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Particle Starfield
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 2000;
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
  });
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    // Rotate sphere for a dynamic effect
    sphere.rotation.y += 0.005;
    sphere.rotation.x += 0.002;
    // Optionally rotate particles slowly
    particles.rotation.y += 0.0005;
    renderer.render(scene, camera);
  }
  animate();

  // Handle window resizing
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

/* -------------------------------
   GSAP & ScrollTrigger Animations
----------------------------------- */
function initGSAPAnimations() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  
  // Fade in sections on scroll
  document.querySelectorAll(".section").forEach(section => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%"
      }
    });
  });
}

/* -------------------------------
   CTA Button: Smooth Scroll
----------------------------------- */
function setupCTA() {
  document.querySelector(".cta-button").addEventListener("click", () => {
    gsap.to(window, { duration: 1, scrollTo: "#about" });
  });
}

/* -------------------------------
   Project Modal Functionality
----------------------------------- */
function setupModal() {
  const modal = document.querySelector(".project-modal");
  const modalContent = document.querySelector(".modal-content");
  const closeBtn = document.querySelector(".close");

  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      modal.style.display = "flex";
      gsap.fromTo(modalContent, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
    });
  });

  closeBtn.addEventListener("click", () => {
    gsap.to(modalContent, {
      scale: 0.6,
      opacity: 0,
      duration: 0.5,
      onComplete: () => modal.style.display = "none"
    });
  });

  // Close modal when clicking outside content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      gsap.to(modalContent, {
        scale: 0.6,
        opacity: 0,
        duration: 0.5,
        onComplete: () => modal.style.display = "none"
      });
    }
  });
}
