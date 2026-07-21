document.documentElement.classList.add("has-motion-js");

const scene = document.querySelector(".scroll-scene");
const brandIntro = document.querySelector("#brand-intro");
const siteLoader = document.querySelector("#site-loader");
const siteLoaderVideo = document.querySelector("#site-loader-video");
const siteLoaderProgress = document.querySelector("#site-loader-progress");
const hero = document.querySelector(".hero");
const heroScrollPrompt = document.querySelector(".hero-scroll-prompt");
const wordmark = document.querySelector(".wordmark");
const video = document.querySelector(".scroll-video");
const scrollRevealElements = document.querySelectorAll(".scroll-reveal");
const manifestoScene = document.querySelector(".manifesto-scene");
const manifestoPanel = document.querySelector(".manifesto-panel");
const manifestoVideo = document.querySelector(".manifesto-video");
const manifestoDrum = document.querySelector(".manifesto-drum");
const cardsScene = document.querySelector(".cards-scene");
const cardsStage = document.querySelector(".cards-stage");
const cardsPanel = document.querySelector(".cards-panel");
const cardsEntryAction = document.querySelector("#cards-entry-action");
const flipCards = document.querySelectorAll(".flip-card");
const orbitScene = document.querySelector(".orbit-scene");
const orbitPanel = document.querySelector(".orbit-panel");
const orbitVideo = document.querySelector(".orbit-video");
const orbitTrack = document.querySelector(".orbit-track");
const orbitParticlesLayer = document.querySelector(".orbit-particles");
const orbitTextVeil = document.querySelector(".orbit-text-veil");
const orbitChapter = document.querySelector(".orbit-chapter");
const prologLineElements = [...document.querySelectorAll("[data-prolog-line]")];
const prologSignalElements = [...document.querySelectorAll("[data-prolog-signal]")];
const prologLeadElement = document.querySelector(".prolog-lead");
const prologGlyphElements = [];
const title = "SHU CHENG LIN AI";
const characters = [];
const manifestoLineElements = [];
const orbitLineElements = [];
const orbitParticleElements = [];
const prefersReducedMotion = window.matchMedia
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;
const finePointerQuery = window.matchMedia
  ? window.matchMedia("(pointer: fine)")
  : { matches: false };
const compactViewportQuery = window.matchMedia
  ? window.matchMedia("(max-width: 768px)")
  : { matches: false };

let loaderTargetProgress = 8;
let loaderDisplayedProgress = 0;
let loaderReady = false;
let loaderFrame = 0;
let siteLoaderStarted = false;
let brandIntroTimer = 0;
let brandIntroFinished = false;
let cardsUnlocked = !cardsEntryAction || prefersReducedMotion;
let cardsPreloaded = false;

function waitForImage(image) {
  if (!image) return Promise.resolve();
  if (image.complete && image.naturalWidth > 0) {
    return image.decode?.().catch(() => {}) || Promise.resolve();
  }

  return new Promise((resolve) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", resolve, { once: true });
  });
}

function waitForFirstVideoFrame(element, timeout = 2200) {
  if (!element || element.readyState >= 2) return Promise.resolve();

  return new Promise((resolve) => {
    const finish = () => resolve();
    element.addEventListener("loadeddata", finish, { once: true });
    element.addEventListener("error", finish, { once: true });
    window.setTimeout(finish, timeout);
  });
}

function settleAfter(promise, timeout = 1600) {
  return Promise.race([
    Promise.resolve(promise).catch(() => {}),
    new Promise((resolve) => window.setTimeout(resolve, timeout)),
  ]);
}

function nextPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

async function warmSceneCompositor(forceLoaderBlend = true) {
  if (!siteLoader || !manifestoPanel) return;

  const loaderOpacity = siteLoader.style.opacity;
  const loaderTransition = siteLoader.style.transition;
  const panelTransform = manifestoPanel.style.transform;
  const panelTransition = manifestoPanel.style.transition;

  if (forceLoaderBlend) {
    siteLoader.style.transition = "none";
    siteLoader.style.opacity = "0.999";
  }
  manifestoPanel.style.transition = "none";
  manifestoPanel.style.transform = "translate3d(0, 0, 0)";
  await nextPaint();

  manifestoPanel.style.transform = panelTransform;
  await nextPaint();

  if (forceLoaderBlend) {
    siteLoader.style.opacity = loaderOpacity;
    siteLoader.style.transition = loaderTransition;
  }
  manifestoPanel.style.transition = panelTransition;
}

function renderLoaderProgress() {
  if (!siteLoader || !siteLoaderProgress) return;

  const difference = loaderTargetProgress - loaderDisplayedProgress;
  loaderDisplayedProgress += Math.max(0.12, difference * 0.075);
  loaderDisplayedProgress = Math.min(loaderDisplayedProgress, loaderTargetProgress);

  const roundedProgress = Math.min(100, Math.floor(loaderDisplayedProgress));
  siteLoaderProgress.textContent = `${String(roundedProgress).padStart(2, "0")} / 100%`;
  siteLoader.style.setProperty("--loader-progress", `${loaderDisplayedProgress}`);

  if (loaderTargetProgress === 100 && loaderDisplayedProgress >= 99.55) {
    loaderDisplayedProgress = 100;
    siteLoaderProgress.textContent = "100 / 100%";
    siteLoader.style.setProperty("--loader-progress", "100");
    siteLoader.disabled = false;
    siteLoader.classList.add("is-ready");
    loaderReady = true;
    return;
  }

  loaderFrame = requestAnimationFrame(renderLoaderProgress);
}

function handleBrandIntroKey(event) {
  if (!brandIntro || brandIntroFinished) return;
  if (event.code !== "Enter" && event.code !== "Space" && event.code !== "Escape") return;

  event.preventDefault();
  finishBrandIntro();
}

function finishBrandIntro() {
  if (!brandIntro || brandIntroFinished) return;

  brandIntroFinished = true;
  window.clearTimeout(brandIntroTimer);
  brandIntro.removeEventListener("click", finishBrandIntro);
  window.removeEventListener("keydown", handleBrandIntroKey);
  brandIntro.classList.add("is-leaving");

  window.setTimeout(() => {
    brandIntro.remove();
    startSiteLoader();
  }, 520);
}

function startBrandIntro() {
  if (!brandIntro || prefersReducedMotion) {
    brandIntro?.remove();
    startSiteLoader();
    return;
  }

  siteLoaderVideo?.pause();
  brandIntro.addEventListener("click", finishBrandIntro);
  window.addEventListener("keydown", handleBrandIntroKey);
  brandIntroTimer = window.setTimeout(finishBrandIntro, 3250);
}

function startSiteLoader() {
  if (!siteLoader) {
    document.body.classList.remove("is-loading");
    return;
  }

  if (siteLoaderStarted) return;
  siteLoaderStarted = true;
  siteLoader.classList.remove("is-awaiting-brand");
  siteLoaderVideo?.play().catch(() => {});

  const heroPoster = document.querySelector(".hero-poster-frame");
  const fontReady = settleAfter(document.fonts?.ready || Promise.resolve(), 1400);
  const essentialTasks = [
    waitForFirstVideoFrame(siteLoaderVideo, 1600),
    waitForImage(heroPoster),
    fontReady,
    prepareHeroVideo(),
    warmSceneCompositor(false),
  ];
  let completedTasks = 0;

  essentialTasks.forEach((task) => {
    Promise.resolve(task).finally(() => {
      completedTasks += 1;
      loaderTargetProgress = Math.max(
        loaderTargetProgress,
        18 + (completedTasks / essentialTasks.length) * 76,
      );
    });
  });

  Promise.allSettled(essentialTasks).then(() => {
    window.setTimeout(() => {
      loaderTargetProgress = 100;
    }, 180);
  });

  loaderFrame = requestAnimationFrame(renderLoaderProgress);
}

async function enterSite() {
  if (!siteLoader || !loaderReady) return;

  loaderReady = false;
  cancelAnimationFrame(loaderFrame);
  siteLoader.classList.add("is-leaving");
  await warmSceneCompositor(false);
  document.body.classList.remove("is-loading");
  scheduleSecondaryScrubHydration();
  window.setTimeout(() => siteLoader.remove(), 680);
}

siteLoader?.addEventListener("click", enterSite);

const scrubVideos = [
  {
    element: video,
    scene,
    getProgress: () => getScrollProgress(),
    currentTime: 0,
    targetTime: 0,
    loadAfter: 0,
    primed: false,
    loadStarted: false,
    unlocked: false,
    decoderWarmed: false,
    decoderWarmPromise: null,
    warming: false,
    lastSeekStamp: Number.NEGATIVE_INFINITY,
  },
  {
    element: manifestoVideo,
    scene: manifestoScene,
    getProgress: () => getSceneProgress(manifestoScene),
    currentTime: 0,
    targetTime: 0,
    loadAfter: 0,
    primed: false,
    loadStarted: false,
    unlocked: false,
    decoderWarmed: false,
    decoderWarmPromise: null,
    warming: false,
    lastSeekStamp: Number.NEGATIVE_INFINITY,
  },
]
  .filter(({ element }) => element?.querySelector("source[src], source[data-src]"))
  .map((scrubber) => ({
    ...scrubber,
    sourceUrl:
      scrubber.element.querySelector("source[src], source[data-src]").dataset.src ||
      scrubber.element.querySelector("source[src], source[data-src]").getAttribute("src"),
    hydrating: false,
    hydrated: false,
    hydrateFailed: false,
    hydratePromise: null,
    objectUrl: "",
  }));
const orbitScrubber = scrubVideos.find(({ element }) => element === orbitVideo);
let secondaryHydrationScheduled = false;

function hydrateScrubVideoBlob(scrubber) {
  if (!scrubber?.element || scrubber.hydrated || scrubber.hydrateFailed) {
    return Promise.resolve(scrubber?.element);
  }
  if (scrubber.hydratePromise) return scrubber.hydratePromise;

  const { element, sourceUrl } = scrubber;
  if (!sourceUrl) {
    scrubber.hydrateFailed = true;
    return Promise.resolve(element);
  }

  scrubber.hydrating = true;
  scrubber.loadStarted = true;
  scrubber.autoPreload = true;

  // Keep the browser's native media pipeline. Fetching the entire MP4 into a
  // Blob made both scrubbers allocate and decode at the same time, which is
  // exactly the failure mode seen when the hero and manifesto scenes compete.
  scrubber.hydratePromise = (async () => {
    const source = element.querySelector("source[data-src], source[src]");
    if (source && !source.getAttribute("src")) {
      source.setAttribute("src", sourceUrl);
      source.removeAttribute("data-src");
    }
    element.pause();
    element.preload = element === video ? "auto" : "metadata";
    element.load();
    await waitForFirstVideoFrame(element, 4200);
    if (element.error) throw element.error;

    scrubber.hydrated = true;
    await warmScrubDecoder(scrubber);
    return element;
  })().catch(async (error) => {
    scrubber.hydrateFailed = true;
    console.warn("Direct media hydration failed", error);
    return element;
  }).finally(() => {
    scrubber.hydrating = false;
    scheduleRender();
  });

  return scrubber.hydratePromise;
}

function prepareHeroVideo() {
  const scrubber = scrubVideos.find(({ element }) => element === video);
  if (!video || !scrubber) return Promise.resolve();

  return hydrateScrubVideoBlob(scrubber);
}

function promoteScrubPreload(scrubber) {
  if (!scrubber?.element) return Promise.resolve();
  return hydrateScrubVideoBlob(scrubber);
}

function scheduleSecondaryScrubHydration() {
  if (secondaryHydrationScheduled) return;
  secondaryHydrationScheduled = true;

  const secondary = scrubVideos.filter((scrubber) => scrubber.element !== video);
  if (!secondary.length) return;

  const start = () => secondary.forEach((scrubber) => promoteScrubPreload(scrubber));
  if (!window.IntersectionObserver) {
    window.setTimeout(start, 4500);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    start();
  }, { rootMargin: "120% 0px" });
  secondary.forEach((scrubber) => scrubber.scene && observer.observe(scrubber.scene));
}

let renderRequest = 0;
let renderSupplementalFrame = null;
let lastHeroProgress = Number.NaN;
let lastManifestoProgress = Number.NaN;
let lastCardsProgress = Number.NaN;
let lastOrbitProgress = Number.NaN;
let lastOrbitVisualProgress = Number.NaN;
let displayedHeroProgress = Number.NaN;
let displayedManifestoProgress = Number.NaN;
let displayedCardsProgress = Number.NaN;
let displayedOrbitProgress = Number.NaN;
let lastFocusedOrbitLine = -1;
let lastOrbitChapter = -1;
let scrollVelocity = 0;
let lastScrollY = window.scrollY;
let lastScrollStamp = performance.now();
let lastRenderStamp = performance.now();
let orbitPointerX = 0;
let orbitPointerY = 0;
let orbitPointerTargetX = 0;
let orbitPointerTargetY = 0;

const manifestoLines = [
  "要先[专门化]，不能什么都做",
  "什么都做，就会[什么都不精]",
  "今天的主线是[专门化]、[反复迭代]和[感恩]",
  "先打穿一个点，再让价值观变成[自发动作]",
  "",
  "方法论：把做过的事迭代到[第五版、第六版]",
  "迭代到你[不能再迭代]",
  "真正重要的不是[多开新坑]",
  "而是把做过的事反复打磨到[极限]",
  "把你做过的事情迭代到[第五版]",
  "再迭代到[第六版]",
  "迭代到你不能再迭代，这才[最重要]",
  "",
  "认知：你没有办法[打穿一个点]",
  "就没有办法得到[超额收益]",
  "[专门化]不是保守",
  "而是获得[收益]和[复利]的前提",
  "不能什么都做，什么做就什么都不精",
  "甚至连收益都没有",
  "",
  "价值观：奖励和钱，我没有看到大家[发红包]",
  "拿到成长和奖励后，[感恩]不能只停在心里",
  "要变成群体可见的[动作]",
  "这一点我非常[不满]",
  "说过的这些话，大家就全部都忘了",
  "居然还需要提醒，我觉得非常[离谱]",
  "",
  "价值观的启动，不要总是等[直播讲完]",
  "真正的成长，是能在看书和反思里[启动判断]",
  "希望大家不要总是等别人讲完",
  "而是自发地[反思]、[思考]、[看书]",
  "让更多触达点提醒你",
  "",
  "感恩就是让[贵人给你们卖命]最低成本的方式",
  "感恩不是姿态，而是[长期关系]的经营",
  "相信教给你们的东西",
  "[感恩]是让贵人给你们卖命最低成本的方式",
];

const orbitLines = [
  "旧系统用[流程]掩盖[低效]，再用[共识]推迟真正需要承担的决策",
  "当所有人重复安全答案，稀缺的就是敢于验证的[反共识判断]",
  "每一次注意力分散都在支付成本，[注意力资产]从来不是免费资源",
  "我们拒绝用[会议]替代行动，也拒绝用[汇报]伪装真实结果",
  "规则从不天然正确，它往往只服务于上一代的[资源结构]",
  "没有[责任闭环]的努力，只是被语言和流程包装过的忙碌",
  "信息越多不代表认知越深，[信息压缩]决定最终判断质量",
  "[决策速度]不是草率，而是更快暴露错误并完成有效修正",
  "把复杂交给[系统]，把清晰交给执行者，把结果交给市场",
  "被多数人接受的路径，通常已经失去持续产生[超额收益]的空间",
  "不掌握[问题定义权]，就只能优化别人提前制定好的答案",
  "组织最大的浪费，是让高能力的人等待低质量的[许可]",
  "[资本]、[模型]与渠道都只是杠杆，方向错误只会放大损失",
  "我们质疑每个默认选项，直到找到真正限制结果的[核心约束]",
  "旧秩序奖励[服从]，新秩序只承认可验证、可重复的[结果]",
  "",
  "新秩序从[认知主权]开始，用[第一性原理]重新定义问题",
  "把重复动作交给[自动化工作流]，把关键判断留给真正负责的人",
  "[模型能力]不是演示品，它必须进入业务现场与[责任闭环]",
  "小团队依靠更高的[执行密度]，可以穿透庞大的层级系统",
  "[快速验证]不是追逐热点，而是主动缩短错误持续的时间",
  "每个工具都应增加[决策速度]，而不是制造新的管理负担",
  "[资源重组]的核心，是让最强能力进入最关键的位置",
  "[智能协作]不是减少人，而是持续放大高质量判断的价值",
  "[长期主义]不是缓慢，而是始终积累同一条可复用的优势",
  "我们用[复利系统]经营信任、知识与不可替代的[注意力资产]",
  "[组织杠杆]来自清晰接口、明确责任以及毫不含糊的结果导向",
  "[资本效率]取决于多少资源最终真正抵达用户的问题",
  "[规则制定权]属于持续交付、承担后果并完成验证的人",
  "我们选择高密度同行，让每次[协作]都产生新的[能力迁移]",
  "未来不奖励旁观者，只奖励能把[判断]转化为[系统]的人",
];

wordmark.textContent = "";

for (const character of title) {
  const span = document.createElement("span");
  span.setAttribute("aria-hidden", "true");
  span.setAttribute("translate", "no");

  if (character === " ") {
    span.className = "wordmark__space";
  } else {
    span.className = "wordmark__character";
    span.textContent = character;
    characters.push(span);
  }

  wordmark.append(span);
}

function appendTaggedManifestoText(element, text) {
  const fragment = document.createDocumentFragment();
  const matcher = /\[([^\]]+)\]/g;
  let cursor = 0;
  let match;

  while ((match = matcher.exec(text)) !== null) {
    if (match.index > cursor) {
      const muted = document.createElement("span");
      muted.className = "manifesto-muted";
      muted.textContent = text.slice(cursor, match.index);
      fragment.append(muted);
    }

    const keyword = document.createElement("span");
    keyword.className = "manifesto-keyword";
    keyword.textContent = match[1];
    fragment.append(keyword);
    cursor = matcher.lastIndex;
  }

  if (cursor < text.length) {
    const muted = document.createElement("span");
    muted.className = "manifesto-muted";
    muted.textContent = text.slice(cursor);
    fragment.append(muted);
  }

  element.append(fragment);
}

function createManifestoDrum() {
  if (!manifestoDrum) return;

  manifestoLines.forEach((lineText) => {
    const line = document.createElement("div");
    line.className = "manifesto-line";

    if (lineText === "") {
      line.classList.add("is-gap");
      line.setAttribute("aria-hidden", "true");
    } else {
      if (/[一-鿿]/.test(lineText)) {
        line.classList.add("is-cn");
      }

      line.setAttribute(
        "aria-label",
        lineText.replace(/\[([^\]]+)\]/g, "$1"),
      );
      appendTaggedManifestoText(line, lineText);
    }

    manifestoDrum.append(line);
    manifestoLineElements.push(line);
  });
}

createManifestoDrum();

function preparePrologTypography() {
  prologLineElements.forEach((line, lineIndex) => {
    const text = line.textContent.trim();
    line.setAttribute("aria-label", text);
    line.textContent = "";

    Array.from(text).forEach((character, index) => {
      const glyph = document.createElement("span");
      glyph.className = "prolog-glyph";
      glyph.setAttribute("aria-hidden", "true");
      glyph.dataset.glyphIndex = `${index}`;
      glyph.dataset.lineIndex = `${lineIndex}`;
      glyph.textContent = character === " " ? "\u00a0" : character;
      line.append(glyph);
      prologGlyphElements.push(glyph);
    });
  });
}

preparePrologTypography();

function appendOrbitTaggedText(element, text) {
  const fragment = document.createDocumentFragment();
  const matcher = /\[([^\]]+)\]/g;
  let cursor = 0;
  let match;

  while ((match = matcher.exec(text)) !== null) {
    if (match.index > cursor) {
      const muted = document.createElement("span");
      muted.className = "orbit-muted";
      muted.textContent = text.slice(cursor, match.index);
      fragment.append(muted);
    }

    const keyword = document.createElement("span");
    keyword.className = "orbit-keyword";
    keyword.textContent = match[1];
    fragment.append(keyword);
    cursor = matcher.lastIndex;
  }

  if (cursor < text.length) {
    const muted = document.createElement("span");
    muted.className = "orbit-muted";
    muted.textContent = text.slice(cursor);
    fragment.append(muted);
  }

  element.append(fragment);
}

function createOrbitTrack() {
  if (!orbitTrack) return;

  orbitLines.forEach((lineText, index) => {
    const line = document.createElement("div");
    line.className = "orbit-line";
    line.dataset.orbitIndex = `${index}`;

    if (lineText === "") {
      line.classList.add("is-gap");
      line.setAttribute("aria-hidden", "true");
    } else {
      line.setAttribute(
        "aria-label",
        lineText.replace(/\[([^\]]+)\]/g, "$1"),
      );
      appendOrbitTaggedText(line, lineText);
    }

    orbitTrack.append(line);
    orbitLineElements.push(line);
  });
}

function createOrbitParticles() {
  if (!orbitParticlesLayer) return;

  const compactViewport = window.innerWidth <= 768;
  const particleCount = compactViewport
    ? 0
    : finePointerQuery.matches
      ? 14
      : 6;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const depth = 0.35 + ((index * 37) % 65) / 100;
    particle.className = "orbit-particle";
    particle.dataset.depth = `${depth}`;
    particle.style.left = `${7 + ((index * 19) % 88)}%`;
    particle.style.top = `${8 + ((index * 31) % 84)}%`;
    particle.style.opacity = `${0.18 + depth * 0.52}`;
    particle.style.transform = `scale(${0.55 + depth * 0.9})`;
    orbitParticlesLayer.append(particle);
    orbitParticleElements.push(particle);
  }
}

createOrbitTrack();
createOrbitParticles();

function fitWordmark() {
  const targetWidth =
    hero.clientWidth * (compactViewportQuery.matches ? 0.92 : 0.82);

  wordmark.style.fontSize = "100px";
  const measuredWidth = wordmark.getBoundingClientRect().width;

  if (measuredWidth > 0) {
    wordmark.style.fontSize = `${(100 * targetWidth) / measuredWidth}px`;
  }
}

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

const sceneLayoutCache = new WeakMap();
const measuredScenes = [scene, manifestoScene, cardsScene, orbitScene].filter(Boolean);

function measureSceneLayout(targetScene) {
  const bounds = targetScene.getBoundingClientRect();
  const metrics = {
    top: bounds.top + window.scrollY,
    height: bounds.height,
  };
  sceneLayoutCache.set(targetScene, metrics);
  return metrics;
}

function refreshSceneLayouts() {
  measuredScenes.forEach(measureSceneLayout);
}

function getSceneState(targetScene) {
  if (!targetScene) {
    return { bounds: null, progress: 0 };
  }

  const metrics = sceneLayoutCache.get(targetScene) || measureSceneLayout(targetScene);
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const top = metrics.top - window.scrollY;
  const bounds = {
    top,
    bottom: top + metrics.height,
    height: metrics.height,
  };
  const scrollDistance = metrics.height - viewportHeight;

  return {
    bounds,
    progress: scrollDistance > 0
      ? clamp(-bounds.top / scrollDistance)
      : 0,
  };
}

function getSceneProgress(targetScene) {
  return getSceneState(targetScene).progress;
}

function getScrollProgress() {
  return getSceneProgress(scene);
}

function smoothSceneProgress(current, target, deltaTime) {
  if (prefersReducedMotion || !Number.isFinite(current)) return target;

  const distance = Math.abs(target - current);
  const timeConstant = distance > 0.2 ? 58 : 78;
  const blend = 1 - Math.exp(-deltaTime / timeConstant);
  const next = current + (target - current) * blend;
  return Math.abs(target - next) < 0.00008 ? target : next;
}

function updateCharacters(progress) {
  const staggerWindow = 0.2;
  const animationEnd = 0.52;
  const dropDistance = Math.max(120, hero.clientHeight * 0.24);
  const lastIndex = Math.max(1, characters.length - 1);

  characters.forEach((character, index) => {
    const start = (index / lastIndex) * staggerWindow;
    const localProgress = clamp((progress - start) / (animationEnd - start));
    const easedDrop = 1 - Math.pow(1 - localProgress, 3);
    const squeeze = Math.sin(localProgress * Math.PI);
    const scaleX = 1 - squeeze * 0.18;
    const scaleY = 1 + squeeze * 0.08;

    character.style.opacity = `${1 - localProgress}`;
    character.style.transform =
      `translate3d(0, ${easedDrop * dropDistance}px, 0) ` +
      `scale(${scaleX}, ${scaleY})`;
  });
}

function updateScrollPrompt(progress) {
  if (!heroScrollPrompt) return;

  const exitProgress = easeOutCubic(clamp(progress / 0.08));
  heroScrollPrompt.style.opacity = `${1 - exitProgress}`;
  heroScrollPrompt.style.transform =
    `translate3d(${exitProgress * -20}px, -50%, 0)`;
}

function updateScrollReveals(progress) {
  const revealStart = 0.08;
  const revealDuration = 0.34;
  const stagger = 0.095;
  const compactViewport = compactViewportQuery.matches;

  scrollRevealElements.forEach((element, index) => {
    if (prefersReducedMotion) {
      element.style.opacity = "1";
      element.style.filter = "none";
      element.style.transform = "none";
      return;
    }

    const localProgress = clamp(
      (progress - revealStart - index * stagger) / revealDuration,
    );
    const easedProgress = 1 - Math.pow(1 - localProgress, 3);
    const inverseProgress = 1 - easedProgress;
    const translateX = inverseProgress * (compactViewport ? 38 : 72);
    const blur = inverseProgress * (compactViewport ? 3 : 5);
    const scale = 0.94 + easedProgress * 0.06;

    element.style.opacity = `${easedProgress}`;
    element.style.filter = `blur(${blur}px)`;
    element.style.transform =
      `translate3d(${translateX}px, 0, 0) scale(${scale})`;
  });
}

function updateManifestoPanel(progress) {
  if (!manifestoPanel) return;

  if (prefersReducedMotion) {
    manifestoPanel.style.transform = "none";
    return;
  }

  const panelProgress = easeOutCubic(clamp(progress / 0.32));
  const translateY = (1 - panelProgress) * 102;
  manifestoPanel.style.transform = `translate3d(0, ${translateY}%, 0)`;
}

function updateCardsPanel(progress) {
  if (!cardsPanel || !cardsStage) return;
  cardsStage.style.setProperty("--cards-progress", `${progress}`);
  if (cardsUnlocked) cardsStage.classList.add("is-deck-entered");
}

let lastPrologMotionProgress = Number.NaN;

function updatePrologMotion(progress) {
  if (prefersReducedMotion || Math.abs(progress - lastPrologMotionProgress) < 0.0005) return;
  lastPrologMotionProgress = progress;

  prologGlyphElements.forEach((glyph) => {
    const glyphIndex = Number(glyph.dataset.glyphIndex) || 0;
    const lineIndex = Number(glyph.dataset.lineIndex) || 0;
    const start = -0.08 + lineIndex * 0.065 + glyphIndex * 0.012;
    const localProgress = clamp((progress - start) / 0.32);
    const eased = easeOutCubic(localProgress);
    const arc = Math.sin(localProgress * Math.PI) * -12;
    const translateY = (1 - eased) * 54 + arc;
    const rotation = (1 - eased) * (glyphIndex % 2 === 0 ? -3.5 : 3.5);
    const scale = 0.88 + eased * 0.12;
    glyph.style.opacity = `${0.16 + eased * 0.84}`;
    glyph.style.transform = `translate3d(0, ${translateY}px, 0) rotate(${rotation}deg) scale(${scale})`;
  });

  prologSignalElements.forEach((signal, index) => {
    const localProgress = clamp((progress - 0.1 - index * 0.12) / 0.28);
    const eased = easeOutCubic(localProgress);
    const direction = index % 2 === 0 ? 1 : -1;
    signal.style.opacity = `${0.12 + eased * 0.88}`;
    signal.style.transform = `translate3d(${(1 - eased) * 34 * direction}px, ${(1 - eased) * 22}px, 0)`;
  });

  if (prologLeadElement) {
    const leadProgress = easeOutCubic(clamp((progress + 0.08) / 0.24));
    prologLeadElement.style.opacity = `${0.28 + leadProgress * 0.72}`;
    prologLeadElement.style.clipPath = `inset(0 ${(1 - leadProgress) * 100}% 0 0)`;
    prologLeadElement.style.transform = `translate3d(${(1 - leadProgress) * -24}px, 0, 0)`;
  }
}

function updateManifestoDrum(progress) {
  if (!manifestoLineElements.length) return;

  const compactViewport = compactViewportQuery.matches;
  const drumProgress = clamp((progress - 0.2) / 0.74);
  const focusedLine = drumProgress * (manifestoLineElements.length - 1);
  const radius = compactViewport
    ? Math.min(270, Math.max(210, window.innerHeight * 0.34))
    : Math.min(390, Math.max(300, window.innerHeight * 0.42));
  const lineSpacing = compactViewport
    ? Math.min(34, Math.max(24, window.innerHeight * 0.042))
    : Math.min(44, Math.max(28, window.innerHeight * 0.052));

  manifestoLineElements.forEach((line, index) => {
    if (prefersReducedMotion) {
      line.style.opacity = line.classList.contains("is-gap") ? "0" : "1";
      line.style.filter = "none";
      line.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    const distance = index - focusedLine;
    const absoluteDistance = Math.abs(distance);
    const angle = distance * 0.22;
    const translateY = distance * lineSpacing;
    const translateZ = (Math.cos(angle) - 1) * radius;
    const rotateX = -Math.sin(angle) * (compactViewport ? 10 : 16);
    const centerWeight = clamp(1 - absoluteDistance / 5.2);
    if (centerWeight <= 0.035 || line.classList.contains("is-gap")) {
      if (line.dataset.drumVisible !== "false") {
        line.dataset.drumVisible = "false";
        line.style.opacity = "0";
        line.style.filter = "none";
        line.style.transform = "translate3d(0, -50%, 0) scale(0.92)";
      }
      return;
    }

    line.dataset.drumVisible = "true";

    const opacity =
      line.classList.contains("is-gap")
      ? 0
      : Math.pow(centerWeight, 1.72);
    const blur = 0;
    const scale = 0.92 + centerWeight * 0.08;

    line.style.opacity = `${opacity}`;
    line.style.filter = `blur(${blur}px)`;
    line.style.zIndex = `${Math.round(centerWeight * 100)}`;
    line.style.transform =
      `translate3d(0, ${translateY}px, ${translateZ}px) ` +
      `translateY(-50%) rotateX(${rotateX}deg) scale(${scale})`;
  });
}

function updateOrbitPanel(progress) {
  if (!orbitPanel) return;

  if (prefersReducedMotion) {
    orbitPanel.style.transform = "none";
    orbitPanel.style.borderRadius = "38px 38px 18px 18px";
    return;
  }

  const entrance = easeOutCubic(clamp(progress / 0.13));
  const translateY = (1 - entrance) * 106;
  const topRadius = 38 + (1 - entrance) * 42;
  const lowerRadius = 18 + (1 - entrance) * 22;

  orbitPanel.style.transform = `translate3d(0, ${translateY}%, 0)`;
  orbitPanel.style.borderRadius =
    `${topRadius}px ${topRadius}px ${lowerRadius}px ${lowerRadius}px`;

}

function updateOrbitParticles(progress, velocity) {
  if (!orbitParticleElements.length || window.innerWidth <= 768) return;

  const stretch = 1 + Math.min(7, Math.abs(velocity) * 0.18);

  orbitParticleElements.forEach((particle, index) => {
    const depth = Number(particle.dataset.depth) || 0.5;
    const direction = index % 2 === 0 ? 1 : -1;
    const travelX = (progress * 420 - 90) * depth * direction;
    const travelY = (progress * -190 + Math.sin(progress * 12 + index) * 18) * depth;
    const scale = 0.55 + depth * 0.9;

    particle.style.transform =
      `translate3d(${travelX}px, ${travelY}px, 0) ` +
      `scale(${scale * stretch}, ${scale})`;
  });
}

function updateOrbitTrack(progress, velocity) {
  if (!orbitLineElements.length || !orbitPanel) return;

  const compactViewport = window.innerWidth <= 768;
  const trackProgress = clamp((progress - 0.08) / 0.84);
  const focusedLine = trackProgress * (orbitLineElements.length - 1);
  const focusedIndex = Math.round(focusedLine);
  const speedBlur = 0;
  const endingProgress = clamp((trackProgress - 0.94) / 0.06);
  const gapIndex = orbitLines.findIndex((line) => line === "");
  const chapterDim = gapIndex < 0
    ? 0
    : Math.pow(clamp(1 - Math.abs(focusedLine - gapIndex) / 1.35), 1.4);

  orbitPanel.style.setProperty("--orbit-chapter-dim", `${chapterDim}`);

  const activeChapter = gapIndex >= 0 && focusedLine > gapIndex ? 1 : 0;
  if (orbitChapter && activeChapter !== lastOrbitChapter) {
    const number = document.createElement("span");
    number.textContent = activeChapter === 0 ? "01" : "02";
    orbitChapter.replaceChildren(
      number,
      document.createTextNode(
        activeChapter === 0 ? " 拆解旧规则" : " 建立新秩序",
      ),
    );
    lastOrbitChapter = activeChapter;
  }

  if (orbitTrack) {
    orbitTrack.style.transform =
      `translate3d(${orbitPointerX * 12}px, ${orbitPointerY * 8}px, 0) ` +
      `rotateY(${orbitPointerX * 1.4}deg) rotateX(${orbitPointerY * -0.8}deg)`;
  }

  if (orbitTextVeil) {
    const veilX =
      (compactViewport ? 0 : Math.sin(trackProgress * Math.PI * 4) * 14) +
      orbitPointerX * 5;
    const veilY =
      (compactViewport ? 0 : Math.cos(trackProgress * Math.PI * 3) * 7) +
      orbitPointerY * 4;
    const veilRotation = compactViewport
      ? 0
      : Math.sin(trackProgress * Math.PI * 2) * 0.8;

    orbitTextVeil.style.transform =
      `translate3d(${veilX}px, ${veilY}px, 0) ` +
      `rotate(${veilRotation}deg) scale(${compactViewport ? 1 : 1.04})`;
  }

  if (orbitVideo) {
    const parallaxX = compactViewport ? 0 : orbitPointerX * -4;
    const parallaxY = compactViewport ? 0 : orbitPointerY * -3;
    orbitVideo.style.transform =
      `translate3d(${parallaxX}px, ${parallaxY}px, 0) scale(1.025)`;
  }

  orbitLineElements.forEach((line, index) => {
    const isGap = line.classList.contains("is-gap");
    const offset = index - focusedLine;
    const absoluteOffset = Math.abs(offset);
    const centerWeight = clamp(1 - absoluteOffset / 5.3);

    if (isGap || centerWeight <= 0.025) {
      if (line.dataset.orbitVisible !== "false") {
        line.dataset.orbitVisible = "false";
        line.classList.remove("is-focused");
        line.style.opacity = "0";
        line.style.filter = "none";
        line.style.transform = "translate3d(0, -50%, -1400px) scale(0.62)";
      }
      return;
    }

    line.dataset.orbitVisible = "true";

    const curveX = compactViewport
      ? -8 + offset * 66 + Math.sin(offset * 0.78) * 38
      : -54 + offset * 110 + Math.sin(offset * 0.78) * 86;
    const curveY = compactViewport
      ? Math.sin((index + focusedLine) * 0.34) * 22 + offset * 10
      : Math.sin((index + focusedLine) * 0.34) * 38 + offset * 15;
    const translateZ = offset >= 0
      ? -Math.pow(offset, 1.24) * (compactViewport ? 142 : 210)
      : Math.min(
          compactViewport ? 280 : 440,
          Math.pow(-offset, 1.12) * (compactViewport ? 112 : 160),
        );
    const rotateY = clamp(
      -offset * (compactViewport ? 6.5 : 9.5),
      compactViewport ? -28 : -40,
      compactViewport ? 28 : 40,
    );
    const rotateX = Math.sin(offset * 0.7) * (compactViewport ? 4 : 6);
    const isFinalLine = index === orbitLineElements.length - 1;
    const scale = compactViewport
      ? 0.64 + centerWeight * 0.25 + (isFinalLine ? endingProgress * 0.42 : 0)
      : 0.76 + centerWeight * 0.34 + (isFinalLine ? endingProgress * 0.72 : 0);
    const endingFade = isFinalLine ? 1 : 1 - endingProgress * 0.92;
    const opacity =
      Math.pow(centerWeight, 1.5) *
      (1 - chapterDim * 0.72) *
      endingFade;
    const blur = 0;

    line.style.opacity = `${opacity}`;
    line.style.filter = `blur(${blur}px)`;
    line.style.zIndex = `${Math.round(centerWeight * 100)}`;
    line.style.transform =
      `translate3d(${curveX}px, ${curveY}px, ${translateZ}px) ` +
      `translateY(-50%) rotateY(${rotateY}deg) rotateX(${rotateX}deg) ` +
      `scale(${scale})`;

    if (index === focusedIndex && !isGap) {
      line.classList.add("is-focused");
    } else {
      line.classList.remove("is-focused");
    }
  });

  if (focusedIndex !== lastFocusedOrbitLine) {
    lastFocusedOrbitLine = focusedIndex;
  }

  updateOrbitParticles(trackProgress, velocity);
}

function seekVideoFrame(element, time) {
  if (!Number.isFinite(time) || !Number.isFinite(element.duration)) return;
  const target = clamp(time, 0, Math.max(0, element.duration - 0.001));
  if (Math.abs(element.currentTime - target) < 0.001) return;
  element.currentTime = target;
}

function seekVideoFrameAndWait(element, time, timeout = 900) {
  if (!Number.isFinite(time) || !Number.isFinite(element.duration)) {
    return Promise.resolve();
  }

  const target = clamp(time, 0, Math.max(0, element.duration - 0.001));
  if (Math.abs(element.currentTime - target) < 0.001) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let timer = 0;
    const finish = () => {
      window.clearTimeout(timer);
      element.removeEventListener("seeked", finish);
      element.removeEventListener("error", finish);
      resolve();
    };

    element.addEventListener("seeked", finish, { once: true });
    element.addEventListener("error", finish, { once: true });
    timer = window.setTimeout(finish, timeout);
    seekVideoFrame(element, target);
  });
}

function warmScrubDecoder(scrubber) {
  if (!scrubber?.element || scrubber.decoderWarmed) {
    return Promise.resolve();
  }
  if (scrubber.decoderWarmPromise) return scrubber.decoderWarmPromise;

  const { element } = scrubber;
  scrubber.warming = true;
  scrubber.decoderWarmPromise = (async () => {
    await waitForFirstVideoFrame(element, 1800);
    if (!Number.isFinite(element.duration) || element.duration <= 0) return;

    const targetTime = clamp(
      scrubber.getProgress() * element.duration,
      0,
      Math.max(0, element.duration - 0.001),
    );
    await seekVideoFrameAndWait(element, targetTime);
    element.pause();
    scrubber.currentTime = targetTime;
    scrubber.targetTime = targetTime;
    scrubber.primed = true;
    scrubber.decoderWarmed = true;
  })().finally(() => {
    scrubber.warming = false;
    scheduleRender();
  });

  return scrubber.decoderWarmPromise;
}

function setupScrubVideo(scrubber) {
  const { element } = scrubber;

  element.muted = true;
  element.playsInline = true;
  element.preload = element.getAttribute("preload") || "metadata";
  scrubber.loadStarted = element.preload !== "none";
  scrubber.autoPreload = element.preload === "auto";
  element.pause();

  element.addEventListener("loadeddata", () => {
    element.classList.add("is-ready");
    if (element === video) hero.classList.add("hero-video-ready");
  });

  const primeVideo = () => {
    if (!Number.isFinite(element.duration) || element.duration <= 0) {
      scrubber.primed = true;
      return;
    }

    scrubber.targetTime = scrubber.getProgress() * element.duration;
    scrubber.currentTime = scrubber.targetTime;
    scrubber.primed = true;
    if (scrubber.autoPreload && element !== video) warmScrubDecoder(scrubber);
    scheduleRender();
  };

  if (element.readyState >= 1) {
    primeVideo();
  } else {
    element.addEventListener("loadedmetadata", primeVideo);
    if (
      scrubber.loadStarted &&
      element.networkState === HTMLMediaElement.NETWORK_EMPTY
    ) {
      element.load();
    }
  }

  element.addEventListener("seeked", scheduleRender);
}

function unlockScrubVideo(scrubber) {
  if (scrubber.unlocked) return;

  scrubber.unlocked = true;
}

function updateScrubVideo(scrubber, sceneState) {
  const { element } = scrubber;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const progress = sceneState?.progress ?? scrubber.getProgress();

  if (scrubber.scene) {
    const sceneBounds = sceneState?.bounds || scrubber.scene.getBoundingClientRect();
    const isHeroScrubber = element === video;
    const leadIn = isHeroScrubber ? 1.08 : 1.05;
    const leadOut = isHeroScrubber ? 0.12 : 0.18;
    const isNearViewport =
      sceneBounds.top < viewportHeight * leadIn &&
      sceneBounds.bottom > -viewportHeight * leadOut;

    if (!isNearViewport) {
      return false;
    }

    // Keep the second media resource out of the first scene's critical path.
    // It starts as soon as the user actually enters its scroll range.
    if (
      !isHeroScrubber &&
      progress < 0.02 &&
      sceneBounds.top > viewportHeight * 0.45
    ) {
      return false;
    }
  }

  if (!scrubber.hydrated && !scrubber.hydrateFailed) {
    if (performance.now() < scrubber.loadAfter) {
      return false;
    }

    if (!scrubber.hydrating) promoteScrubPreload(scrubber);
    return false;
  }

  if (!scrubber.autoPreload) {
    promoteScrubPreload(scrubber);
    return false;
  }

  if (scrubber.warming) return false;

  if (
    !scrubber.primed ||
    !Number.isFinite(element.duration) ||
    element.duration <= 0
  ) {
    return false;
  }

  unlockScrubVideo(scrubber);

  const declaredFrameRate = Number(element.dataset.frameRate);
  const frameRate = Number.isFinite(declaredFrameRate) && declaredFrameRate > 0
    ? declaredFrameRate
    : 30;
  const rawTargetTime = progress * element.duration;
  const targetTime = Math.min(
    element.duration,
    Math.round(rawTargetTime * frameRate) / frameRate,
  );
  const seekThreshold = 1 / frameRate / 2;

  scrubber.targetTime = targetTime;

  if (element.seeking) {
    // Do not enqueue another seek while the browser is decoding one. The
    // latest target is retained above and applied on the next seeked event.
    return true;
  }

  if (Math.abs(element.currentTime - targetTime) < seekThreshold) {
    return false;
  }

  const now = performance.now();
  if (now - scrubber.lastSeekStamp < 1000 / frameRate) {
    return true;
  }

  scrubber.lastSeekStamp = now;
  scrubber.currentTime = targetTime;
  seekVideoFrame(element, targetTime);
  return element.seeking;
}

function updateScrubVideos(sceneStates) {
  let shouldContinue = false;

  scrubVideos.forEach((scrubber) => {
    if (updateScrubVideo(scrubber, sceneStates.get(scrubber.scene))) {
      shouldContinue = true;
    }
  });

  return shouldContinue;
}

function renderFrame(frameStamp = performance.now()) {
  renderRequest = 0;

  if (document.hidden) return;

  const deltaTime = Math.min(48, Math.max(1, frameStamp - lastRenderStamp));
  lastRenderStamp = frameStamp;

  const scrollY = window.scrollY;
  const scrollDeltaTime = Math.max(1, frameStamp - lastScrollStamp);
  const instantaneousVelocity = (scrollY - lastScrollY) / scrollDeltaTime;
  scrollVelocity = scrollVelocity * 0.72 + instantaneousVelocity * 0.28;
  lastScrollY = scrollY;
  lastScrollStamp = frameStamp;

  const rawHeroState = getSceneState(scene);
  const rawManifestoState = getSceneState(manifestoScene);
  const rawCardsState = getSceneState(cardsScene);
  const rawOrbitState = getSceneState(orbitScene);
  displayedHeroProgress = smoothSceneProgress(
    displayedHeroProgress,
    rawHeroState.progress,
    deltaTime,
  );
  displayedManifestoProgress = smoothSceneProgress(
    displayedManifestoProgress,
    rawManifestoState.progress,
    deltaTime,
  );
  displayedCardsProgress = smoothSceneProgress(
    displayedCardsProgress,
    rawCardsState.progress,
    deltaTime,
  );
  displayedOrbitProgress = smoothSceneProgress(
    displayedOrbitProgress,
    rawOrbitState.progress,
    deltaTime,
  );

  const heroState = { ...rawHeroState, progress: displayedHeroProgress };
  const manifestoState = {
    ...rawManifestoState,
    progress: displayedManifestoProgress,
  };
  const cardsState = { ...rawCardsState, progress: displayedCardsProgress };
  const orbitState = { ...rawOrbitState, progress: displayedOrbitProgress };
  const sceneStates = new Map([
    [scene, heroState],
    [manifestoScene, manifestoState],
    [cardsScene, cardsState],
    [orbitScene, orbitState],
  ]);
  const progress = heroState.progress;
  const manifestoProgress = manifestoState.progress;
  const cardsProgress = cardsState.progress;
  const orbitProgress = orbitState.progress;
  const scrubActive = updateScrubVideos(sceneStates);
  const orbitVisualProgress =
    orbitScrubber && Number.isFinite(orbitVideo?.duration) && orbitVideo.duration > 0
      ? clamp(orbitVideo.currentTime / orbitVideo.duration)
      : orbitProgress;
  const heroChanged =
    !Number.isFinite(lastHeroProgress) ||
    Math.abs(progress - lastHeroProgress) > 0.0001;
  const manifestoChanged =
    !Number.isFinite(lastManifestoProgress) ||
    Math.abs(manifestoProgress - lastManifestoProgress) > 0.0001;
  const cardsChanged =
    !Number.isFinite(lastCardsProgress) ||
    Math.abs(cardsProgress - lastCardsProgress) > 0.0001;
  const orbitChanged =
    !Number.isFinite(lastOrbitProgress) ||
    Math.abs(orbitProgress - lastOrbitProgress) > 0.0001;
  const orbitVisualChanged =
    !Number.isFinite(lastOrbitVisualProgress) ||
    Math.abs(orbitVisualProgress - lastOrbitVisualProgress) > 0.0001;
  const pointerDeltaX = orbitPointerTargetX - orbitPointerX;
  const pointerDeltaY = orbitPointerTargetY - orbitPointerY;
  const pointerActive =
    Math.abs(pointerDeltaX) > 0.001 || Math.abs(pointerDeltaY) > 0.001;
  const velocityActive = Math.abs(scrollVelocity) > 0.015;
  const progressSettling =
    Math.abs(rawHeroState.progress - displayedHeroProgress) > 0.00008 ||
    Math.abs(rawManifestoState.progress - displayedManifestoProgress) > 0.00008 ||
    Math.abs(rawCardsState.progress - displayedCardsProgress) > 0.00008 ||
    Math.abs(rawOrbitState.progress - displayedOrbitProgress) > 0.00008;

  orbitPointerX += pointerDeltaX * 0.08;
  orbitPointerY += pointerDeltaY * 0.08;

  if (heroChanged) {
    updateScrollPrompt(progress);
    updateCharacters(progress);
    updateScrollReveals(progress);
    lastHeroProgress = progress;
  }

  if (manifestoChanged) {
    updateManifestoPanel(manifestoProgress);
    updateManifestoDrum(manifestoProgress);
    lastManifestoProgress = manifestoProgress;
  }

  if (cardsChanged) {
    updateCardsPanel(cardsProgress);
    lastCardsProgress = cardsProgress;
  }

  if (orbitChanged) {
    updateOrbitPanel(orbitProgress);
    lastOrbitProgress = orbitProgress;
  }

  if (orbitVisualChanged || velocityActive || pointerActive) {
    updateOrbitTrack(orbitVisualProgress, scrollVelocity);
    lastOrbitVisualProgress = orbitVisualProgress;
  }

  renderSupplementalFrame?.(frameStamp, scrollY);

  scrollVelocity *= 0.84;

  if (
    scrubActive ||
    progressSettling ||
    Math.abs(scrollVelocity) > 0.015 ||
    pointerActive
  ) {
    scheduleRender();
  }
}

function scheduleRender() {
  if (renderRequest || document.hidden) return;
  renderRequest = requestAnimationFrame(renderFrame);
}

function invalidateRender() {
  refreshSceneLayouts();
  lastHeroProgress = Number.NaN;
  lastManifestoProgress = Number.NaN;
  lastCardsProgress = Number.NaN;
  lastOrbitProgress = Number.NaN;
  lastOrbitVisualProgress = Number.NaN;
  displayedHeroProgress = Number.NaN;
  displayedManifestoProgress = Number.NaN;
  displayedCardsProgress = Number.NaN;
  displayedOrbitProgress = Number.NaN;
  lastRenderStamp = performance.now();
  scheduleRender();
}

function handleScroll() {
  scheduleRender();
}

function handlePointerMove(event) {
  if (!window.matchMedia?.("(pointer: fine)").matches) return;

  orbitPointerTargetX = (event.clientX / window.innerWidth - 0.5) * 2;
  orbitPointerTargetY = (event.clientY / window.innerHeight - 0.5) * 2;
  scheduleRender();
}

const cardTiltFrames = new WeakMap();

function handleCardPointerMove(event) {
  const card = event.currentTarget;
  card.dataset.pointerX = `${event.clientX}`;
  card.dataset.pointerY = `${event.clientY}`;
  if (cardTiltFrames.has(card)) return;

  const frame = requestAnimationFrame(() => {
    cardTiltFrames.delete(card);
    const bounds = card.getBoundingClientRect();
    const pointerX = Number(card.dataset.pointerX);
    const pointerY = Number(card.dataset.pointerY);
    const normalizedX = clamp((pointerX - bounds.left) / bounds.width, 0, 1);
    const normalizedY = clamp((pointerY - bounds.top) / bounds.height, 0, 1);
    card.style.setProperty("--card-rx", `${(0.5 - normalizedY) * 7}deg`);
    card.style.setProperty("--card-ry", `${(normalizedX - 0.5) * 9}deg`);
  });
  cardTiltFrames.set(card, frame);
}

function resetCardTilt(event) {
  const card = event.currentTarget;
  const frame = cardTiltFrames.get(card);
  if (frame) cancelAnimationFrame(frame);
  cardTiltFrames.delete(card);
  card.style.setProperty("--card-rx", "0deg");
  card.style.setProperty("--card-ry", "0deg");
}

function preloadFlipCardImages() {
  if (cardsPreloaded) return;
  cardsPreloaded = true;
  flipCards.forEach((card) => {
    card.querySelectorAll("img").forEach((image) => {
      image.loading = "eager";
      image.decode?.().catch(() => {});
    });
  });
}

function enterCardsDeck() {
  if (cardsUnlocked || !cardsStage || !cardsPanel) return;
  cardsUnlocked = true;
  preloadFlipCardImages();
  cardsPanel.style.removeProperty("transform");
  cardsStage.classList.add("is-deck-entered");
  cardsEntryAction?.setAttribute("aria-expanded", "true");
  if (cardsEntryAction) cardsEntryAction.disabled = true;
  scheduleRender();
}

cardsEntryAction?.addEventListener("pointerenter", preloadFlipCardImages, { once: true });
cardsEntryAction?.addEventListener("focus", preloadFlipCardImages, { once: true });
cardsEntryAction?.addEventListener("click", enterCardsDeck);

flipCards.forEach((card, index) => {
  const cardNumber = String(index + 1).padStart(2, "0");
  card.addEventListener("click", () => {
    const isFlipped = card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", `${isFlipped}`);
    card.setAttribute(
      "aria-label",
      `${isFlipped ? "收起" : "翻开"}卡片 ${cardNumber}`,
    );
  });

  if (finePointerQuery.matches && !prefersReducedMotion) {
    card.addEventListener("pointermove", handleCardPointerMove, { passive: true });
    card.addEventListener("pointerleave", resetCardTilt, { passive: true });
  }
});

const resizeObserver = new ResizeObserver(() => {
  fitWordmark();
  invalidateRender();
});
resizeObserver.observe(hero);

scrubVideos.forEach(setupScrubVideo);
startBrandIntro();

if (document.fonts?.ready) {
  document.fonts.ready.then(() => {
    fitWordmark();
    invalidateRender();
  });
}

window.addEventListener("scroll", handleScroll, { passive: true });

window.addEventListener("pagehide", (event) => {
  if (event.persisted) return;
  scrubVideos.forEach((scrubber) => {
    if (!scrubber.objectUrl) return;
    URL.revokeObjectURL(scrubber.objectUrl);
    scrubber.objectUrl = "";
  });
});
window.addEventListener("resize", invalidateRender, { passive: true });
if (finePointerQuery.matches && orbitTrack) {
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
}
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) invalidateRender();
});

fitWordmark();
refreshSceneLayouts();
scheduleRender();

function mountOverdriveExperience() {
  const root = document.documentElement;
  const transitionGrid = document.querySelector("#transition-grid");
  const cursorAura = document.querySelector("#cursor-aura");
  const menuDialog = document.querySelector("#menu-dialog");
  const menuOpen = document.querySelector("#menu-open");
  const menuClose = document.querySelector("#menu-close");
  const chapterLinks = [...document.querySelectorAll(".chapter-rail a")];
  const prologScene = document.querySelector(".prolog-scene");
  const prologStage = document.querySelector(".prolog-stage");
  const factoidsScene = document.querySelector(".factoids-scene");
  const galleryScene = document.querySelector(".gallery-scene");
  const galleryStage = document.querySelector(".gallery-stage");
  const galleryCurtain = document.querySelector(".gallery-curtain");
  const galleryEntry = document.querySelector("#gallery-entry");
  const galleryEntryAction = document.querySelector("#gallery-entry-action");
  const galleryViewport = document.querySelector("#orbit-gallery");
  const galleryTrack = document.querySelector(".gallery-track");
  const galleryCards = [...document.querySelectorAll(".orbit-card")];
  const galleryFrames = galleryCards.map((card) => card.querySelector(".orbit-card__frame"));
  const galleryCurrent = document.querySelector("#gallery-current");
  const galleryQuotes = [...document.querySelectorAll("[data-gallery-quote]")];
  const galleryTabs = [...document.querySelectorAll("[data-orbit-jump]")];
  const galleryPrevious = document.querySelector("#orbit-prev");
  const galleryNext = document.querySelector("#orbit-next");
  const galleryDetail = document.querySelector("#gallery-detail");
  const galleryDetailMedia = document.querySelector("#gallery-detail-media");
  const galleryDetailNumber = document.querySelector("#gallery-detail-number");
  const galleryDetailTitle = document.querySelector("#gallery-detail-title");
  const galleryDetailQuote = document.querySelector("#gallery-detail-quote");
  const galleryDetailBody = document.querySelector("#gallery-detail-body");
  const galleryDetailTags = document.querySelector("#gallery-detail-tags");
  const galleryDetailClose = [...document.querySelectorAll("[data-gallery-close]")];
  const encoreScene = document.querySelector(".encore-scene");
  const replayButton = document.querySelector("#replay-story");
  const selectedCardLabel = document.querySelector("#selected-card");
  const inspectCardButton = document.querySelector("#inspect-card");
  const cardDialog = document.querySelector("#card-dialog");
  const cardDialogImage = document.querySelector("#card-dialog-image");
  const cardDialogTitle = document.querySelector("#card-dialog-title");
  const cardDialogNumber = document.querySelector("#card-dialog-number");
  const cardDialogClose = document.querySelector("#card-dialog-close");
  const cardDialogPrevious = document.querySelector("#card-dialog-prev");
  const cardDialogNext = document.querySelector("#card-dialog-next");
  const canHover = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

  const cardTitles = [
    "FORTUNE ARRIVAL",
    "PINK CEREMONY",
    "COURT ENERGY",
    "RED MEMORY",
    "STRIPE PARADE",
    "WHITE MOMENT",
    "BUBBLE SIGNAL",
    "HEART SIGNAL",
    "ANCIENT MOOD",
    "CLASS IN SESSION",
  ];

  const galleryPresentationProfiles = [
    { id: "altar", accent: "#d8b75f", surface: "rgba(12,10,8,.84)", clip: "polygon(12% 0,88% 0,100% 10%,100% 100%,0 100%,0 10%)", reveal: "polygon(50% 0,50% 0,50% 10%,50% 100%,50% 100%,50% 10%)", revealBack: "polygon(12% 50%,88% 50%,100% 50%,100% 50%,0 50%,0 50%)", radius: 18, depth: 48, scale: 1.02, rotation: -1.5, vertical: -8, tilt: 5.5, frameRotate: "-1deg", imageScale: 1.018 },
    { id: "medallion", accent: "#c6a34e", surface: "rgba(19,15,8,.84)", clip: "circle(50% at 50% 50%)", reveal: "circle(0% at 50% 50%)", revealBack: "circle(0% at 50% 50%)", radius: -12, depth: 8, scale: .94, rotation: 1, vertical: 10, tilt: 7, frameRotate: "1deg", imageScale: 1.04 },
    { id: "arch-window", accent: "#9ed4d7", surface: "rgba(12,28,31,.84)", clip: "inset(0 round 126px 126px 8px 8px)", reveal: "inset(100% 0 0 0 round 126px 126px 8px 8px)", revealBack: "inset(0 0 100% 0 round 126px 126px 8px 8px)", radius: 28, depth: 26, scale: .98, rotation: -1, vertical: -4, tilt: 6, frameRotate: "1.2deg", imageScale: 1.03 },
    { id: "polaroid", accent: "#ef5d45", surface: "rgba(24,19,16,.84)", clip: "polygon(3% 0,100% 3%,97% 100%,0 96%)", reveal: "polygon(3% 0,3% 0,0 96%,0 96%)", revealBack: "polygon(100% 3%,100% 3%,97% 100%,97% 100%)", radius: -18, depth: 64, scale: 1.04, rotation: 1.4, vertical: -12, tilt: 5, frameRotate: "-2.4deg", imageScale: 1.025 },
    { id: "burst-badge", accent: "#ef573c", surface: "rgba(35,13,9,.84)", clip: "polygon(50% 0,59% 14%,74% 5%,78% 22%,96% 19%,87% 35%,100% 50%,84% 58%,94% 76%,76% 78%,75% 97%,58% 86%,50% 100%,41% 85%,24% 96%,22% 78%,3% 76%,14% 59%,0 50%,16% 41%,5% 24%,24% 22%,25% 4%,42% 14%)", reveal: "polygon(50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%)", revealBack: "polygon(50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%)", radius: 36, depth: 32, scale: .96, rotation: -2, vertical: 8, tilt: 7.5, frameRotate: "2deg", imageScale: 1.05 },
    { id: "film-strip", accent: "#f3efe2", surface: "rgba(8,8,9,.86)", clip: "inset(0 round 2px)", reveal: "inset(48% 0 48% 0 round 2px)", revealBack: "inset(0 48% 0 48% round 2px)", radius: -24, depth: 18, scale: .98, rotation: .8, vertical: 5, tilt: 4.5, frameRotate: "-1deg", imageScale: 1.035 },
    { id: "battle-standard", accent: "#d6b35c", surface: "rgba(24,17,8,.86)", clip: "polygon(0 0,100% 0,100% 92%,70% 100%,50% 92%,30% 100%,0 92%)", reveal: "polygon(0 0,100% 0,100% 0,70% 0,50% 0,30% 0,0 0)", revealBack: "polygon(0 100%,100% 100%,100% 100%,70% 100%,50% 100%,30% 100%,0 100%)", radius: 12, depth: 56, scale: 1.02, rotation: -1.2, vertical: -8, tilt: 5.5, frameRotate: ".8deg", imageScale: 1.02 },
    { id: "racing-ticket", accent: "#7fc5dd", surface: "rgba(11,28,43,.84)", clip: "polygon(4% 0,96% 0,100% 10%,96% 20%,100% 30%,96% 40%,100% 50%,96% 60%,100% 70%,96% 80%,100% 90%,96% 100%,4% 100%,0 90%,4% 80%,0 70%,4% 60%,0 50%,4% 40%,0 30%,4% 20%,0 10%)", reveal: "polygon(4% 0,4% 0,4% 10%,4% 20%,4% 30%,4% 40%,4% 50%,4% 60%,4% 70%,4% 80%,4% 90%,4% 100%,4% 100%,4% 90%,4% 80%,4% 70%,4% 60%,4% 50%,4% 40%,4% 30%,4% 20%,4% 10%)", revealBack: "polygon(96% 0,96% 0,96% 10%,96% 20%,96% 30%,96% 40%,96% 50%,96% 60%,96% 70%,96% 80%,96% 90%,96% 100%,96% 100%,96% 90%,96% 80%,96% 70%,96% 60%,96% 50%,96% 40%,96% 30%,96% 20%,96% 10%)", radius: -30, depth: 10, scale: .96, rotation: 1.4, vertical: 10, tilt: 4.5, frameRotate: "1deg", imageScale: 1.03 },
    { id: "portal", accent: "#78d7c8", surface: "rgba(6,25,24,.86)", clip: "ellipse(50% 50% at 50% 50%)", reveal: "ellipse(0% 50% at 50% 50%)", revealBack: "ellipse(50% 0% at 50% 50%)", radius: 26, depth: 38, scale: .98, rotation: -1, vertical: 0, tilt: 7, frameRotate: "-1deg", imageScale: 1.04 },
    { id: "tabloid", accent: "#65d9e4", surface: "rgba(50,8,15,.88)", clip: "polygon(2% 0,100% 3%,97% 100%,0 96%)", reveal: "polygon(2% 0,2% 0,0 96%,0 96%)", revealBack: "polygon(100% 3%,100% 3%,97% 100%,97% 100%)", radius: -14, depth: 68, scale: 1.04, rotation: 1.8, vertical: -8, tilt: 5.5, frameRotate: "-1.5deg", imageScale: 1.02 },
    { id: "stone-plinth", accent: "#b9c0be", surface: "rgba(27,31,31,.86)", clip: "polygon(4% 0,96% 0,100% 94%,84% 100%,16% 100%,0 94%)", reveal: "polygon(4% 100%,96% 100%,100% 100%,84% 100%,16% 100%,0 100%)", revealBack: "polygon(4% 0,96% 0,100% 0,84% 0,16% 0,0 0)", radius: 30, depth: 26, scale: .98, rotation: -1.2, vertical: 2, tilt: 5, frameRotate: ".6deg", imageScale: 1.035 },
    { id: "ivory-sculpture", accent: "#f3eee0", surface: "rgba(35,31,25,.82)", clip: "ellipse(50% 54% at 50% 50%)", reveal: "ellipse(0% 54% at 50% 50%)", revealBack: "ellipse(50% 0% at 50% 50%)", radius: -34, depth: 50, scale: 1.03, rotation: 1, vertical: -6, tilt: 4.5, frameRotate: "1deg", imageScale: 1.012 },
    { id: "sun-dial", accent: "#efb638", surface: "rgba(55,20,12,.86)", clip: "circle(50% at 50% 50%)", reveal: "circle(0% at 50% 50%)", revealBack: "circle(0% at 50% 50%)", radius: 22, depth: 14, scale: .96, rotation: -1.5, vertical: 8, tilt: 7, frameRotate: "-1deg", imageScale: 1.05 },
    { id: "fight-bill", accent: "#bd93f2", surface: "rgba(25,13,36,.88)", clip: "polygon(12% 0,88% 0,100% 9%,100% 91%,88% 100%,12% 100%,0 91%,0 9%)", reveal: "polygon(50% 0,50% 0,50% 9%,50% 91%,50% 100%,50% 100%,50% 91%,50% 9%)", revealBack: "polygon(12% 50%,88% 50%,100% 50%,100% 50%,88% 50%,12% 50%,0 50%,0 50%)", radius: 8, depth: 58, scale: 1.02, rotation: 1.5, vertical: -10, tilt: 6.5, frameRotate: "-1deg", imageScale: 1.02 },
    { id: "bubble-lens", accent: "#9ceaf2", surface: "rgba(8,35,43,.82)", clip: "circle(50% at 50% 50%)", reveal: "circle(0% at 32% 24%)", revealBack: "circle(0% at 68% 76%)", radius: -18, depth: 34, scale: .96, rotation: -1, vertical: 8, tilt: 8, frameRotate: "1deg", imageScale: 1.045 },
    { id: "dossier", accent: "#8b1c2c", surface: "rgba(38,31,18,.88)", clip: "polygon(0 7%,42% 7%,49% 0,100% 0,100% 100%,0 100%)", reveal: "polygon(0 7%,0 7%,0 0,0 0,0 100%,0 100%)", revealBack: "polygon(100% 7%,100% 7%,100% 0,100% 0,100% 100%,100% 100%)", radius: 32, depth: 46, scale: 1.01, rotation: -1.4, vertical: -3, tilt: 5, frameRotate: "1.2deg", imageScale: 1.018 },
    { id: "microfiche", accent: "#7dffb7", surface: "rgba(4,24,14,.88)", clip: "inset(0)", reveal: "inset(0 100% 0 0)", revealBack: "inset(0 0 0 100%)", radius: -28, depth: 10, scale: .96, rotation: 1.2, vertical: 9, tilt: 4, frameRotate: "-.8deg", imageScale: 1.04 },
    { id: "fabric-swatch", accent: "#287a45", surface: "rgba(37,31,7,.86)", clip: "polygon(0 0,100% 0,100% 94%,92% 100%,82% 95%,72% 100%,62% 95%,52% 100%,42% 95%,32% 100%,22% 95%,12% 100%,0 94%)", reveal: "polygon(0 0,100% 0,100% 0,92% 0,82% 0,72% 0,62% 0,52% 0,42% 0,32% 0,22% 0,12% 0,0 0)", revealBack: "polygon(0 100%,100% 100%,100% 100%,92% 100%,82% 100%,72% 100%,62% 100%,52% 100%,42% 100%,32% 100%,22% 100%,12% 100%,0 100%)", radius: 12, depth: 62, scale: 1.03, rotation: -1, vertical: -8, tilt: 5.5, frameRotate: ".8deg", imageScale: 1.025 },
    { id: "chrome-seal", accent: "#d8e5e8", surface: "rgba(18,23,25,.88)", clip: "circle(50% at 50% 50%)", reveal: "circle(0% at 50% 50%)", revealBack: "circle(0% at 50% 50%)", radius: -20, depth: 28, scale: .97, rotation: 1.5, vertical: 4, tilt: 7.5, frameRotate: "-1deg", imageScale: 1.04 },
    { id: "credential", accent: "#86bfe5", surface: "rgba(12,25,45,.88)", clip: "inset(0 round 8px)", reveal: "inset(100% 0 0 0 round 8px)", revealBack: "inset(0 0 100% 0 round 8px)", radius: 24, depth: 54, scale: 1.01, rotation: -1.2, vertical: -6, tilt: 5.5, frameRotate: ".8deg", imageScale: 1.018 },
    { id: "hanging-banner", accent: "#d0a64d", surface: "rgba(47,20,16,.88)", clip: "polygon(0 0,100% 0,100% 88%,72% 100%,50% 91%,28% 100%,0 88%)", reveal: "polygon(0 0,100% 0,100% 0,72% 0,50% 0,28% 0,0 0)", revealBack: "polygon(0 100%,100% 100%,100% 100%,72% 100%,50% 100%,28% 100%,0 100%)", radius: -8, depth: 40, scale: .99, rotation: 1, vertical: 2, tilt: 6, frameRotate: "-1deg", imageScale: 1.03 },
  ];

  let selectedCardIndex = -1;
  let lastPointerX = window.innerWidth / 2;
  let lastPointerY = window.innerHeight / 2;
  let activeChapterIndex = -1;
  let lastRailProgress = Number.NaN;
  const galleryState = {
    activeIndex: -1,
    position: 0,
    scrollTarget: 0,
    dragOffset: 0,
    velocity: 0,
    dragging: false,
    dragDistance: 0,
    pointerId: null,
    lastX: 0,
    lastMoveTime: 0,
    lastScrollTime: 0,
    lastScrollTarget: 0,
    frame: 0,
    detailCard: null,
    returnRect: null,
    returnRotation: 0,
    suppressClick: false,
    chapter: -1,
    themeAnimation: null,
    themeTimer: 0,
    revealAnimations: [],
    lastRevealedIndex: -1,
    geometry: null,
    warmedImages: new Set(),
    decodeQueue: new Set(),
    decodeTimer: 0,
  };

  const galleryUnlocked = !galleryEntryAction || prefersReducedMotion;
  if (galleryStage && !galleryUnlocked) galleryStage.dataset.galleryLocked = "true";

  function unlockGallery() {
    if (!galleryStage || galleryEntry?.classList.contains("is-leaving")) return;
    galleryEntry?.classList.add("is-leaving");
    galleryEntryAction?.setAttribute("aria-busy", "true");
    window.setTimeout(() => {
      galleryStage.removeAttribute("data-gallery-locked");
      galleryStage.setAttribute("aria-busy", "false");
      galleryEntry?.classList.add("is-gone");
      galleryEntryAction?.removeAttribute("aria-busy");
      galleryViewport?.focus({ preventScroll: true });
      requestGalleryFrame();
    }, prefersReducedMotion ? 0 : 760);
  }

  galleryEntryAction?.addEventListener("click", unlockGallery);
  galleryEntryAction?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      unlockGallery();
    }
  });

  const galleryChapterQuotes = [
    "可是我觉得很神圣啊",
    "这期真的有教育意义",
    "万变不离其宗",
  ];
  const galleryDetailProfiles = [
    { title: "SACRED LAUGH", quote: "可是我觉得很神圣啊", body: "黑白蝴蝶结把笑意收进一场庄重的登场，细节越克制，角色越有记忆点。", tags: ["黑白礼服", "蝴蝶结", "仪式感"] },
    { title: "DOG / 02", quote: "先把忠诚戴在脸上", body: "黄色皮肤与垂耳轮廓形成柔软的纵向节奏，像一枚会跟着观众移动的图腾。", tags: ["垂耳", "暖黄", "图腾"] },
    { title: "RABBIT / 03", quote: "可爱也可以很有秩序", body: "长耳朵拉高画面重心，圆润身体压住下半部，整张图靠比例制造轻盈感。", tags: ["长耳", "圆体", "轻盈"] },
    { title: "CLOSE ENOUGH", quote: "靠近一点，故事才开始", body: "拥抱动作把两个角色锁在同一个视觉焦点里，红色场地让关系变得直接而热烈。", tags: ["拥抱", "红场", "关系"] },
    { title: "TIGER / 05", quote: "勇气先从条纹开始", body: "虎纹造型把奶龙的黄色轮廓切成有力的明暗段落，像一件可以穿上的勇气。", tags: ["虎纹", "力量", "明暗"] },
    { title: "MONKEY / 06", quote: "玩心是最好的动作指导", body: "猴耳与夸张表情制造跳跃感，画面没有静止的角落，视线会被自然带向脸部。", tags: ["猴耳", "表情", "跳跃"] },
    { title: "GOLDEN RIDE", quote: "把风也带进镜头里", body: "金甲、长刀和坐骑形成一条斜向动线，像从画框外冲进来的高光瞬间。", tags: ["金甲", "长刀", "动线"] },
    { title: "HORSE / 08", quote: "快一点，再快一点", body: "马头轮廓把角色向前推，黄色主体和深色背景之间留下清晰的速度边界。", tags: ["马首", "速度", "前进"] },
    { title: "SNAKE / 09", quote: "柔软也能保持锋利", body: "蛇形装饰以曲线包住身体轮廓，让柔和的奶龙拥有一层带方向感的危险气质。", tags: ["曲线", "蛇形", "锋利"] },
    { title: "LOUD LESSON", quote: "这期真的有教育意义", body: "红色海报语法把角色推到舞台中心，像一张大声宣布主题的街头招贴。", tags: ["红海报", "舞台", "宣言"] },
    { title: "OX / 11", quote: "稳住，才有下一步", body: "牛角向两侧展开，形成稳定的横向结构，画面重心因此更沉、更可靠。", tags: ["牛角", "稳重", "横向"] },
    { title: "PURE JOY", quote: "笑容不需要解释", body: "白色长裙放大了身体的摆动幅度，双手抱腹的姿态把快乐变成一个完整形状。", tags: ["白裙", "大笑", "纯粹"] },
    { title: "ROOSTER / 13", quote: "清晨的第一声信号", body: "鸡冠和喙部提供清晰的尖角节拍，在柔软的黄色身体上敲出醒目的节奏。", tags: ["鸡冠", "信号", "节拍"] },
    { title: "RING READY", quote: "上场之前先听见自己", body: "运动服与交叉手臂形成准备出击的姿态，紫色让整张图保留一丝竞技场的冷光。", tags: ["运动服", "紫色", "竞技"] },
    { title: "PIG / 15", quote: "圆满不是停下来", body: "猪耳和圆鼻让头像成为柔软的圆形符号，粉色气质把章节推向轻松的一拍。", tags: ["圆鼻", "粉色", "松弛"] },
    { title: "BACK TO ROOT", quote: "回到最初，反而更强", body: "牛仔帽与黑色西装压低了色彩，保留脸部与姿态的核心，让角色回到原点。", tags: ["牛仔帽", "黑西装", "原点"] },
    { title: "RAT / 17", quote: "小体量也有大叙事", body: "尖耳和细长胡须改变了面部比例，微小的变化让熟悉的奶龙获得全新的身份。", tags: ["尖耳", "胡须", "身份"] },
    { title: "IN THE DETAILS", quote: "真正的高光藏在边角", body: "绿色圆环与刺绣细节形成近距离的观看理由，越靠近越能发现角色的表情层次。", tags: ["绿环", "刺绣", "近景"] },
    { title: "DRAGON / 19", quote: "回到最原始的想象", body: "龙角把奶龙的本体性格直接提出来，黄色、绿色和轮廓线共同完成一次回望。", tags: ["龙角", "本体", "回望"] },
    { title: "KEEP THE ORDER", quote: "秩序让热闹更有力量", body: "蓝色制服、交叉手臂和正面站姿建立规则感，角色像在画面里守住最后一道边界。", tags: ["制服", "蓝调", "边界"] },
    { title: "GOAT / 21", quote: "最后一格，仍然向上", body: "山羊角把轮廓往上抬，章节在一个轻微仰望的姿势里收束，却没有真正结束。", tags: ["山羊角", "仰望", "收束"] },
  ];
  const galleryIntroProgress = .022;
  const galleryOutroProgress = .012;
  const chapterTargets = chapterLinks.map((link) => document.querySelector(link.getAttribute("href")));
  const overdriveLayoutCache = new WeakMap();
  const overdriveElements = [...new Set([
    prologScene,
    galleryScene,
    encoreScene,
    ...chapterTargets,
  ].filter(Boolean))];
  let overdriveDocumentTravel = 1;

  function measureOverdriveElement(element) {
    const bounds = element.getBoundingClientRect();
    const metrics = {
      top: bounds.top + window.scrollY,
      left: bounds.left + window.scrollX,
      width: bounds.width,
      height: bounds.height,
    };
    overdriveLayoutCache.set(element, metrics);
    return metrics;
  }

  function refreshOverdriveLayouts() {
    overdriveElements.forEach(measureOverdriveElement);
    overdriveDocumentTravel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    galleryState.geometry = null;
  }

  function getOverdriveBounds(element, scrollY = window.scrollY, scrollX = window.scrollX) {
    const metrics = overdriveLayoutCache.get(element) || measureOverdriveElement(element);
    const top = metrics.top - scrollY;
    const left = metrics.left - scrollX;
    return {
      top,
      bottom: top + metrics.height,
      left,
      right: left + metrics.width,
      width: metrics.width,
      height: metrics.height,
    };
  }

  galleryCards.forEach((card, index) => {
    const profile = galleryPresentationProfiles[index] || galleryPresentationProfiles[0];
    card.dataset.presentation = profile.id;
    card.style.setProperty("--frame-clip", profile.clip);
    card.style.setProperty("--frame-rotate", profile.frameRotate || "0deg");
    card.style.setProperty("--presentation-accent", profile.accent);
    card.style.setProperty("--image-scale", `${profile.imageScale || 1.035}`);
  });

  function queueGalleryDecode(image) {
    if (!image || galleryState.decodeQueue.has(image)) return;
    galleryState.decodeQueue.add(image);
    if (galleryState.decodeTimer) return;

    const flush = () => {
      galleryState.decodeTimer = 0;
      if (document.hidden || performance.now() - galleryState.lastScrollTime < 260) {
        galleryState.decodeTimer = window.setTimeout(flush, 280);
        return;
      }
      const nextImage = galleryState.decodeQueue.values().next().value;
      if (!nextImage) return;
      galleryState.decodeQueue.delete(nextImage);
      nextImage.decode?.().catch(() => undefined);
      if (galleryState.decodeQueue.size) {
        galleryState.decodeTimer = window.setTimeout(flush, 90);
      }
    };

    galleryState.decodeTimer = window.setTimeout(flush, 280);
  }

  function warmGalleryImage(index, priority = "auto") {
    const card = galleryCards[index];
    const image = card?.querySelector("img");
    if (!card || !image) return;

    card.dataset.galleryWarmed = "true";
    image.loading = "eager";
    image.fetchPriority = priority;
    if (galleryState.warmedImages.has(image)) return;

    galleryState.warmedImages.add(image);
    const decodeImage = () => queueGalleryDecode(image);
    if (image.complete && image.naturalWidth > 0) {
      decodeImage();
    } else {
      image.addEventListener("load", decodeImage, { once: true });
    }
  }

  function warmGalleryNeighborhood(index) {
    [index, index + 1, index - 1].forEach((cardIndex, order) => {
      if (cardIndex < 0 || cardIndex >= galleryCards.length) return;
      warmGalleryImage(cardIndex, order === 0 ? "high" : "auto");
    });
  }

  if (transitionGrid) {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 12; index += 1) {
      const column = document.createElement("span");
      column.style.setProperty("--column", `${index}`);
      fragment.append(column);
    }
    transitionGrid.append(fragment);
  }

  function getBoundsProgress(bounds, viewportHeight = window.innerHeight) {
    const travel = Math.max(1, bounds.height - viewportHeight);
    return clamp(-bounds.top / travel, 0, 1);
  }

  function isNearViewport(bounds, viewportHeight = window.innerHeight, margin = viewportHeight * 0.3) {
    return bounds.bottom >= -margin && bounds.top <= viewportHeight + margin;
  }

  function setActiveChapter(scrollY, viewportHeight) {
    const marker = scrollY + viewportHeight * 0.46;
    let activeIndex = 0;
    chapterTargets.forEach((target, index) => {
      const metrics = target && overdriveLayoutCache.get(target);
      if (metrics && metrics.top <= marker) activeIndex = index;
    });
    if (activeIndex === activeChapterIndex) return;
    activeChapterIndex = activeIndex;
    chapterLinks.forEach((link, index) => link.classList.toggle("is-active", index === activeIndex));
  }

  function getGalleryChapter(index) {
    if (index >= 14) return 2;
    if (index >= 7) return 1;
    return 0;
  }

  function getGalleryGeometry() {
    if (galleryState.geometry) return galleryState.geometry;

    const width = galleryViewport?.clientWidth || window.innerWidth;
    const height = galleryViewport?.clientHeight || window.innerHeight;
    const radius = clamp(Math.min(width * 0.49, height * 0.82), 520, 760);
    const geometry = {
      width,
      height,
      radius,
      centerX: width * 0.62,
      centerY: height * 0.54 + radius,
      slotAngle: width >= 1700 ? 12.8 : 13.8,
    };
    galleryState.geometry = geometry;
    galleryStage?.style.setProperty("--orbit-radius", `${geometry.radius}px`);
    galleryStage?.style.setProperty("--orbit-center-x", `${geometry.centerX}px`);
    galleryStage?.style.setProperty("--orbit-center-y", `${geometry.centerY}px`);
    return geometry;
  }

  function setGalleryTheme(chapter, direction) {
    if (!galleryStage || chapter === galleryState.chapter) return;
    const themes = [
      { id: "ink", curtain: "#09090b" },
      { id: "signal", curtain: "#b80f32" },
      { id: "ivory", curtain: "#efede6" },
    ];
    const theme = themes[chapter] || themes[0];
    const previousChapter = galleryState.chapter;
    galleryState.chapter = chapter;

    if (previousChapter < 0 || prefersReducedMotion || !galleryCurtain) {
      galleryStage.dataset.galleryTheme = theme.id;
      return;
    }

    galleryState.themeAnimation?.cancel();
    window.clearTimeout(galleryState.themeTimer);
    galleryCurtain.style.setProperty("--gallery-curtain-color", theme.curtain);
    const enterClip = direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
    const exitClip = direction > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
    const animation = galleryCurtain.animate([
      { clipPath: enterClip, offset: 0 },
      { clipPath: "inset(0)", offset: .42 },
      { clipPath: "inset(0)", offset: .58 },
      { clipPath: exitClip, offset: 1 },
    ], { duration: 680, easing: "cubic-bezier(.76,0,.24,1)" });
    galleryState.themeAnimation = animation;
    galleryState.themeTimer = window.setTimeout(() => {
      galleryStage.dataset.galleryTheme = theme.id;
    }, 285);
    animation.onfinish = () => {
      if (galleryState.themeAnimation === animation) galleryState.themeAnimation = null;
    };
  }

  function updateGalleryInterface(index) {
    if (!galleryCards.length || index === galleryState.activeIndex) return;
    const previousIndex = galleryState.activeIndex;
    const direction = previousIndex < 0 || index >= previousIndex ? 1 : -1;
    const chapter = getGalleryChapter(index);
    galleryState.activeIndex = index;
    warmGalleryNeighborhood(index);

    if (galleryCurrent) galleryCurrent.textContent = String(index + 1).padStart(2, "0");
    setGalleryTheme(chapter, direction);
    galleryQuotes.forEach((quote, quoteIndex) => quote.classList.toggle("is-active", quoteIndex === chapter));
    galleryTabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === chapter;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    galleryCards.forEach((card, cardIndex) => {
      const active = cardIndex === index;
      card.classList.toggle("is-active", active);
      card.tabIndex = active ? 0 : -1;
    });

    if (galleryPrevious) galleryPrevious.disabled = index <= 0;
    if (galleryNext) galleryNext.disabled = index >= galleryCards.length - 1;

  }

  function revealGalleryCard(index) {
    if (
      prefersReducedMotion ||
      galleryState.dragging ||
      index < 0 ||
      index === galleryState.lastRevealedIndex
    ) {
      return;
    }

    const previousIndex = galleryState.lastRevealedIndex;
    const direction = previousIndex < 0 || index >= previousIndex ? 1 : -1;
    const activeFrame = galleryFrames[index];
    const activeImage = galleryCards[index]?.querySelector("img");
    galleryState.revealAnimations.forEach((animation) => animation.cancel());
    galleryState.revealAnimations = [];
    galleryState.lastRevealedIndex = index;
    if (!activeFrame || !activeImage || previousIndex < 0) return;

    const profile = galleryPresentationProfiles[index] || galleryPresentationProfiles[0];
    const imageScale = profile.imageScale || 1.035;
    const frameAnimation = activeFrame.animate([
      { clipPath: direction > 0 ? profile.reveal : profile.revealBack || profile.reveal },
      { clipPath: profile.clip },
    ], { duration: 700, easing: "cubic-bezier(.16,1,.3,1)" });
    const imageAnimation = activeImage.animate([
      { transform: `scale(${imageScale + 0.14})` },
      { transform: `scale(${imageScale})` },
    ], { duration: 760, easing: "cubic-bezier(.16,1,.3,1)" });
    galleryState.revealAnimations = [frameAnimation, imageAnimation];
  }

  function requestGalleryFrame() {
    if (galleryState.frame || document.hidden || !galleryViewport || !galleryCards.length) return;
    galleryState.frame = requestAnimationFrame(renderGalleryFrame);
  }

  function renderGalleryFrame() {
    galleryState.frame = 0;
    if (!galleryViewport || !galleryCards.length) return;

    const maximumIndex = galleryCards.length - 1;
    const now = performance.now();
    if (!galleryState.dragging && Math.abs(galleryState.velocity) > 0.0005) {
      galleryState.dragOffset += galleryState.velocity;
      galleryState.velocity *= 0.89;
    }

    let target = clamp(galleryState.scrollTarget + galleryState.dragOffset, 0, maximumIndex);
    const scrollIdle = now - galleryState.lastScrollTime > 170;
    if (!galleryState.dragging && scrollIdle && Math.abs(galleryState.velocity) < 0.018) {
      const snappedTarget = Math.round(target);
      galleryState.dragOffset += (snappedTarget - target) * 0.075;
      target = clamp(galleryState.scrollTarget + galleryState.dragOffset, 0, maximumIndex);
    }

    const follow = prefersReducedMotion ? 1 : galleryState.dragging ? 0.28 : 0.16;
    galleryState.position += (target - galleryState.position) * follow;
    if (Math.abs(target - galleryState.position) < 0.0008) galleryState.position = target;

    const { radius, centerX, centerY, slotAngle } = getGalleryGeometry();
    const motionLean = prefersReducedMotion
      ? 0
      : clamp((target - galleryState.position) * 3.4 + galleryState.velocity * 4.8, -2.8, 2.8);

    galleryCards.forEach((card, index) => {
      if (galleryState.detailCard === card) return;
      const profile = galleryPresentationProfiles[index] || galleryPresentationProfiles[0];
      const offset = index - galleryState.position;
      const distance = Math.abs(offset);
      const shouldRender = distance <= 4.45;
      const renderState = shouldRender ? "1" : "0";
      if (card.dataset.orbitRendered !== renderState) {
        card.dataset.orbitRendered = renderState;
        card.style.display = shouldRender ? "block" : "none";
      }
      if (!shouldRender) {
        card.style.pointerEvents = "none";
        return;
      }
      const angle = -90 + offset * slotAngle;
      const radians = angle * Math.PI / 180;
      const localRadius = radius + profile.radius;
      const x = centerX + Math.cos(radians) * localRadius;
      const y = centerY + Math.sin(radians) * localRadius + profile.vertical;
      const scale = clamp((1.08 - distance * 0.066) * profile.scale, 0.52, 1.12);
      const opacity = clamp(1.08 - Math.max(0, distance - 2.4) * 0.54, 0, 1);
      const rotation = angle + 90 + profile.rotation;
      const depthFalloff = 1 - clamp(distance / 4.5, 0, 1);
      const depth = profile.depth * depthFalloff - distance * 4;
      const focus = clamp(1 - distance / 3.35, 0, 1);
      const cardLean = motionLean * (.45 + depthFalloff * .55);

      card.style.transform = `translate3d(${x}px, ${y}px, ${depth}px) translate(-50%, -50%) rotate(${rotation}deg) rotateY(${cardLean}deg) scale(${scale})`;
      card.style.opacity = `${opacity}`;
      card.style.zIndex = `${Math.max(1, 100 - Math.round(distance * 8))}`;
      card.style.pointerEvents = distance <= .62 ? "auto" : "none";
      card.style.setProperty("--orbit-focus", `${focus}`);
      card.style.setProperty("--orbit-saturation", `${.74 + focus * .26}`);
      card.style.setProperty("--orbit-contrast", `${.94 + focus * .06}`);
      card.style.setProperty("--orbit-meta-opacity", `${.5 + focus * .5}`);
      card.dataset.orbitRotation = `${rotation}`;
    });

    const activeIndex = clamp(Math.round(galleryState.position), 0, maximumIndex);
    updateGalleryInterface(activeIndex);
    if (
      scrollIdle &&
      !galleryState.dragging &&
      Math.abs(target - galleryState.position) < 0.035
    ) {
      revealGalleryCard(activeIndex);
    }

    const moving = galleryState.dragging
      || Math.abs(target - galleryState.position) > 0.001
      || Math.abs(galleryState.velocity) > 0.001;
    if (moving) requestGalleryFrame();
  }

  function setGalleryScrollProgress(progress) {
    if (!galleryCards.length) return;
    const orbitProgress = clamp((progress - galleryIntroProgress) / (1 - galleryIntroProgress - galleryOutroProgress));
    const nextTarget = orbitProgress * (galleryCards.length - 1);
    if (Math.abs(nextTarget - galleryState.lastScrollTarget) > 0.0001) {
      galleryState.lastScrollTarget = nextTarget;
      galleryState.lastScrollTime = performance.now();
    }
    galleryState.scrollTarget = nextTarget;
    galleryStage?.style.setProperty("--gallery-reveal", `${clamp(progress / 0.018)}`);
    galleryStage?.style.setProperty("--gallery-progress", `${progress}`);
    galleryStage?.style.setProperty("--gallery-parallax-x", `${(lastPointerX / Math.max(1, window.innerWidth) - 0.5) * 30}`);
    galleryStage?.style.setProperty("--gallery-parallax-y", `${(progress - 0.5) * 92}`);
    requestGalleryFrame();
  }

  function goToGalleryIndex(index) {
    if (!galleryScene || !galleryCards.length) return;
    const nextIndex = clamp(index, 0, galleryCards.length - 1);
    warmGalleryNeighborhood(nextIndex);
    const travel = Math.max(1, galleryScene.offsetHeight - window.innerHeight);
    galleryState.dragOffset = 0;
    galleryState.velocity = 0;
    const orbitProgress = nextIndex / Math.max(1, galleryCards.length - 1);
    const sceneProgress = galleryIntroProgress + orbitProgress * (1 - galleryIntroProgress - galleryOutroProgress);
    window.scrollTo({
      top: galleryScene.offsetTop + travel * sceneProgress,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  function waitForGalleryLayout() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  async function openGalleryDetail(card) {
    if (!card || !galleryDetail || !galleryDetailMedia || galleryState.detailCard || galleryState.suppressClick) return;
    const index = Number(card.dataset.orbitIndex || 0);
    const chapter = getGalleryChapter(index);
    const profile = galleryPresentationProfiles[index] || galleryPresentationProfiles[0];
    const detailProfile = galleryDetailProfiles[index] || galleryDetailProfiles[0];
    const firstRect = card.getBoundingClientRect();
    galleryState.detailCard = card;
    galleryState.returnRect = firstRect;
    galleryState.returnRotation = Number(card.dataset.orbitRotation || 0);

    if (galleryDetailNumber) galleryDetailNumber.textContent = `${String(index + 1).padStart(2, "0")} / ${galleryCards.length}`;
    if (galleryDetailTitle) galleryDetailTitle.textContent = detailProfile.title || card.dataset.orbitTitle || "TWENTY ONE FORMS";
    if (galleryDetailQuote) galleryDetailQuote.textContent = detailProfile.quote || galleryChapterQuotes[chapter];
    if (galleryDetailBody) galleryDetailBody.textContent = detailProfile.body || "";
    if (galleryDetailTags) {
      galleryDetailTags.replaceChildren(...(detailProfile.tags || []).map((tag) => {
        const element = document.createElement("span");
        element.textContent = tag;
        return element;
      }));
    }
    galleryDetail.dataset.presentation = profile.id;
    galleryDetail.style.setProperty("--detail-accent", profile.accent);
    galleryDetail.style.setProperty("--detail-surface", profile.surface);

    galleryDetail.classList.add("is-open");
    galleryDetail.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-detail-open");
    card.classList.add("is-detail");
    card.style.setProperty("--card-tilt-x", "0deg");
    card.style.setProperty("--card-tilt-y", "0deg");
    card.style.removeProperty("transform");
    card.style.opacity = "1";
    card.style.zIndex = "1";
    card.style.pointerEvents = "none";
    galleryDetailMedia.append(card);

    await waitForGalleryLayout();
    const lastRect = card.getBoundingClientRect();
    const deltaX = firstRect.left + firstRect.width / 2 - (lastRect.left + lastRect.width / 2);
    const deltaY = firstRect.top + firstRect.height / 2 - (lastRect.top + lastRect.height / 2);
    const scaleX = firstRect.width / Math.max(1, lastRect.width);
    const scaleY = firstRect.height / Math.max(1, lastRect.height);
    if (!prefersReducedMotion) {
      const animation = card.animate([
        { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) rotate(${galleryState.returnRotation}deg) scale(${scaleX}, ${scaleY})` },
        { transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)" },
      ], { duration: 780, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
      await animation.finished.catch(() => undefined);
      animation.cancel();
    }
    galleryDetail.querySelector(".gallery-detail__close")?.focus({ preventScroll: true });
  }

  async function closeGalleryDetail() {
    const card = galleryState.detailCard;
    const returnRect = galleryState.returnRect;
    if (!card || !galleryDetail || !galleryTrack || !returnRect) return;
    const firstRect = card.getBoundingClientRect();
    const deltaX = returnRect.left + returnRect.width / 2 - (firstRect.left + firstRect.width / 2);
    const deltaY = returnRect.top + returnRect.height / 2 - (firstRect.top + firstRect.height / 2);
    const scaleX = returnRect.width / Math.max(1, firstRect.width);
    const scaleY = returnRect.height / Math.max(1, firstRect.height);

    if (!prefersReducedMotion) {
      const animation = card.animate([
        { transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)" },
        { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) rotate(${galleryState.returnRotation}deg) scale(${scaleX}, ${scaleY})` },
      ], { duration: 680, easing: "cubic-bezier(.7,0,.3,1)", fill: "both" });
      await animation.finished.catch(() => undefined);
      animation.cancel();
    }

    galleryTrack.append(card);
    card.classList.remove("is-detail");
    card.style.removeProperty("transform");
    card.style.removeProperty("opacity");
    card.style.removeProperty("z-index");
    card.style.removeProperty("pointer-events");
    galleryDetail.classList.remove("is-open");
    galleryDetail.setAttribute("aria-hidden", "true");
    delete galleryDetail.dataset.presentation;
    document.body.classList.remove("gallery-detail-open");
    galleryState.detailCard = null;
    galleryState.returnRect = null;
    requestGalleryFrame();
    card.focus({ preventScroll: true });
  }

  function renderOverdrive(_frameStamp, scrollPosition = window.scrollY) {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollY = Number.isFinite(scrollPosition) ? scrollPosition : window.scrollY;
    const scrollX = window.scrollX;
    const prologBounds = prologScene ? getOverdriveBounds(prologScene, scrollY, scrollX) : null;
    const galleryBounds = galleryScene ? getOverdriveBounds(galleryScene, scrollY, scrollX) : null;
    const encoreBounds = encoreScene ? getOverdriveBounds(encoreScene, scrollY, scrollX) : null;
    const railProgress = clamp(scrollY / overdriveDocumentTravel);
    if (Math.abs(railProgress - lastRailProgress) > 0.0001) {
      lastRailProgress = railProgress;
      root.style.setProperty("--rail-progress", `${railProgress}`);
    }
    setActiveChapter(scrollY, viewportHeight);

    if (prologBounds && prologStage && isNearViewport(prologBounds, viewportHeight)) {
      const progress = getBoundsProgress(prologBounds, viewportHeight);
      prologStage.style.setProperty("--prolog-shift", `${(progress - 0.5) * 72}`);
      prologStage.style.setProperty("--prolog-rotate", `${progress * 96}`);
      prologStage.style.setProperty("--prolog-progress", `${progress}`);
      updatePrologMotion(progress);
    }

    if (galleryBounds && galleryTrack && galleryViewport && isNearViewport(galleryBounds, viewportHeight, viewportHeight * 0.5)) {
      const progress = getBoundsProgress(galleryBounds, viewportHeight);
      setGalleryScrollProgress(progress);
    }

    if (encoreBounds && isNearViewport(encoreBounds, viewportHeight)) {
      const localX = clamp((lastPointerX - encoreBounds.left) / Math.max(1, encoreBounds.width), 0, 1);
      const localY = clamp((lastPointerY - encoreBounds.top) / Math.max(1, encoreBounds.height), 0, 1);
      encoreScene.style.setProperty("--encore-x", `${localX * 100}%`);
      encoreScene.style.setProperty("--encore-y", `${localY * 100}%`);
      encoreScene.style.setProperty("--encore-rotate", `${getBoundsProgress(encoreBounds, viewportHeight) * 28}`);
    }

    if (cursorAura && canHover) {
      root.style.setProperty("--cursor-x", `${lastPointerX}px`);
      root.style.setProperty("--cursor-y", `${lastPointerY}px`);
    }
  }

  renderSupplementalFrame = renderOverdrive;

  function requestOverdriveRender() {
    scheduleRender();
  }

  function runTransition(action) {
    if (!transitionGrid || prefersReducedMotion) {
      action();
      return;
    }
    transitionGrid.classList.remove("is-active");
    void transitionGrid.offsetWidth;
    transitionGrid.classList.add("is-active");
    window.setTimeout(action, 380);
    window.setTimeout(() => transitionGrid.classList.remove("is-active"), 900);
  }

  function openMenu() {
    if (!menuDialog || menuDialog.open) return;
    menuDialog.showModal();
    document.body.classList.add("modal-open");
  }

  function closeMenu() {
    if (!menuDialog?.open) return;
    menuDialog.close();
    document.body.classList.remove("modal-open");
  }

  menuOpen?.addEventListener("click", () => runTransition(openMenu));
  menuClose?.addEventListener("click", closeMenu);
  menuDialog?.addEventListener("click", (event) => {
    if (event.target === menuDialog) closeMenu();
  });
  menuDialog?.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      runTransition(() => {
        closeMenu();
        target?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });
  });

  function updateSelectedCard(index) {
    selectedCardIndex = clamp(index, 0, flipCards.length - 1);
    const cardNumber = String(selectedCardIndex + 1).padStart(2, "0");
    if (selectedCardLabel) selectedCardLabel.textContent = cardNumber;
    if (inspectCardButton) inspectCardButton.disabled = false;
  }

  function renderCardDialog() {
    if (selectedCardIndex < 0 || !cardDialogImage) return;
    const sourceImage = flipCards[selectedCardIndex]?.querySelector(".flip-card__face--photo img");
    if (!sourceImage) return;
    cardDialogImage.src = sourceImage.currentSrc || sourceImage.src;
    cardDialogImage.alt = sourceImage.alt;
    if (cardDialogTitle) cardDialogTitle.textContent = cardTitles[selectedCardIndex];
    if (cardDialogNumber) {
      cardDialogNumber.textContent = `${String(selectedCardIndex + 1).padStart(2, "0")} / 10`;
    }
  }

  function openCardDialog(index = selectedCardIndex) {
    if (!cardDialog || !flipCards.length) return;
    updateSelectedCard(index);
    if (!cardDialog.open) cardDialog.showModal();
    // Write the image synchronously so the modal never opens on stale content.
    renderCardDialog();
    if (document.startViewTransition && !prefersReducedMotion) {
      document.startViewTransition(() => renderCardDialog());
    }
    document.body.classList.add("modal-open");
  }

  function closeCardDialog() {
    if (!cardDialog?.open) return;
    cardDialog.close();
    document.body.classList.remove("modal-open");
  }

  flipCards.forEach((card, index) => {
    card.addEventListener("click", () => updateSelectedCard(index));
    card.addEventListener("dblclick", () => openCardDialog(index));
  });
  inspectCardButton?.addEventListener("click", () => openCardDialog());
  cardDialogClose?.addEventListener("click", closeCardDialog);
  cardDialog?.addEventListener("click", (event) => {
    if (event.target === cardDialog) closeCardDialog();
  });
  cardDialogPrevious?.addEventListener("click", () => {
    selectedCardIndex = (selectedCardIndex - 1 + flipCards.length) % flipCards.length;
    renderCardDialog();
    updateSelectedCard(selectedCardIndex);
  });
  cardDialogNext?.addEventListener("click", () => {
    selectedCardIndex = (selectedCardIndex + 1) % flipCards.length;
    renderCardDialog();
    updateSelectedCard(selectedCardIndex);
  });
  function endGalleryDrag(event) {
    if (!galleryState.dragging || event.pointerId !== galleryState.pointerId) return;
    galleryState.dragging = false;
    galleryState.pointerId = null;
    galleryState.suppressClick = galleryState.dragDistance > 8;
    if (galleryViewport?.hasPointerCapture(event.pointerId)) galleryViewport.releasePointerCapture(event.pointerId);
    window.setTimeout(() => { galleryState.suppressClick = false; }, 0);
    requestGalleryFrame();
  }

  galleryViewport?.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || galleryState.detailCard) return;
    galleryState.dragging = true;
    galleryState.pointerId = event.pointerId;
    galleryState.dragDistance = 0;
    galleryState.lastX = event.clientX;
    galleryState.lastMoveTime = performance.now();
    galleryState.velocity = 0;
    requestGalleryFrame();
  });

  galleryViewport?.addEventListener("pointermove", (event) => {
    if (!galleryState.dragging || event.pointerId !== galleryState.pointerId) return;
    const now = performance.now();
    const deltaX = event.clientX - galleryState.lastX;
    const deltaTime = Math.max(8, now - galleryState.lastMoveTime);
    const deltaUnits = -deltaX / 122;
    galleryState.dragDistance += Math.abs(deltaX);
    galleryState.dragOffset = clamp(galleryState.dragOffset + deltaUnits, -galleryCards.length, galleryCards.length);
    galleryState.velocity = deltaUnits * clamp(18 / deltaTime, 0.35, 1.8);
    galleryState.lastX = event.clientX;
    galleryState.lastMoveTime = now;
    if (galleryState.dragDistance > 4) {
      if (!galleryViewport.hasPointerCapture(event.pointerId)) galleryViewport.setPointerCapture(event.pointerId);
      event.preventDefault();
    }
    requestGalleryFrame();
  });

  galleryViewport?.addEventListener("pointerup", endGalleryDrag);
  galleryViewport?.addEventListener("pointercancel", endGalleryDrag);

  galleryCards.forEach((card, index) => {
    card.addEventListener("pointermove", (event) => {
      if (galleryState.dragging || galleryState.detailCard) return;
      const profile = galleryPresentationProfiles[index] || galleryPresentationProfiles[0];
      const bounds = card.getBoundingClientRect();
      const pointerX = clamp((event.clientX - bounds.left) / Math.max(1, bounds.width), 0, 1) * 2 - 1;
      const pointerY = clamp((event.clientY - bounds.top) / Math.max(1, bounds.height), 0, 1) * 2 - 1;
      card.style.setProperty("--card-pointer-x", `${pointerX}`);
      card.style.setProperty("--card-pointer-y", `${pointerY}`);
      card.style.setProperty("--card-tilt-x", `${-pointerY * profile.tilt}deg`);
      card.style.setProperty("--card-tilt-y", `${pointerX * profile.tilt}deg`);
      card.style.setProperty("--card-glint", "1");
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--card-pointer-x", "0");
      card.style.setProperty("--card-pointer-y", "0");
      card.style.setProperty("--card-tilt-x", "0deg");
      card.style.setProperty("--card-tilt-y", "0deg");
      card.style.setProperty("--card-glint", "0");
    });
    card.addEventListener("click", () => openGalleryDetail(card));
  });

  galleryPrevious?.addEventListener("click", () => goToGalleryIndex(galleryState.activeIndex - 1));
  galleryNext?.addEventListener("click", () => goToGalleryIndex(galleryState.activeIndex + 1));
  galleryTabs.forEach((tab) => {
    tab.addEventListener("click", () => goToGalleryIndex(Number(tab.dataset.orbitJump || 0)));
  });
  galleryViewport?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToGalleryIndex(galleryState.activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToGalleryIndex(galleryState.activeIndex + 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      goToGalleryIndex(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goToGalleryIndex(galleryCards.length - 1);
    }
  });
  galleryDetailClose.forEach((control) => control.addEventListener("click", closeGalleryDetail));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && galleryState.detailCard) closeGalleryDetail();
  });

  replayButton?.addEventListener("click", () => {
    runTransition(() => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));
  });

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll("[data-count]").forEach((counter) => {
        const target = Number(counter.dataset.count);
        const start = performance.now();
        const duration = prefersReducedMotion ? 1 : 1100;
        const tick = (stamp) => {
          const progress = clamp((stamp - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 4);
          counter.textContent = String(Math.round(target * eased)).padStart(2, "0");
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });
  if (factoidsScene) countObserver.observe(factoidsScene);

  if (cardsScene && !cardsPreloaded) {
    const cardsWarmObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      preloadFlipCardImages();
      observer.disconnect();
    }, { rootMargin: "70% 0px" });
    cardsWarmObserver.observe(cardsScene);
  }

  if (galleryScene && galleryCards.length) {
    const galleryWarmObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      warmGalleryNeighborhood(Math.max(0, galleryState.activeIndex));
      observer.disconnect();
    }, { rootMargin: "100% 0px" });
    galleryWarmObserver.observe(galleryScene);
  }

  if (canHover && cursorAura) {
    window.addEventListener("pointermove", (event) => {
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      requestOverdriveRender();
      const tiltX = clamp((event.clientX / Math.max(1, window.innerWidth) - 0.5) * 14, -8, 8);
      const tiltY = clamp((0.5 - event.clientY / Math.max(1, window.innerHeight)) * 14, -8, 8);
      root.style.setProperty("--cursor-tilt-x", `${tiltX}deg`);
      root.style.setProperty("--cursor-tilt-y", `${tiltY}deg`);
    }, { passive: true });
    document.querySelectorAll("a, button, .flip-card").forEach((interactive) => {
      interactive.addEventListener("pointerenter", () => cursorAura.classList.add("is-hovering"));
      interactive.addEventListener("pointerleave", () => cursorAura.classList.remove("is-hovering"));
    });

    document.querySelectorAll("[data-magnetic]").forEach((magnetic) => {
      const inner = magnetic.querySelector("span");
      const state = {
        bounds: null,
        x: 0,
        y: 0,
        outerAnimation: null,
        innerAnimation: null,
      };

      const cancelAnimations = () => {
        state.outerAnimation?.cancel();
        state.innerAnimation?.cancel();
        state.outerAnimation = null;
        state.innerAnimation = null;
      };

      const settleMagnetic = () => {
        cancelAnimations();
        const { x, y } = state;
        const keyframes = [
          { translate: `${x}px ${y}px`, offset: 0 },
          { translate: `${-x * .12}px ${-y * .12}px`, offset: .58 },
          { translate: `${x * .035}px ${y * .035}px`, offset: .82 },
          { translate: "0px 0px", offset: 1 },
        ];
        state.outerAnimation = magnetic.animate(keyframes, {
          duration: 640,
          easing: "cubic-bezier(.16,1,.3,1)",
        });
        if (inner) {
          state.innerAnimation = inner.animate(keyframes.map((frame) => ({
            ...frame,
            translate: frame.translate === "0px 0px"
              ? frame.translate
              : frame.translate.replace(/(-?[\d.]+)px (-?[\d.]+)px/, (_, frameX, frameY) => `${Number(frameX) * .46}px ${Number(frameY) * .46}px`),
          })), {
            duration: 720,
            easing: "cubic-bezier(.16,1,.3,1)",
          });
        }
        state.x = 0;
        state.y = 0;
        state.bounds = null;
        magnetic.style.translate = "0px 0px";
        if (inner) inner.style.translate = "0px 0px";
      };

      magnetic.addEventListener("pointerenter", () => {
        cancelAnimations();
        magnetic.style.translate = "0px 0px";
        if (inner) inner.style.translate = "0px 0px";
        state.bounds = magnetic.getBoundingClientRect();
      });
      magnetic.addEventListener("pointermove", (event) => {
        cancelAnimations();
        const bounds = state.bounds || magnetic.getBoundingClientRect();
        const limit = Math.min(24, Math.max(8, Math.min(bounds.width, bounds.height) * .28));
        const x = clamp((event.clientX - bounds.left - bounds.width / 2) * .24, -limit, limit);
        const y = clamp((event.clientY - bounds.top - bounds.height / 2) * .24, -limit, limit);
        state.x = x;
        state.y = y;
        magnetic.style.translate = `${x}px ${y}px`;
        if (inner) inner.style.translate = `${x * .46}px ${y * .46}px`;
      });
      magnetic.addEventListener("pointerleave", settleMagnetic);
      magnetic.addEventListener("pointercancel", settleMagnetic);
    });
  }

  window.addEventListener("resize", () => {
    refreshOverdriveLayouts();
    requestOverdriveRender();
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) requestOverdriveRender();
  });
  refreshOverdriveLayouts();
  document.fonts?.ready?.then(() => {
    refreshOverdriveLayouts();
    requestOverdriveRender();
  });
  requestOverdriveRender();
  requestGalleryFrame();
}

mountOverdriveExperience();
