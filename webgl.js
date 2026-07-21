import * as THREE from "./assets/vendor/three.module.min.js";

const canvas = document.querySelector("#prolog-webgl");
const sceneElement = document.querySelector(".prolog-scene");
const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

if (canvas && sceneElement) {
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    const renderPixelRatio = Math.min(window.devicePixelRatio || 1, 1.1);
    renderer.setPixelRatio(renderPixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    canvas.dataset.webglInit = "true";
    canvas.dataset.webglPixelRatio = `${renderPixelRatio}`;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
    camera.position.set(0, 0, 5.4);

    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const character = new THREE.Group();
    character.position.y = -0.12;
    sculpture.add(character);

    const yellowMaterial = new THREE.MeshStandardMaterial({
      color: 0xffca3a,
      roughness: 0.64,
      metalness: 0.02,
    });
    const bellyMaterial = new THREE.MeshStandardMaterial({
      color: 0xffe6b0,
      roughness: 0.78,
      metalness: 0,
    });
    const greenMaterial = new THREE.MeshStandardMaterial({
      color: 0x93cf70,
      roughness: 0.44,
      metalness: 0.04,
    });
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x171313,
      roughness: 0.38,
      metalness: 0.08,
    });
    const redMaterial = new THREE.MeshStandardMaterial({
      color: 0xb7153a,
      roughness: 0.5,
      metalness: 0.12,
    });

    function addCharacterPart(geometry, material, position, scale = [1, 1, 1]) {
      const part = new THREE.Mesh(geometry, material);
      part.position.set(...position);
      part.scale.set(...scale);
      character.add(part);
      return part;
    }

    addCharacterPart(new THREE.SphereGeometry(0.84, 28, 20), yellowMaterial, [0, -0.08, 0], [1, 1.16, 0.82]);
    addCharacterPart(new THREE.SphereGeometry(0.82, 28, 20), yellowMaterial, [0, 1.03, 0.04], [1.04, 0.98, 0.86]);
    addCharacterPart(new THREE.SphereGeometry(0.54, 24, 16), bellyMaterial, [0, -0.2, 0.66], [1, 1.08, 0.3]);

    const eyePositions = [[-0.34, 1.28, 0.72], [0.34, 1.28, 0.72]];
    eyePositions.forEach(([x, y, z]) => {
      addCharacterPart(new THREE.SphereGeometry(0.18, 18, 14), bellyMaterial, [x, y, z]);
      addCharacterPart(new THREE.SphereGeometry(0.11, 16, 12), greenMaterial, [x, y, z + 0.1]);
      addCharacterPart(new THREE.SphereGeometry(0.055, 12, 10), darkMaterial, [x, y, z + 0.19]);
    });

    addCharacterPart(new THREE.SphereGeometry(0.24, 20, 14), darkMaterial, [0, 0.88, 0.76], [1.28, 0.72, 0.38]);
    addCharacterPart(new THREE.SphereGeometry(0.09, 14, 10), redMaterial, [0, 0.87, 0.89], [1.3, 0.6, 0.28]);

    addCharacterPart(new THREE.SphereGeometry(0.3, 20, 14), yellowMaterial, [-0.92, 0.08, 0], [0.54, 0.88, 0.62]);
    addCharacterPart(new THREE.SphereGeometry(0.3, 20, 14), yellowMaterial, [0.92, 0.08, 0], [0.54, 0.88, 0.62]);
    addCharacterPart(new THREE.SphereGeometry(0.33, 20, 14), bellyMaterial, [-0.42, -1.02, 0.12], [0.7, 0.48, 0.72]);
    addCharacterPart(new THREE.SphereGeometry(0.33, 20, 14), bellyMaterial, [0.42, -1.02, 0.12], [0.7, 0.48, 0.72]);

    const bowLeft = addCharacterPart(new THREE.SphereGeometry(0.24, 18, 12), redMaterial, [-0.22, 0.57, 0.78], [1.1, 0.78, 0.28]);
    const bowRight = addCharacterPart(new THREE.SphereGeometry(0.24, 18, 12), redMaterial, [0.22, 0.57, 0.78], [1.1, 0.78, 0.28]);
    bowLeft.rotation.z = -0.3;
    bowRight.rotation.z = 0.3;
    addCharacterPart(new THREE.SphereGeometry(0.11, 16, 12), darkMaterial, [0, 0.57, 0.86], [1, 1, 0.5]);

    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.62, -0.34, -0.26),
      new THREE.Vector3(-1.08, -0.08, -0.36),
      new THREE.Vector3(-1.12, 0.5, -0.32),
      new THREE.Vector3(-0.78, 0.62, -0.28),
    ]);
    const tail = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 24, 0.12, 10, false), yellowMaterial);
    character.add(tail);

    for (let index = 0; index < 5; index += 1) {
      const tuft = addCharacterPart(
        new THREE.SphereGeometry(0.15, 14, 10),
        bellyMaterial,
        [(index - 2) * 0.16, 1.8 + Math.abs(index - 2) * 0.035, 0.02],
        [0.72, 0.9, 0.68],
      );
      tuft.rotation.z = (index - 2) * 0.18;
    }

    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x171719,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const haloA = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.008, 8, 112), haloMaterial);
    const haloB = new THREE.Mesh(new THREE.TorusGeometry(2.02, 0.006, 8, 112), haloMaterial.clone());
    haloA.rotation.set(Math.PI * 0.3, Math.PI * 0.12, 0);
    haloB.rotation.set(Math.PI * 0.62, Math.PI * 0.24, Math.PI * 0.16);
    sculpture.add(haloA, haloB);

    let randomState = 0x9e3779b9;
    const random = () => {
      randomState = (randomState * 1664525 + 1013904223) >>> 0;
      return randomState / 4294967296;
    };
    const particleCount = 360;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 1.45 + random() * 1.5;
      const angle = random() * Math.PI * 2;
      const lift = (random() - 0.5) * 3.1;
      particlePositions[index * 3] = Math.cos(angle) * radius;
      particlePositions[index * 3 + 1] = lift;
      particlePositions[index * 3 + 2] = Math.sin(angle) * radius * 0.38;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xb7153a,
        size: 0.024,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
      }),
    );

    const sparkCount = 96;
    const sparkPositions = new Float32Array(sparkCount * 3);
    for (let index = 0; index < sparkCount; index += 1) {
      const radius = 0.9 + random() * 2.25;
      const angle = random() * Math.PI * 2;
      sparkPositions[index * 3] = Math.cos(angle) * radius;
      sparkPositions[index * 3 + 1] = (random() - 0.5) * 3.5;
      sparkPositions[index * 3 + 2] = Math.sin(angle) * radius * 0.46;
    }
    const sparkGeometry = new THREE.BufferGeometry();
    sparkGeometry.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparks = new THREE.Points(
      sparkGeometry,
      new THREE.PointsMaterial({
        color: 0xe2bd63,
        size: 0.032,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.56,
      }),
    );
    sculpture.add(particles, sparks);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8b92a0, 1.55));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
    keyLight.position.set(-2.4, 3.2, 4);
    scene.add(keyLight);
    const goldLight = new THREE.PointLight(0xe2bd63, 8, 9, 2);
    goldLight.position.set(2.8, -1.5, 2.4);
    scene.add(goldLight);

    let active = false;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let lastTime = performance.now();
    let sceneTop = 0;
    let sceneTravel = 1;

    function updateSceneMetrics() {
      const bounds = sceneElement.getBoundingClientRect();
      sceneTop = bounds.top + window.scrollY;
      sceneTravel = Math.max(1, bounds.height - window.innerHeight);
    }

    function resize() {
      const width = Math.max(1, canvas.clientWidth || window.innerWidth);
      const height = Math.max(1, Math.min(window.innerHeight, sceneElement.clientHeight || window.innerHeight));
      renderer.setSize(width, height, false);
      canvas.dataset.webglSize = `${width}x${height}`;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      sculpture.position.x = width > 700 ? 0.32 : 0.5;
      sculpture.scale.setScalar(width > 700 ? 0.56 : 0.52);
      updateSceneMetrics();
    }

    function getScrollProgress() {
      return THREE.MathUtils.clamp((window.scrollY - sceneTop) / sceneTravel, 0, 1);
    }

    function draw(now = performance.now()) {
      frame = 0;
      const delta = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      const progress = getScrollProgress();
      smoothX += (pointerX - smoothX) * 0.055;
      smoothY += (pointerY - smoothY) * 0.055;

      character.rotation.x = smoothY * 0.12 + Math.sin(now * 0.0008) * 0.015;
      character.rotation.y = smoothX * 0.15;
      character.position.y = -0.12 + Math.sin(now * 0.0011) * 0.045 - progress * 0.08;
      sculpture.rotation.x = smoothY * 0.16 + (progress - 0.5) * 0.28;
      sculpture.rotation.y = smoothX * 0.2 + progress * 0.74;
      sculpture.rotation.z = progress * -0.34;
      particles.rotation.y = now * 0.00004;
      particles.rotation.z = progress * 0.4;
      particles.position.y = Math.sin(now * 0.00035) * 0.06 - progress * 0.12;
      particles.scale.setScalar(0.96 + Math.sin(now * 0.0012) * 0.035 + progress * 0.08);
      sparks.rotation.y = now * -0.000075 + progress * 0.7;
      sparks.rotation.z = now * 0.000045 - progress * 0.32;
      sparks.position.y = Math.cos(now * 0.00048) * 0.09 + progress * 0.16;
      haloA.rotation.z = now * 0.00008;
      haloB.rotation.z = now * -0.000055;
      renderer.render(scene, camera);

      if (active && !reduceMotion) frame = requestAnimationFrame(draw);
    }

    function start() {
      active = true;
      lastTime = performance.now();
      updateSceneMetrics();
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function stop() {
      active = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }

    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) start();
        else stop();
      });
    }, { rootMargin: "20% 0px" });
    visibilityObserver.observe(sceneElement);

    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX / window.innerWidth * 2 - 1;
      pointerY = -(event.clientY / window.innerHeight * 2 - 1);
    }, { passive: true });
    const canvasResizeObserver = new ResizeObserver(() => {
      resize();
      if (!active || reduceMotion) draw();
    });
    canvasResizeObserver.observe(sceneElement);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("load", resize, { once: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (sceneElement.getBoundingClientRect().bottom > 0 && sceneElement.getBoundingClientRect().top < window.innerHeight) start();
    });

    resize();
    draw();
  } catch (error) {
    document.documentElement.classList.add("webgl-unavailable");
    console.warn("WebGL scene unavailable", error);
  }
}
