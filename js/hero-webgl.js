/**
 * RAIJUN ZOO — Interactive Kids Storybook Wonderland & Starlight Constellation 3D World
 * Inspired by Pixar/Disney fairytale wonderlands:
 * 1. Cute Glowing Animal Constellations (Teddy Bear, Bunny, Little Bird, Magic Heart & Crown)
 * 2. Sweeping 3D Pastel Rainbow Arches & Fluffy Cotton-Candy Clouds
 * 3. Storybook 3D Planet Earth (Bright Turquoise Oceans & Emerald Islands), Moon & Candy-Gold Ringed Saturn
 * 4. Floating Four-Point Fairy Stars, Pastel Sparkles, Shooting Stars & Click Magic Star-Burst!
 */

(function initStorybookWonderland() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollProgress = 0;
  let magicPulse = 0;

  window.addEventListener("mousemove", (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener(
    "scroll",
    () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    },
    { passive: true }
  );

  // =========================================================================
  // PROCEDURAL STORYBOOK TEXTURE GENERATORS
  // =========================================================================

  // Four-point fairy sparkle star texture (kids fairytale style!)
  function createFairyStarTexture(coreColor = "#FFFFFF", glowColor = "rgba(255, 224, 118, 0.92)") {
    const size = 96;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    const cx = size / 2;
    const cy = size / 2;

    // Soft outer glow
    const rad = ctx.createRadialGradient(cx, cy, 1, cx, cy, size * 0.48);
    rad.addColorStop(0, coreColor);
    rad.addColorStop(0.28, glowColor);
    rad.addColorStop(0.62, "rgba(255, 200, 140, 0.2)");
    rad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, size, size);

    // Crisp 4-point storybook sparkle cross
    ctx.fillStyle = coreColor;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 34);
    ctx.quadraticCurveTo(cx + 4, cy - 4, cx + 34, cy);
    ctx.quadraticCurveTo(cx + 4, cy + 4, cx, cy + 34);
    ctx.quadraticCurveTo(cx - 4, cy + 4, cx - 34, cy);
    ctx.quadraticCurveTo(cx - 4, cy - 4, cx, cy - 34);
    ctx.closePath();
    ctx.fill();

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  // Fluffy cotton-candy cloud puff sprite
  function createCloudPuffTexture(tintTop = "rgba(255,255,255,0.92)", tintBottom = "rgba(255,214,242,0.58)") {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");

    const puffs = [
      [128, 132, 68],
      [78, 142, 52],
      [178, 142, 54],
      [104, 102, 50],
      [152, 106, 48]
    ];

    puffs.forEach(([px, py, r]) => {
      const g = ctx.createRadialGradient(px, py - r * 0.25, r * 0.1, px, py, r);
      g.addColorStop(0, tintTop);
      g.addColorStop(0.55, tintBottom);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    });

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  // Pastel Rainbow Ribbon Texture
  function createRainbowTexture() {
    const w = 32;
    const h = 256;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");

    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0.0, "rgba(255, 118, 158, 0)");
    g.addColorStop(0.14, "rgba(255, 126, 168, 0.72)"); // Strawberry Pink
    g.addColorStop(0.28, "rgba(255, 190, 105, 0.72)"); // Peach Orange
    g.addColorStop(0.44, "rgba(255, 240, 128, 0.76)"); // Sunny Lemon
    g.addColorStop(0.60, "rgba(130, 240, 198, 0.72)"); // Mint Green
    g.addColorStop(0.76, "rgba(126, 206, 255, 0.72)"); // Sky Blue
    g.addColorStop(0.90, "rgba(196, 152, 255, 0.68)"); // Dreamy Lavender
    g.addColorStop(1.0, "rgba(196, 152, 255, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  // Soft Nebula / Halo Glow Sprite
  function createSoftGlowTexture(c1, c2) {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(128, 128, 4, 128, 128, 128);
    g.addColorStop(0, c1);
    g.addColorStop(0.45, c2);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function hash2(x, y) {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = hash2(xi, yi);
    const b = hash2(xi + 1, yi);
    const c = hash2(xi, yi + 1);
    const d = hash2(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }

  function fbm(x, y, octaves = 4) {
    let val = 0;
    let amp = 0.5;
    let freq = 1;
    for (let i = 0; i < octaves; i++) {
      val += amp * valueNoise(x * freq, y * freq);
      freq *= 2.04;
      amp *= 0.5;
    }
    return val;
  }

  // Vibrant Pixar-Storybook Earth Textures (Bright Turquoise Oceans & Lush Sunny Continents)
  function createStorybookEarthTextures() {
    const w = 768;
    const h = 384;
    const sCanvas = document.createElement("canvas");
    sCanvas.width = w;
    sCanvas.height = h;
    const sCtx = sCanvas.getContext("2d");

    const cCanvas = document.createElement("canvas");
    cCanvas.width = w;
    cCanvas.height = h;
    const cCtx = cCanvas.getContext("2d");

    const sImg = sCtx.createImageData(w, h);
    const cImg = cCtx.createImageData(w, h);
    const sData = sImg.data;
    const cData = cImg.data;

    for (let y = 0; y < h; y++) {
      const lat = (y / h - 0.5) * Math.PI;
      const absLat = Math.abs(lat) / (Math.PI * 0.5);
      for (let x = 0; x < w; x++) {
        const lon = (x / w) * Math.PI * 2;
        const nx = Math.cos(lon) * Math.cos(lat) * 2.0 + 3.8;
        const ny = Math.sin(lon) * Math.cos(lat) * 2.0 + 6.9;
        const nz = Math.sin(lat) * 2.0 + 1.9;
        const elev = fbm(nx + nz * 0.6, ny - nz * 0.5, 4);
        const idx = (y * w + x) * 4;

        let r, g, b;
        if (absLat > 0.84) {
          r = 242; g = 250; b = 255;
        } else if (elev > 0.53) {
          const hNorm = Math.min(1, (elev - 0.53) / 0.26);
          // Vibrant storybook emerald & warm golden-meadow islands
          r = 76 + hNorm * 112;
          g = 198 + hNorm * 32;
          b = 98 + hNorm * 22;
        } else {
          // Bright storybook cerulean & lagoon turquoise oceans
          const d = Math.max(0, elev / 0.53);
          const shelf = Math.pow(d, 3.6);
          r = 24 + shelf * 56;
          g = 128 + shelf * 92;
          b = 228 + shelf * 24;
        }
        sData[idx] = r;
        sData[idx + 1] = g;
        sData[idx + 2] = b;
        sData[idx + 3] = 255;

        const swirl = fbm(nx * 1.8 + 18, ny * 1.8 + 12, 3);
        const ca = Math.max(0, (swirl - 0.55) * 2.8);
        cData[idx] = 255;
        cData[idx + 1] = 255;
        cData[idx + 2] = 255;
        cData[idx + 3] = Math.min(235, Math.floor(ca * 255));
      }
    }

    sCtx.putImageData(sImg, 0, 0);
    cCtx.putImageData(cImg, 0, 0);
    const surfaceTex = new THREE.CanvasTexture(sCanvas);
    const cloudTex = new THREE.CanvasTexture(cCanvas);
    surfaceTex.needsUpdate = true;
    cloudTex.needsUpdate = true;
    return { surfaceTex, cloudTex };
  }

  function createCandyPlanetTexture(stops) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    stops.forEach(([s, col]) => g.addColorStop(s, col));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 256);

    for (let i = 0; i < 24; i++) {
      ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.16)" : "rgba(255,220,165,0.12)";
      ctx.fillRect(0, (i / 24) * 256, 512, 5 + (i % 3) * 4);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function createCandyRingTexture() {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 32;
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 512, 0);
    g.addColorStop(0.0, "rgba(0,0,0,0)");
    g.addColorStop(0.18, "rgba(255, 226, 130, 0.72)");
    g.addColorStop(0.40, "rgba(255, 168, 214, 0.76)");
    g.addColorStop(0.55, "rgba(255, 255, 255, 0.16)");
    g.addColorStop(0.68, "rgba(138, 232, 255, 0.72)");
    g.addColorStop(0.88, "rgba(255, 236, 160, 0.45)");
    g.addColorStop(1.0, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 32);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  // =========================================================================
  // THREE.JS STORYBOOK COSMIC WONDERLAND SCENE
  // =========================================================================
  if (typeof THREE !== "undefined") {
    try {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight, false);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 1.5, 62);

      // Warm Storybook Sun & Fairy Rim Lighting
      scene.add(new THREE.AmbientLight(0xa4c6ff, 1.05));
      const sunLight = new THREE.DirectionalLight(0xfff7dc, 1.55);
      sunLight.position.set(-36, 32, 44);
      scene.add(sunLight);
      const candyRim = new THREE.DirectionalLight(0xffb5e8, 0.85);
      candyRim.position.set(42, -18, -18);
      scene.add(candyRim);

      const starTexGold = createFairyStarTexture("#FFFFFF", "rgba(255, 224, 112, 0.95)");
      const starTexPink = createFairyStarTexture("#FFF8FD", "rgba(255, 165, 222, 0.92)");
      const starTexAqua = createFairyStarTexture("#F5FFFF", "rgba(130, 238, 255, 0.92)");

      const worldGroup = new THREE.Group();
      scene.add(worldGroup);

      // ---------------------------------------------------------------------
      // 1. SWEEPING DREAMY PASTEL MILKY WAY & RAINBOW ARCHES (동화 무지개 & 은하수)
      // ---------------------------------------------------------------------
      const skyGroup = new THREE.Group();
      worldGroup.add(skyGroup);

      // Primary Sweeping 3D Pastel Rainbow Arch framing Earth & Raijun Card
      const rainbowGeom1 = new THREE.TorusGeometry(42, 3.2, 16, 120, Math.PI * 0.72);
      const rainbowMat1 = new THREE.MeshBasicMaterial({
        map: createRainbowTexture(),
        transparent: true,
        opacity: 0.52,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const rainbow1 = new THREE.Mesh(rainbowGeom1, rainbowMat1);
      rainbow1.position.set(16, -18, -46);
      rainbow1.rotation.z = 0.14;
      skyGroup.add(rainbow1);

      // Soft Cotton-Candy Nebula Glows (Pastel Lavender, Pink & Sunny Gold Milky Way)
      const nebulaSwatches = [
        createSoftGlowTexture("rgba(255, 182, 228, 0.28)", "rgba(182, 134, 255, 0.14)"),
        createSoftGlowTexture("rgba(122, 214, 255, 0.28)", "rgba(74, 152, 255, 0.12)"),
        createSoftGlowTexture("rgba(255, 232, 148, 0.24)", "rgba(255, 178, 132, 0.1)")
      ];

      for (let i = 0; i < 24; i++) {
        const t = i / 23;
        const s = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: nebulaSwatches[i % nebulaSwatches.length],
            transparent: true,
            opacity: 0.65,
            depthWrite: false,
            blending: THREE.AdditiveBlending
          })
        );
        const sc = 28 + Math.random() * 34;
        s.scale.set(sc * 1.4, sc * 0.9, 1);
        s.position.set(
          (t - 0.5) * 170 + (Math.random() - 0.5) * 20,
          (t - 0.4) * 58 + (Math.random() - 0.5) * 18,
          -56 - Math.random() * 18
        );
        skyGroup.add(s);
      }

      // ---------------------------------------------------------------------
      // 2. FLUFFY COTTON-CANDY CLOUDS (몽글몽글 파스텔 동화 구름)
      // ---------------------------------------------------------------------
      const cloudTexWhite = createCloudPuffTexture("rgba(255,255,255,0.88)", "rgba(218,236,255,0.45)");
      const cloudTexPink = createCloudPuffTexture("rgba(255,248,254,0.86)", "rgba(255,204,236,0.52)");

      const cloudPositions = [
        [-48, -22, -32, 34, 0],
        [-20, -26, -28, 38, 1],
        [14, -27, -30, 36, 0],
        [48, -21, -32, 38, 1],
        [-54, 14, -44, 32, 1],
        [52, 18, -42, 34, 0],
        [0, 29, -48, 36, 1]
      ];
      const clouds = [];

      cloudPositions.forEach(([x, y, z, scale, type], idx) => {
        const cSprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: type === 0 ? cloudTexWhite : cloudTexPink,
            transparent: true,
            opacity: 0.48,
            depthWrite: false
          })
        );
        cSprite.position.set(x, y, z);
        cSprite.scale.set(scale * 1.45, scale * 0.9, 1);
        skyGroup.add(cSprite);
        clouds.push({ sprite: cSprite, baseX: x, baseY: y, phase: idx * 1.3 });
      });

      // ---------------------------------------------------------------------
      // 3. CUTE STORYBOOK ANIMAL CONSTELLATIONS (아동이 좋아하는 귀여운 동물 별자리!)
      //    Teddy Bear (곰돌이), Bunny (토끼), Little Bird (아기새), Magic Heart (하트)
      // ---------------------------------------------------------------------
      const constellationGroup = new THREE.Group();
      worldGroup.add(constellationGroup);

      const KIDS_CONSTELLATIONS = [
        {
          // Cute Teddy Bear Face Constellation (곰돌이 별자리) — Open Upper-Center Sky
          offset: [-5, 19.5, -24],
          scale: 1.55,
          stars: [
            [-2.4, 2.3, 0], // Left ear
            [-1.3, 2.8, 0],
            [-0.9, 1.8, 0],
            [0.9, 1.8, 0],  // Right ear
            [1.3, 2.8, 0],
            [2.4, 2.3, 0],
            [2.1, 0.7, 0],  // Cheek R
            [1.3, -1.1, 0], // Chin R
            [0.0, -1.6, 0], // Chin center
            [-1.3, -1.1, 0],// Chin L
            [-2.1, 0.7, 0], // Cheek L
            [-0.7, 0.4, 0.2],// Left eye sparkle
            [0.7, 0.4, 0.2], // Right eye sparkle
            [0.0, -0.3, 0.2] // Cute nose
          ],
          edges: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
            [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 0]
          ]
        },
        {
          // Cute Bunny Constellation (토끼 별자리) — Open Far Upper-Right Sky
          offset: [36, 19, -26],
          scale: 1.45,
          stars: [
            [-1.1, 1.6, 0],  // Left ear base
            [-1.5, 3.8, 0],  // Left ear tip
            [-0.5, 2.1, 0],
            [0.5, 2.1, 0],   // Right ear base
            [1.5, 3.8, 0],   // Right ear tip
            [1.1, 1.6, 0],
            [1.8, 0.1, 0],   // Face R
            [0.9, -1.5, 0],  // Chin R
            [-0.9, -1.5, 0], // Chin L
            [-1.8, 0.1, 0],  // Face L
            [-0.6, 0.3, 0.2],// Eye L
            [0.6, 0.3, 0.2]  // Eye R
          ],
          edges: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
            [5, 6], [6, 7], [7, 8], [8, 9], [9, 0]
          ]
        },
        {
          // Cute Little Bird Constellation (아기새 별자리) — Open Upper-Left Sky
          offset: [-31, 21, -26],
          scale: 1.5,
          stars: [
            [-2.6, 0.6, 0],  // Beak
            [-1.4, 1.3, 0],  // Head top
            [0.0, 0.9, 0],   // Back
            [1.6, 2.4, 0],   // Wing up
            [2.4, 1.1, 0],   // Tail tip
            [1.2, -0.3, 0],  // Belly R
            [-0.7, -0.7, 0], // Belly L
            [-1.5, 0.1, 0]   // Throat
          ],
          edges: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [2, 5]
          ]
        },
        {
          // Magic Heart Star Constellation (마법 하트 별자리) — Open Lower-Center Sky
          offset: [6, -15.5, -22],
          scale: 1.55,
          stars: [
            [0.0, 1.0, 0],
            [-1.2, 2.1, 0],
            [-2.5, 1.2, 0],
            [-2.1, -0.5, 0],
            [0.0, -2.4, 0],
            [2.1, -0.5, 0],
            [2.5, 1.2, 0],
            [1.2, 2.1, 0]
          ],
          edges: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]
          ]
        }
      ];

      const conStarPositions = [];
      const conLinePositions = [];

      KIDS_CONSTELLATIONS.forEach((con) => {
        const [ox, oy, oz] = con.offset;
        const pts = con.stars.map(([x, y, z]) => [
          ox + x * con.scale,
          oy + y * con.scale,
          oz + z * con.scale
        ]);
        pts.forEach((p) => conStarPositions.push(p[0], p[1], p[2]));
        con.edges.forEach(([a, b]) => {
          conLinePositions.push(
            pts[a][0], pts[a][1], pts[a][2],
            pts[b][0], pts[b][1], pts[b][2]
          );
        });
      });

      const conStarsGeom = new THREE.BufferGeometry();
      conStarsGeom.setAttribute("position", new THREE.Float32BufferAttribute(conStarPositions, 3));
      const conStarsMesh = new THREE.Points(
        conStarsGeom,
        new THREE.PointsMaterial({
          size: 4.4,
          map: starTexGold,
          color: 0xfff5c4,
          transparent: true,
          opacity: 0.98,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      );
      constellationGroup.add(conStarsMesh);

      const conLinesGeom = new THREE.BufferGeometry();
      conLinesGeom.setAttribute("position", new THREE.Float32BufferAttribute(conLinePositions, 3));
      const conLinesMesh = new THREE.LineSegments(
        conLinesGeom,
        new THREE.LineBasicMaterial({
          color: 0xffe28a,
          transparent: true,
          opacity: 0.62,
          blending: THREE.AdditiveBlending
        })
      );
      constellationGroup.add(conLinesMesh);

      // ---------------------------------------------------------------------
      // 4. FLOATING FAIRY SPARKLE STARS (반짝반짝 요정 별가루)
      // ---------------------------------------------------------------------
      const sparkleCount = window.innerWidth < 768 ? 700 : 1400;
      const spPos = new Float32Array(sparkleCount * 3);
      const spCol = new Float32Array(sparkleCount * 3);
      const spPalette = [
        new THREE.Color("#FFF9D6"), // Fairy Gold
        new THREE.Color("#FFD86B"), // Honey Yellow
        new THREE.Color("#FFAEE0"), // Cotton Pink
        new THREE.Color("#9BE8FF"), // Sky Aqua
        new THREE.Color("#D2B5FF")  // Pastel Lavender
      ];

      for (let i = 0; i < sparkleCount; i++) {
        const i3 = i * 3;
        spPos[i3] = (Math.random() - 0.5) * 190;
        spPos[i3 + 1] = (Math.random() - 0.5) * 125;
        spPos[i3 + 2] = (Math.random() - 0.5) * 78 - 18;

        const c = spPalette[Math.floor(Math.random() * spPalette.length)];
        spCol[i3] = c.r;
        spCol[i3 + 1] = c.g;
        spCol[i3 + 2] = c.b;
      }

      const spGeom = new THREE.BufferGeometry();
      spGeom.setAttribute("position", new THREE.BufferAttribute(spPos, 3));
      spGeom.setAttribute("color", new THREE.BufferAttribute(spCol, 3));
      const fairyField = new THREE.Points(
        spGeom,
        new THREE.PointsMaterial({
          size: 2.4,
          map: starTexGold,
          vertexColors: true,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      );
      worldGroup.add(fairyField);

      // ---------------------------------------------------------------------
      // 5. STORYBOOK 3D PLANET EARTH + MOON & CANDY-GOLD RINGED SATURN
      // ---------------------------------------------------------------------
      const earthSystem = new THREE.Group();
      earthSystem.position.set(1.5, 9.2, -14);
      worldGroup.add(earthSystem);

      const { surfaceTex, cloudTex } = createStorybookEarthTextures();
      const earthMesh = new THREE.Mesh(
        new THREE.SphereGeometry(4.8, 56, 56),
        new THREE.MeshPhongMaterial({
          map: surfaceTex,
          specular: new THREE.Color(0x6cd2ff),
          shininess: 20,
          emissive: new THREE.Color(0x0b2b59),
          emissiveIntensity: 0.32
        })
      );
      earthMesh.rotation.z = 0.36;
      earthSystem.add(earthMesh);

      const earthClouds = new THREE.Mesh(
        new THREE.SphereGeometry(4.92, 48, 48),
        new THREE.MeshPhongMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.72,
          depthWrite: false
        })
      );
      earthClouds.rotation.z = 0.36;
      earthSystem.add(earthClouds);

      const earthGlow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: createSoftGlowTexture("rgba(130, 224, 255, 0.55)", "rgba(96, 175, 255, 0.22)"),
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      earthGlow.scale.set(15.5, 15.5, 1);
      earthSystem.add(earthGlow);

      // Glowing Storybook Moon orbiting Earth
      const moonPivot = new THREE.Group();
      moonPivot.rotation.z = 0.25;
      earthSystem.add(moonPivot);

      const moonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.15, 32, 32),
        new THREE.MeshPhongMaterial({
          color: 0xfff0b3,
          emissive: 0xffd260,
          emissiveIntensity: 0.45,
          shininess: 18
        })
      );
      moonMesh.position.set(8.2, 0.6, 0);
      moonPivot.add(moonMesh);

      // Candy-Gold & Pastel Rainbow Ringed Saturn (Upper-Right Sky)
      const saturnGroup = new THREE.Group();
      saturnGroup.position.set(24.5, 14.2, -24);
      saturnGroup.rotation.z = -0.32;
      saturnGroup.rotation.x = 0.28;
      worldGroup.add(saturnGroup);

      const saturnMesh = new THREE.Mesh(
        new THREE.SphereGeometry(3.4, 44, 44),
        new THREE.MeshPhongMaterial({
          map: createCandyPlanetTexture([
            [0, "#ffb570"],
            [0.35, "#ffe48f"],
            [0.65, "#ffc288"],
            [1, "#ff97b5"]
          ]),
          shininess: 18,
          emissive: 0x3b2208,
          emissiveIntensity: 0.28
        })
      );
      saturnGroup.add(saturnMesh);

      const ringGeom = new THREE.RingGeometry(4.4, 8.2, 80, 1);
      const rPos = ringGeom.attributes.position;
      const rUv = ringGeom.attributes.uv;
      for (let i = 0; i < rPos.count; i++) {
        const rad = Math.hypot(rPos.getX(i), rPos.getY(i));
        rUv.setXY(i, (rad - 4.4) / 3.8, 0.5);
      }
      const saturnRing = new THREE.Mesh(
        ringGeom,
        new THREE.MeshBasicMaterial({
          map: createCandyRingTexture(),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.92,
          depthWrite: false
        })
      );
      saturnRing.rotation.x = Math.PI * 0.46;
      saturnGroup.add(saturnRing);

      // Cute Cotton-Candy Pink Planet (Open Lower-Center Vista)
      const pinkPlanet = new THREE.Mesh(
        new THREE.SphereGeometry(2.35, 36, 36),
        new THREE.MeshPhongMaterial({
          map: createCandyPlanetTexture([
            [0, "#ff93c9"],
            [0.5, "#ffd0e8"],
            [1, "#b497ff"]
          ]),
          shininess: 22,
          emissive: 0x2c1138,
          emissiveIntensity: 0.3
        })
      );
      pinkPlanet.position.set(-4.5, -16.8, -24);
      worldGroup.add(pinkPlanet);

      // Cute Mint-Aqua Planet (Open Lower-Right Corner)
      const mintPlanet = new THREE.Mesh(
        new THREE.SphereGeometry(2.1, 36, 36),
        new THREE.MeshPhongMaterial({
          map: createCandyPlanetTexture([
            [0, "#6beed0"],
            [0.5, "#a9f6ff"],
            [1, "#6ea8ff"]
          ]),
          shininess: 24,
          emissive: 0x0b2d38,
          emissiveIntensity: 0.3
        })
      );
      mintPlanet.position.set(34, -18.5, -28);
      worldGroup.add(mintPlanet);

      // ---------------------------------------------------------------------
      // 6. CLICK MAGIC STAR-BURST & SHOOTING STARS
      // ---------------------------------------------------------------------
      const burstCount = 48;
      const burstPos = new Float32Array(burstCount * 3);
      const burstCol = new Float32Array(burstCount * 3);
      const burstVel = [];
      for (let i = 0; i < burstCount; i++) {
        burstPos[i * 3] = 0;
        burstPos[i * 3 + 1] = 0;
        burstPos[i * 3 + 2] = -200;
        const c = spPalette[i % spPalette.length];
        burstCol[i * 3] = c.r;
        burstCol[i * 3 + 1] = c.g;
        burstCol[i * 3 + 2] = c.b;
        burstVel.push({ vx: 0, vy: 0, vz: 0 });
      }
      const burstGeom = new THREE.BufferGeometry();
      burstGeom.setAttribute("position", new THREE.BufferAttribute(burstPos, 3));
      burstGeom.setAttribute("color", new THREE.BufferAttribute(burstCol, 3));
      const burstMat = new THREE.PointsMaterial({
        size: 3.6,
        map: starTexPink,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const burstPoints = new THREE.Points(burstGeom, burstMat);
      scene.add(burstPoints);

      let burstLife = 0;
      window.addEventListener("click", (e) => {
        magicPulse = 1;
        burstLife = 1;
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        const bx = nx * 34;
        const by = ny * 20;
        const arr = burstGeom.attributes.position.array;
        for (let i = 0; i < burstCount; i++) {
          arr[i * 3] = bx;
          arr[i * 3 + 1] = by;
          arr[i * 3 + 2] = 0;
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.25 + Math.random() * 0.65;
          burstVel[i].vx = Math.cos(angle) * speed;
          burstVel[i].vy = Math.sin(angle) * speed;
          burstVel[i].vz = (Math.random() - 0.5) * 0.3;
        }
        burstGeom.attributes.position.needsUpdate = true;
      });

      // Shooting Stars across the Rainbow Sky
      const meteors = Array.from({ length: 3 }, (_, i) => {
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-7.5, 3.8, 0)
          ]),
          new THREE.LineBasicMaterial({
            color: 0xfff2a6,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
          })
        );
        scene.add(line);
        return { line, active: false, timer: 1.5 + i * 3.2, life: 0 };
      });

      function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
      }
      window.addEventListener("resize", onResize);

      let frameId = null;
      const clock = new THREE.Clock();

      function animate() {
        frameId = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.getElapsedTime();

        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        magicPulse *= 0.92;

        if (!prefersReducedMotion) {
          // Earth, Clouds, Moon & Candy Planets gentle playful motion
          earthMesh.rotation.y += dt * 0.16;
          earthClouds.rotation.y += dt * 0.22;
          moonPivot.rotation.y = t * 0.45;
          earthSystem.position.y = 9.2 + Math.sin(t * 0.7) * 0.42;

          saturnMesh.rotation.y += dt * 0.22;
          saturnGroup.position.y = 14.2 + Math.cos(t * 0.65) * 0.55;

          pinkPlanet.rotation.y += dt * 0.18;
          pinkPlanet.position.y = -16.8 + Math.sin(t * 0.8 + 1) * 0.5;

          mintPlanet.rotation.y -= dt * 0.2;
          mintPlanet.position.y = -18.5 + Math.cos(t * 0.75 + 2) * 0.5;

          // Twinkling Animal Constellations
          conLinesMesh.material.opacity = 0.48 + Math.sin(t * 2.0) * 0.18 + magicPulse * 0.3;
          conStarsMesh.material.size = 4.2 + Math.sin(t * 2.4) * 0.45 + magicPulse * 1.4;

          // Floating Fairy Dust upward gentle drift
          fairyField.rotation.y = Math.sin(t * 0.06) * 0.08;
          fairyField.position.y = Math.sin(t * 0.35) * 1.2;

          // Fluffy Clouds gentle sway
          clouds.forEach((c) => {
            c.sprite.position.x = c.baseX + Math.sin(t * 0.22 + c.phase) * 2.6;
            c.sprite.position.y = c.baseY + Math.cos(t * 0.3 + c.phase) * 0.7;
          });

          // Click Magic Star-Burst animation
          if (burstLife > 0.01) {
            burstLife *= 0.94;
            burstMat.opacity = burstLife;
            const arr = burstGeom.attributes.position.array;
            for (let i = 0; i < burstCount; i++) {
              arr[i * 3] += burstVel[i].vx;
              arr[i * 3 + 1] += burstVel[i].vy;
              arr[i * 3 + 2] += burstVel[i].vz;
              burstVel[i].vy -= 0.008;
            }
            burstGeom.attributes.position.needsUpdate = true;
          } else {
            burstMat.opacity = 0;
          }

          // Shooting stars
          meteors.forEach((m) => {
            if (!m.active) {
              m.timer -= dt;
              if (m.timer <= 0) {
                m.active = true;
                m.life = 0;
                m.line.position.set(-28 + Math.random() * 48, 16 + Math.random() * 14, -22);
              }
            } else {
              m.life += dt;
              m.line.position.x += 0.95;
              m.line.position.y -= 0.48;
              m.line.material.opacity = Math.sin(Math.min(1, m.life / 1.05) * Math.PI) * 0.9;
              if (m.life >= 1.05) {
                m.active = false;
                m.line.material.opacity = 0;
                m.timer = 3.8 + Math.random() * 5.2;
              }
            }
          });
        }

        // Smooth Interactive Mouse + Scroll Camera Glide
        const targetCamX = mouse.x * 4.5 + Math.sin(scrollProgress * Math.PI * 1.5) * 5.8;
        const targetCamY = 1.5 + mouse.y * 2.8 - scrollProgress * 10.5;
        const targetCamZ = 62 - scrollProgress * 8;

        camera.position.x += (targetCamX - camera.position.x) * 0.045;
        camera.position.y += (targetCamY - camera.position.y) * 0.045;
        camera.position.z += (targetCamZ - camera.position.z) * 0.045;
        camera.lookAt(0, -scrollProgress * 4, -14);

        renderer.render(scene, camera);
      }

      animate();

      document.addEventListener("visibilitychange", () => {
        if (document.hidden && frameId) {
          cancelAnimationFrame(frameId);
          frameId = null;
        } else if (!document.hidden && !frameId) {
          animate();
        }
      });

      return;
    } catch (err) {
      console.warn("WebGL unavailable, activating 2D Storybook Wonderland fallback:", err);
    }
  }

  // 2D Canvas Storybook Fallback
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);
  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const stars = Array.from({ length: 160 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2.4 + 0.8,
    a: Math.random() * 0.7 + 0.3
  }));

  function loop2d() {
    requestAnimationFrame(loop2d);
    ctx.clearRect(0, 0, w, h);
    stars.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 244, 184, ${s.a})`;
      ctx.fill();
    });
  }
  loop2d();
})();
