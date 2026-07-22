import * as THREE from "./assets/vendor/three.module.min.js";
import { FBXLoader } from "./assets/vendor/FBXLoader.js";

const aura = document.querySelector("#cursor-aura");
const canvas = document.querySelector("#cursor-model-canvas");
const canRenderCursor = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

if (aura && canvas && canRenderCursor && !reduceMotion) {
  let renderer;
  let model;
  let frame = 0;
  let lastPointerX = window.innerWidth / 2;
  let lastPointerY = window.innerHeight / 2;
  let lastMoveAt = performance.now();
  let targetRotationX = -.04;
  let targetRotationY = .12;
  let currentRotationX = targetRotationX;
  let currentRotationY = targetRotationY;
  let baseScale = 1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 72 / 84, .1, 20);
  camera.position.set(0, .04, 4.2);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);

  const yellowMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd63d,
    roughness: .3,
    metalness: .02,
  });
  const creamMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff0b2,
    roughness: .42,
  });
  const greenMaterial = new THREE.MeshStandardMaterial({
    color: 0x67b84f,
    roughness: .24,
  });
  const blackMaterial = new THREE.MeshStandardMaterial({
    color: 0x10120e,
    roughness: .2,
  });
  const orangeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf39b16,
    roughness: .36,
  });
  const redMaterial = new THREE.MeshStandardMaterial({
    color: 0xd72543,
    roughness: .3,
  });

  [yellowMaterial, creamMaterial, greenMaterial, blackMaterial, orangeMaterial, redMaterial]
    .forEach((material) => {
      material.side = THREE.DoubleSide;
    });

  function materialFor(name) {
    if (name.includes("green")) return greenMaterial;
    if (name.includes("black")) return blackMaterial;
    if (name.includes("orange")) return orangeMaterial;
    if (name.includes("cream")) return creamMaterial;
    if (name.includes("red")) return redMaterial;
    return yellowMaterial;
  }

  function requestCursorFrame() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(renderCursor);
  }

  function renderCursor(now) {
    frame = 0;
    if (!renderer || !model || document.hidden) return;

    currentRotationX += (targetRotationX - currentRotationX) * .16;
    currentRotationY += (targetRotationY - currentRotationY) * .16;
    model.rotation.x = currentRotationX;
    model.rotation.y = currentRotationY;
    model.rotation.z = Math.sin(now * .0032) * .025;

    const hoverScale = aura.classList.contains("is-hovering") ? 1.1 : 1;
    const currentScale = model.scale.x;
    const nextScale = currentScale + (baseScale * hoverScale - currentScale) * .18;
    model.scale.setScalar(nextScale);
    renderer.render(scene, camera);

    const rotationDelta = Math.abs(targetRotationX - currentRotationX) + Math.abs(targetRotationY - currentRotationY);
    const scaleDelta = Math.abs(baseScale * hoverScale - nextScale);
    if (rotationDelta > .002 || scaleDelta > .002 || now - lastMoveAt < 260) requestCursorFrame();
  }

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      // Chromium drops transparent WebGL frames inside the cursor's CSS 3D transform otherwise.
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(72, 84, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    scene.add(new THREE.HemisphereLight(0xfff7d3, 0x7b420e, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
    keyLight.position.set(-2.4, 3.2, 4.6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xffbd3f, 2.4);
    rimLight.position.set(3.2, .8, -1.6);
    scene.add(rimLight);

    new FBXLoader().load(
      "./assets/models/nailong-cursor.fbx?v=20260722-fbx-v1",
      (loadedModel) => {
        loadedModel.traverse((node) => {
          if (!node.isMesh) return;
          node.geometry.computeVertexNormals();
          node.material = materialFor(node.name);
          node.frustumCulled = false;
        });

        const bounds = new THREE.Box3().setFromObject(loadedModel);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        loadedModel.position.sub(center);
        baseScale = 1.9 / Math.max(size.x, size.y, size.z, .001);
        loadedModel.scale.setScalar(baseScale);
        loadedModel.rotation.order = "YXZ";
        model = loadedModel;
        scene.add(model);
        canvas.classList.add("is-model-ready");
        document.body.appendChild(canvas);
        aura.classList.add("is-model-ready");
        aura.dataset.cursorModel = "fbx";
        aura.dataset.cursorMeshes = `${loadedModel.children.length}`;
        requestCursorFrame();
      },
      undefined,
      () => {
        aura.dataset.cursorModel = "css-fallback";
        renderer?.dispose();
        renderer = null;
      },
    );

    window.addEventListener("pointermove", (event) => {
      const velocityX = event.clientX - lastPointerX;
      const velocityY = event.clientY - lastPointerY;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      lastMoveAt = performance.now();
      targetRotationY = THREE.MathUtils.clamp(.12 + velocityX * .025, -.55, .72);
      targetRotationX = THREE.MathUtils.clamp(-.04 + velocityY * .018, -.38, .34);
      requestCursorFrame();
    }, { passive: true });

    aura.addEventListener("transitionstart", requestCursorFrame);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        requestCursorFrame();
      }
    });
    canvas.addEventListener("webglcontextlost", () => {
      canvas.classList.remove("is-model-ready");
      aura.classList.remove("is-model-ready");
      aura.dataset.cursorModel = "css-fallback";
    });
  } catch {
    aura.dataset.cursorModel = "css-fallback";
  }
}
