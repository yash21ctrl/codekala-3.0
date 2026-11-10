/**
 * CODE KALA 3.0 — Dual-Mode 3D Rose Engine & Adaptive Device Experience
 * 
 * Mode 1 (No Interaction / Top of Page):
 * - Seamless, continuous 360° rotating loop of the rose in its initial position
 *   (55 frames from INITAIL_POSI_frames.zip)
 * 
 * Mode 2 (Scroll Interaction):
 * - Butter-smooth scroll-driven scrub of the cinematic multi-angle sequence
 *   (239 frames from rose_rotating_frames.zip)
 * 
 * Adaptive Mobile vs PC Engine:
 * - Multi-layer detection: Client Hints, User Agent regex, Pointer Coarse/Hover None, Viewport
 * - Clamped DPR on mobile (1.8) vs PC (2.0)
 * - Paced progressive preloading + zero-blank defensive fallback
 */

// ==========================================================================
// 0. MOBILE VS PC MULTI-LAYER DEVICE DETECTION & ADAPTIVE ENGINE
// ==========================================================================
function detectIsMobileDevice() {
  // Layer 1: Navigator User-Agent Client Hints (modern Chromium mobile flag)
  if (typeof navigator !== 'undefined' && navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
    if (navigator.userAgentData.mobile) return true;
  }

  // Layer 2: Explicit iPadOS check (Desktop mode UA with touch points)
  if (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return true;
  }

  // Layer 3: Comprehensive User-Agent signature (iOS Safari, Android, tablets, webOS, etc.)
  const ua = (typeof navigator !== 'undefined' ? (navigator.userAgent || navigator.vendor || (typeof window !== 'undefined' && window.opera) || '') : '').toLowerCase();
  const uaMobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|crios|silk|fennec|windows phone/i;
  const isUAMobile = uaMobileRegex.test(ua);

  // Layer 4: Pointer & Hover media capabilities (CSS Media Queries Level 4)
  const isPointerCoarse = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const isHoverNone = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: none)').matches;
  const hasTouchPoints = typeof navigator !== 'undefined' && ((navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || (typeof window !== 'undefined' && 'ontouchstart' in window));

  // Layer 5: Viewport & Screen Dimensions
  const screenWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth || Infinity, (window.screen && window.screen.width) || Infinity) : Infinity;
  const isNarrowScreen = screenWidth <= 768;

  // Multi-layer arbitration
  if (isUAMobile) return true;
  if (isPointerCoarse && (isHoverNone || isNarrowScreen || hasTouchPoints)) return true;
  if (isNarrowScreen && hasTouchPoints) return true;

  return false;
}

let isMobile = detectIsMobileDevice();
if (typeof window !== 'undefined') {
  window.isMobile = isMobile;
  window.detectIsMobile = detectIsMobileDevice;
}

function syncDeviceClasses() {
  isMobile = detectIsMobileDevice();
  if (typeof window !== 'undefined') {
    window.isMobile = isMobile;
  }
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    const body = document.body;
    const addClass = isMobile ? 'is-mobile-device' : 'is-desktop-device';
    const removeClass = isMobile ? 'is-desktop-device' : 'is-mobile-device';

    const isLandscape = typeof window !== 'undefined' ? (window.innerWidth > window.innerHeight) : false;
    const orient = isLandscape ? 'landscape' : 'portrait';

    if (root) {
      root.classList.add(addClass);
      root.classList.remove(removeClass);
      root.setAttribute('data-orientation', orient);
    }
    if (body) {
      body.classList.add(addClass);
      body.classList.remove(removeClass);
      body.setAttribute('data-orientation', orient);
    }
  }
}

// Synchronously stamp documentElement and body on script execution
syncDeviceClasses();

// Top-level listener for resize and orientation change to synchronize device classes immediately
if (typeof window !== 'undefined') {
  window.addEventListener('resize', syncDeviceClasses, { passive: true });
  window.addEventListener('orientationchange', () => {
    setTimeout(syncDeviceClasses, 60);
    setTimeout(syncDeviceClasses, 200);
  }, { passive: true });
}

function initApplication() {
  // Stamp document.body as soon as DOM is ready
  syncDeviceClasses();

  // ==========================================================================
  // 1. INTRO VIDEO & SLIDE-UP TRANSITION
  // ==========================================================================
  const introOverlay = document.getElementById('introOverlay');
  const introVideo = document.getElementById('introVideo');
  const introCountdown = document.getElementById('introCountdown');

  // Audio Elements (Continuous Flute Music Engine)
  const sfxScroll = document.getElementById('sfxScroll');
  const bgMusic = document.getElementById('bgMusic');
  const audioToggle = document.getElementById('audioToggle');
  const musicWaves = document.getElementById('musicWaves');

  // Countdown Elements (November 14, 2026)
  const timerDays = document.getElementById('timerDays');
  const timerHours = document.getElementById('timerHours');
  const timerMinutes = document.getElementById('timerMinutes');
  const timerSeconds = document.getElementById('timerSeconds');

  // ==========================================================================
  // DYNAMIC SCROLL AUDIO ATTENUATION (Flute Music Volume Modulation)
  // At hero top: full, resonant flute melody (0.55).
  // As user scrolls down towards the event arena & archives:
  // smoothly attenuates down to a gentle ambient whisper (0.12).
  // ==========================================================================
  const BASE_MAX_VOL = 0.55;
  const MIN_SCROLL_VOL = 0.12;
  let currentVolume = BASE_MAX_VOL;

  if (bgMusic) bgMusic.volume = BASE_MAX_VOL;
  if (sfxScroll) sfxScroll.volume = 0.85;

  let isSoundEnabled = true;
  let hasEntered = false;

  function updateScrollVolume() {
    if (!bgMusic) return;
    if (!isSoundEnabled) {
      bgMusic.volume = 0;
      return;
    }

    const scrollY = window.scrollY;
    // Calculate scroll fraction over the viewport height
    const scrollRatio = Math.min(1, Math.max(0, scrollY / (window.innerHeight * 1.05)));

    // Target volume curves down gently as user scrolls down
    const targetVol = BASE_MAX_VOL - (scrollRatio * (BASE_MAX_VOL - MIN_SCROLL_VOL));

    // Smooth lerp damping (10% per frame) for seamless, natural acoustic transitions
    currentVolume += (targetVol - currentVolume) * 0.1;
    bgMusic.volume = Math.max(0.01, Math.min(1, currentVolume));

    // Dynamically scale the music equalizer bars on the header button based on live volume!
    if (musicWaves) {
      const volFraction = (currentVolume - MIN_SCROLL_VOL) / (BASE_MAX_VOL - MIN_SCROLL_VOL);
      const waveScale = Math.max(0.3, Math.min(1, 0.35 + volFraction * 0.65)).toFixed(2);
      musicWaves.style.setProperty('--wave-scale', waveScale);
    }
  }

  window.addEventListener('scroll', updateScrollVolume, { passive: true });

  // ==========================================================================
  // COUNTDOWN TIMER ENGINE (Target: November 14, 2026 00:00:00)
  // Safely clamped to 00:00:00:00 on/after November 14th without any error
  // ==========================================================================
  const targetDate = new Date(2026, 10, 14, 0, 0, 0).getTime(); // Month 10 = November

  function updateCountdown() {
    const now = Date.now();
    // Strictly clamped at 0 so it never goes negative and never throws any error
    const diff = Math.max(0, targetDate - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (timerDays) timerDays.textContent = String(days).padStart(2, '0');
    if (timerHours) timerHours.textContent = String(hours).padStart(2, '0');
    if (timerMinutes) timerMinutes.textContent = String(minutes).padStart(2, '0');
    if (timerSeconds) timerSeconds.textContent = String(seconds).padStart(2, '0');
  }

  // Run immediately and update every 1 second
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Unmuted Autoplay Engine with Instant Gesture Fallback & Fast Skip
  const introEnterBtn = document.getElementById('introEnterBtn');
  const introPlayHint = document.getElementById('introPlayHint');

  if (introEnterBtn) {
    introEnterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      enterHomePage(true);
    });
  }

  if (introVideo) {
    // 1. Enforce HTML5 autoplay standard: strictly muted on startup so no browser blocks playback!
    introVideo.muted = true;
    introVideo.defaultMuted = true;
    introVideo.volume = 0;
    introVideo.playsInline = true;
    introVideo.setAttribute('muted', '');
    introVideo.setAttribute('playsinline', '');
    introVideo.setAttribute('webkit-playsinline', '');

    const tryAutoplay = () => {
      introVideo.muted = true;
      const playPromise = introVideo.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Video autoplaying smoothly in muted mode');
          if (introPlayHint) introPlayHint.style.display = 'none';
        }).catch(err => {
          console.log('Autoplay deferred by browser policy; showing play hint:', err);
          if (introPlayHint) introPlayHint.style.display = 'flex';
          const gesturePlay = () => {
            introVideo.play().then(() => {
              if (introPlayHint) introPlayHint.style.display = 'none';
            }).catch(() => {});
            ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(ev =>
              window.removeEventListener(ev, gesturePlay)
            );
          };
          ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(ev =>
            window.addEventListener(ev, gesturePlay, { once: true, passive: true })
          );
        });
      }
    };

    tryAutoplay();

    // When video can play or metadata loads, try play if still paused
    introVideo.addEventListener('canplay', () => {
      if (introVideo.paused && !hasEntered) tryAutoplay();
    }, { once: true });

    introVideo.addEventListener('playing', () => {
      if (introPlayHint) introPlayHint.style.display = 'none';
    });

    // Tap anywhere on the intro landing overlay
    if (introOverlay) {
      introOverlay.addEventListener('click', (e) => {
        if (e.target && e.target.closest('#introEnterBtn')) return;
        if (introVideo.paused) {
          introVideo.play().then(() => {
            if (introPlayHint) introPlayHint.style.display = 'none';
          }).catch(() => {});
        } else {
          // Toggle mute/unmute
          introVideo.muted = !introVideo.muted;
          if (!introVideo.muted) {
            introVideo.volume = 0.9;
          }
        }
      });
    }

    if (introPlayHint) {
      introPlayHint.addEventListener('click', (e) => {
        e.stopPropagation();
        introVideo.play().then(() => {
          introPlayHint.style.display = 'none';
        }).catch(() => {});
      });
    }

    introVideo.addEventListener('timeupdate', () => {
      if (!introVideo.duration) return;
      const remaining = Math.max(0, Math.ceil(introVideo.duration - introVideo.currentTime));
      if (introCountdown) introCountdown.textContent = `Festival begins in ${remaining}s...`;
    });

    // Plays full video to the very end before transitioning
    introVideo.addEventListener('ended', () => {
      if (!hasEntered) enterHomePage(true);
    });

    // Failsafe ONLY if video file has fatal load error at start
    introVideo.addEventListener('error', () => {
      if (introVideo.currentTime === 0) {
        console.log('Video error encountered at start, falling back to home page');
        if (!hasEntered) enterHomePage(true);
      }
    });
  }

  function enterHomePage(withAudio = true) {
    if (hasEntered || !introOverlay) return;
    hasEntered = true;

    // 1. IMMEDIATELY pause and mute the landing page video & its BGM so it completely stops!
    if (introVideo) {
      try {
        introVideo.pause();
        introVideo.muted = true;
        introVideo.volume = 0;
        introVideo.currentTime = 0;
      } catch (err) {
        console.log('Error stopping intro video:', err);
      }
    }

    // 2. Trigger Slide-Up
    introOverlay.classList.add('slide-up');

    // 2.1 Now that user entered, ensure initial frames and start scroll sequence preloading immediately
    if (typeof startInitialFramesPreload === 'function') {
      startInitialFramesPreload();
    }
    if (typeof startScrollFramesPreload === 'function') {
      setTimeout(startScrollFramesPreload, 200);
    }

    // 3. Play unrolling whoosh SFX
    if (sfxScroll && isSoundEnabled) {
      sfxScroll.currentTime = 0;
      sfxScroll.play().catch(e => console.log('SFX error:', e));
    }

    // 4. Carry the real flute music smoothly through the whole website
    if (withAudio && isSoundEnabled && bgMusic) {
      updateScrollVolume();
      bgMusic.currentTime = 0;
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (audioToggle) {
            audioToggle.classList.add('active');
            audioToggle.classList.remove('muted');
            audioToggle.setAttribute('title', 'Sound: Playing (Click to Mute)');
          }
        }).catch(e => {
          console.log('Flute music autoplay prevented by mobile browser policy; arming gesture unlock:', e);
          if (audioToggle) {
            audioToggle.classList.remove('active');
            audioToggle.classList.add('muted');
            audioToggle.setAttribute('title', 'Sound: Click to Enable Music');
          }
          const unlockMainAudio = () => {
            if (isSoundEnabled && bgMusic && bgMusic.paused) {
              bgMusic.play().then(() => {
                if (audioToggle) {
                  audioToggle.classList.add('active');
                  audioToggle.classList.remove('muted');
                  audioToggle.setAttribute('title', 'Sound: Playing (Click to Mute)');
                }
              }).catch(() => {});
            }
            ['pointerdown', 'touchstart', 'scroll', 'click'].forEach(ev =>
              window.removeEventListener(ev, unlockMainAudio)
            );
          };
          ['pointerdown', 'touchstart', 'scroll', 'click'].forEach(ev =>
            window.addEventListener(ev, unlockMainAudio, { passive: true, once: true })
          );
        });
      }
    }
  }



  // Audio Toggle Button (Interactive Music Symbol)
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled) {
        updateScrollVolume();
        if (bgMusic) bgMusic.play().catch(e => console.log(e));
        audioToggle.classList.add('active');
        audioToggle.classList.remove('muted');
        audioToggle.setAttribute('title', 'Sound: Playing (Click to Mute)');
      } else {
        if (bgMusic) {
          bgMusic.pause();
          bgMusic.volume = 0;
        }
        audioToggle.classList.remove('active');
        audioToggle.classList.add('muted');
        audioToggle.setAttribute('title', 'Sound: Muted (Click to Unmute)');
      }
    });
  }

  // ==========================================================================
  // 2. DUAL-SET 3D ROTATING ROSE ENGINE
  // ==========================================================================
  const canvas = document.getElementById('roseCanvas');
  const ctx = canvas.getContext('2d');

  // Set 1: Initial Position Rotating Loop (55 frames from INITAIL_POSI_frames.zip)
  const TOTAL_INITIAL_FRAMES = 55;
  const initialImages = new Array(TOTAL_INITIAL_FRAMES);

  // Set 2: Scroll Multi-Angle Sequence (211 continuous frames from rose_rotating_frames.zip)
  const TOTAL_SCROLL_FRAMES = 239;
  const scrollImages = new Array(TOTAL_SCROLL_FRAMES);

  function getInitialFrameSrc(index) {
    const pad = String(index).padStart(3, '0');
    return `initial_frames_opt/frame_${pad}.jpg`;
  }

  function getScrollFrameSrc(index) {
    const pad = String(index).padStart(3, '0');
    return `rose_frames_opt/frame_${pad}.jpg`;
  }

  // Resize canvas to match screen resolution with DPR (Throttled for stability)
  let resizeTimeout = null;
  function resizeCanvas() {
    // Mobile DPR clamped to max 1.8 to prevent GPU thermal throttling & battery drain
    // PC DPR allows up to 2.0 for pristine high-DPI desktop rendering
    const maxDpr = window.isMobile ? 1.8 : 2.0;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    renderCurrentState();
  }

  window.addEventListener('resize', () => {
    syncDeviceClasses();
    if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
    resizeTimeout = requestAnimationFrame(resizeCanvas);
  }, { passive: true });

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      syncDeviceClasses();
      resizeCanvas();
    }, 120);
  }, { passive: true });

  // Draw image with object-fit: cover, centered cleanly for 9:16 mobile portrait & landscape PC
  function drawImageProp(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    
    ctx.clearRect(0, 0, cw, ch);

    const hRatio = cw / img.naturalWidth;
    const vRatio = ch / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);

    const nw = img.naturalWidth * ratio;
    const nh = img.naturalHeight * ratio;

    // Center framing ensures the rotating rose remains majestic and unobstructed
    const cx = (cw - nw) / 2;
    const cy = (ch - nh) / 2;

    ctx.drawImage(img, cx, cy, nw, nh);
  }

  // 1. Instant Priority Loading for Frame 1 (Paints rose in <100ms!)
  function loadFirstFrameImmediately() {
    const img = new Image();
    img.src = getInitialFrameSrc(1);
    img.onload = () => {
      initialImages[0] = img;
      renderCurrentState();
    };
  }

  // 2. Stream Initial Loop Frames in gentle batches (3 requests at a time, 40ms apart)
  function preloadInitialFrames() {
    loadFirstFrameImmediately();

    let cur = 2;
    function loadNextInitialChunk() {
      if (cur > TOTAL_INITIAL_FRAMES) return;
      const end = Math.min(TOTAL_INITIAL_FRAMES, cur + 3);
      for (let i = cur; i <= end; i++) {
        if (!initialImages[i - 1]) {
          const img = new Image();
          img.src = getInitialFrameSrc(i);
          img.onload = () => {
            initialImages[i - 1] = img;
          };
        }
      }
      cur = end + 1;
      setTimeout(loadNextInitialChunk, 40);
    }
    setTimeout(loadNextInitialChunk, 80);
  }

  // 3. Priority Keyframe-First Preload for Scroll Sequence (Anchor every 4th frame first for instant 60fps coverage!)
  function preloadScrollFrames() {
    // Stage 1: Load every 4th frame (60 frames total covering the entire 360° scrub with zero lag)
    const keyframes = [];
    for (let k = 1; k <= TOTAL_SCROLL_FRAMES; k += 4) {
      keyframes.push(k);
    }
    if (keyframes[keyframes.length - 1] !== TOTAL_SCROLL_FRAMES) {
      keyframes.push(TOTAL_SCROLL_FRAMES);
    }

    let kIdx = 0;
    function loadKeyframes() {
      if (kIdx >= keyframes.length) {
        setTimeout(loadRemainingScrollFrames, 100);
        return;
      }
      const chunk = keyframes.slice(kIdx, kIdx + 4);
      chunk.forEach(fNum => {
        if (!scrollImages[fNum - 1] && !loadingScrollFrames.has(fNum)) {
          loadingScrollFrames.add(fNum);
          const img = new Image();
          img.src = getScrollFrameSrc(fNum);
          img.onload = () => {
            scrollImages[fNum - 1] = img;
            loadingScrollFrames.delete(fNum);
          };
          img.onerror = () => {
            loadingScrollFrames.delete(fNum);
          };
        }
      });
      kIdx += chunk.length;
      setTimeout(loadKeyframes, 35);
    }
    loadKeyframes();

    // Stage 2: Fill in the remaining in-between frames smoothly
    let fillIdx = 1;
    function loadRemainingScrollFrames() {
      if (fillIdx > TOTAL_SCROLL_FRAMES) return;
      const end = Math.min(TOTAL_SCROLL_FRAMES, fillIdx + 4);
      for (let i = fillIdx; i <= end; i++) {
        if (!scrollImages[i - 1] && !loadingScrollFrames.has(i)) {
          loadingScrollFrames.add(i);
          const img = new Image();
          img.src = getScrollFrameSrc(i);
          img.onload = () => {
            scrollImages[i - 1] = img;
            loadingScrollFrames.delete(i);
          };
          img.onerror = () => {
            loadingScrollFrames.delete(i);
          };
        }
      }
      fillIdx = end + 1;
      setTimeout(loadRemainingScrollFrames, 35);
    }
  }

  // Defensive Frame Selector for Initial Idle Frames: Guarantees zero blank canvas during startup
  function getBestAvailableInitialFrame(targetIdx) {
    const idx = Math.min(TOTAL_INITIAL_FRAMES, Math.max(1, targetIdx));
    const exact = initialImages[idx - 1];
    if (exact && exact.complete && exact.naturalWidth > 0) return exact;

    // Expanding radial search: always return the closest loaded frame without directional bias
    const maxDelta = Math.max(idx - 1, TOTAL_INITIAL_FRAMES - idx);
    for (let delta = 1; delta <= maxDelta; delta++) {
      const prevIdx = idx - delta;
      if (prevIdx >= 1) {
        const f = initialImages[prevIdx - 1];
        if (f && f.complete && f.naturalWidth > 0) return f;
      }
      const nextIdx = idx + delta;
      if (nextIdx <= TOTAL_INITIAL_FRAMES) {
        const f = initialImages[nextIdx - 1];
        if (f && f.complete && f.naturalWidth > 0) return f;
      }
    }
    return null;
  }

  // Defensive Frame Selector for Scroll Frames: Guarantees zero blank frames or flickering during network latency or fast cellular scrolling
  function getBestAvailableScrollFrame(targetIdx) {
    const idx = Math.min(TOTAL_SCROLL_FRAMES, Math.max(1, targetIdx));
    // 1. Direct hit
    const exact = scrollImages[idx - 1];
    if (exact && exact.complete && exact.naturalWidth > 0) return exact;

    // 2. Expanding radial search: check nearest backward & forward concurrently by delta
    const maxDelta = Math.max(idx - 1, TOTAL_SCROLL_FRAMES - idx);
    for (let delta = 1; delta <= maxDelta; delta++) {
      const prevIdx = idx - delta;
      if (prevIdx >= 1) {
        const f = scrollImages[prevIdx - 1];
        if (f && f.complete && f.naturalWidth > 0) return f;
      }
      const nextIdx = idx + delta;
      if (nextIdx <= TOTAL_SCROLL_FRAMES) {
        const f = scrollImages[nextIdx - 1];
        if (f && f.complete && f.naturalWidth > 0) return f;
      }
    }

    // 3. Fallback to closest available initial frame if no scroll frame loaded yet
    return getBestAvailableInitialFrame(1) || null;
  }

  // State Management
  let isIdleRotating = true;
  let idleFrame = 1;
  let idleLastTime = 0;
  const IDLE_INTERVAL = 40; // 25 FPS for smooth continuous 360° spin

  let currentScrollIndex = 1;

  const loadingScrollFrames = new Set();

  function renderCurrentState() {
    if (isIdleRotating) {
      const img = getBestAvailableInitialFrame(idleFrame);
      if (img && img.complete) drawImageProp(img);
    } else {
      const idx = Math.min(TOTAL_SCROLL_FRAMES, Math.max(1, Math.round(currentScrollIndex)));
      
      // On-demand scrub priority with strict deduplication: NEVER fire multiple requests for the same frame
      if (!scrollImages[idx - 1] && !loadingScrollFrames.has(idx)) {
        loadingScrollFrames.add(idx);
        const reqImg = new Image();
        reqImg.src = getScrollFrameSrc(idx);
        reqImg.onload = () => {
          scrollImages[idx - 1] = reqImg;
          loadingScrollFrames.delete(idx);
          if (Math.round(currentScrollIndex) === idx) {
            drawImageProp(reqImg);
          }
        };
        reqImg.onerror = () => {
          loadingScrollFrames.delete(idx);
        };
      }

      const img = getBestAvailableScrollFrame(idx);
      if (img && img.complete) drawImageProp(img);
    }
  }

  // ==========================================================================
  // 3. MAIN RENDER LOOP: IDLE 360° LOOP VS SCROLL SCRUBBING
  // ==========================================================================
  function animate(now) {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    // Guard against massive frame skips if browser tab was backgrounded/minimized
    if (now - idleLastTime > 1000) {
      idleLastTime = now;
    }

    if (scrollY <= 30) {
      // -------------------------------------------------------------
      // NO INTERACTION (At Top of Page):
      // The rose rotates on a continuous 360° loop in initial position!
      // (Using the 55 frames from INITAIL_POSI_frames.zip)
      // -------------------------------------------------------------
      if (!isIdleRotating) {
        isIdleRotating = true;
      }

      if (now - idleLastTime > IDLE_INTERVAL) {
        idleLastTime = now;
        idleFrame++;
        if (idleFrame > TOTAL_INITIAL_FRAMES) {
          idleFrame = 1; // Seamless 360° infinite loop!
        }
      }

      const img = getBestAvailableInitialFrame(idleFrame);
      if (img && img.complete) {
        drawImageProp(img);
      }

    } else {
      // -------------------------------------------------------------
      // INTERACTION ACTIVE (User is Scrolling):
      // The scroll scrubs through the multi-angle cinematic sequence!
      // (Using the 239 frames from rose_rotating_frames.zip)
      // -------------------------------------------------------------
      if (isIdleRotating) {
        isIdleRotating = false;
      }

      const scrollProgress = Math.min(1, Math.max(0, (scrollY - 30) / (maxScroll - 30)));
      const targetIndex = Math.min(TOTAL_SCROLL_FRAMES, Math.max(1, 1 + scrollProgress * (TOTAL_SCROLL_FRAMES - 1)));

      // Damping lerp for fluid camera motion
      currentScrollIndex += (targetIndex - currentScrollIndex) * 0.2;

      const displayIdx = Math.min(TOTAL_SCROLL_FRAMES, Math.max(1, Math.round(currentScrollIndex)));
      const img = getBestAvailableScrollFrame(displayIdx);
      if (img && img.complete) {
        drawImageProp(img);
      }
    }

    // Dynamic scroll-volume modulation per frame
    updateScrollVolume();

    requestAnimationFrame(animate);
  }

  // Initialize Canvas & Rose Frames
  resizeCanvas();
  // CRITICAL PERFORMANCE: Only load Frame 1 immediately so canvas has its base graphic.
  // 55 initial frames will load AFTER entering site, and 211 scroll frames only when user scrolls!
  if (!initialImages[0]) {
    const f1 = new Image();
    f1.src = getInitialFrameSrc(1);
    f1.onload = () => {
      initialImages[0] = f1;
      drawImageProp(f1);
    };
  }

  // Proactive Background Preload State
  let initialPreloadStarted = false;
  let scrollPreloadStarted = false;

  function startInitialFramesPreload() {
    if (initialPreloadStarted) return;
    initialPreloadStarted = true;
    preloadInitialFrames();
  }

  function startScrollFramesPreload() {
    if (scrollPreloadStarted) return;
    scrollPreloadStarted = true;
    preloadScrollFrames();
  }

  // Preload all 7 event posters and idle frames immediately in background while user watches video!
  function preloadCoreMediaEarly() {
    const posters = [
      'assets/events/tech_pitch.jpg?v=15.0',
      'assets/events/pixel_riot.jpg?v=15.0',
      'assets/events/algo_x.jpg?v=15.0',
      'assets/events/free_fire.jpg?v=15.0',
      'assets/events/bgmi.jpg?v=15.0',
      'assets/events/chaos_league.jpg?v=16.0',
      'assets/events/clue_crew.jpg?v=15.0'
    ];
    posters.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Start loading initial 360 rotation frames so they are 100% ready when user enters!
    setTimeout(startInitialFramesPreload, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCoreMediaEarly);
  } else {
    preloadCoreMediaEarly();
  }

  // Start preloading scroll frames when user enters or begins scrolling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20 && !scrollPreloadStarted) {
      startScrollFramesPreload();
    }
  }, { passive: true });

  requestAnimationFrame(animate);

  // ==========================================================================
  // ==========================================================================
  // 4. SMALL DOSSIER SINGLE 360° SPIN & ROLLING SCROLL TRIGGER
  // ==========================================================================
  const dossierCards = document.querySelectorAll('.small-dossier-card');
  const scrollModalOverlay = document.getElementById('scrollModalOverlay');
  const scrollModalClose = document.getElementById('scrollModalClose');
  const btnRollUp = document.getElementById('btnRollUp');
  const modalEventTitle = document.getElementById('modalEventTitle');
  const modalEventTrack = document.getElementById('modalEventTrack');
  const modalEventTagline = document.getElementById('modalEventTagline');
  const modalEventPoster = document.getElementById('modalEventPoster');
  const modalRegisterBtn = document.getElementById('modalRegisterBtn');
  const modalRegisterBtnBottom = document.getElementById('modalRegisterBtnBottom');
  const modalEventBrief = document.getElementById('modalEventBrief');
  const modalEventRules = document.getElementById('modalEventRules');
  const modalEventTeam = document.getElementById('modalEventTeam');
  const modalEventVenue = document.getElementById('modalEventVenue');
  const regToast = document.getElementById('regToast');
  const regToastTitle = document.getElementById('regToastTitle');
  const regToastDesc = document.getElementById('regToastDesc');

  let activeModalEventId = null;
  let toastTimeout = null;

  const REGISTER_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc1TBUJL2m2uRvjUQfd7QB09_0FGB2AE5SF2bVWPWtgQ6NJ6Q/viewform";

  // Exact User-Provided Event Metadata (Strictly what the user specified, no invented fields)
  const DOSSIER_INFO = {
    'tech-pitch': {
      title: 'TECH PITCH',
      track: 'TECHNICAL ARENA // TRACK 01',
      tagline: 'Pitch Your Ideas, Inspire Innovation!',
      image: 'assets/events/tech_pitch.jpg',
      registerUrl: REGISTER_FORM_URL,
      description: `Tech Pitch is an exciting technical event that challenges participants to present innovative ideas, showcase creativity, and demonstrate their problem-solving and presentation skills. Think smart, pitch confidently, and turn your ideas into impact!`,
      rules: ''
    },
    'pixel-riot': {
      title: 'PIXEL RIOT',
      track: 'TECHNICAL ARENA // TRACK 02',
      image: 'assets/events/pixel_riot.jpg',
      registerUrl: REGISTER_FORM_URL,
      description: `PIXEL RIOT is a UI redesign competition where creativity meets code. Participants are challenged to transform poorly designed or flawed websites into visually appealing, responsive, and functional interfaces. Across fast-paced rounds, participants must identify issues, refine designs, fix errors, and showcase their problem-solving skills under time pressure.`,
      rules: ''
    },
    'algo-x': {
      title: 'ALGO X',
      track: 'TECHNICAL ARENA // TRACK 03',
      image: 'assets/events/algo_x.jpg?v=15.0',
      registerUrl: REGISTER_FORM_URL,
      description: `AlgoX is an algorithm optimization hackathon where logic meets code. Participants are challenged to design smart, efficient algorithms that solve a complex real-world style problem and squeeze out the best possible result. Across a fast-paced, time-bound round, teams must analyze the problem, choose and refine their approach, optimize their solution, and prove their problem-solving skills under pressure.

The best algorithm doesn’t just work, it wins. Solutions are scored automatically, so every improvement moves you up the leaderboard.`,
      rules: ''
    },
    'free-fire': {
      title: 'FREE FIRE',
      track: 'NON-TECHNICAL CONCLAVE // TRACK 01',
      image: 'assets/events/free_fire.jpg?v=15.0',
      registerUrl: REGISTER_FORM_URL,
      description: '',
      rules: `FREE FIRE TOURNAMENT: MAIN RULES

1. Stage 1 is Battle Royale in Pure Esports Mode.
2. Gun attributes OFF, character skills ON, vehicles allowed.
3. Both Android and iOS devices are allowed.
4. Qualified teams will move to Clash Squad (15 rounds, best of 3).
5. No hacks, no macros, and no high sensitivity on iOS devices.
6. Devices will be checked, and violations may lead to disqualification.`
    },
    'bgmi': {
      title: 'BGMI',
      track: 'NON-TECHNICAL CONCLAVE // TRACK 02',
      image: 'assets/events/bgmi.jpg?v=15.0',
      registerUrl: REGISTER_FORM_URL,
      description: '',
      rules: `1. Erangle and livik matchs.
2. In tdm no slides and no level 3 vest and no awm.
3. Both Android and iOS devices are allowed.
4. Qualified teams will move to tdm .
5. Devices will be checked, and violations may lead to disqualification.`
    },
    'pubg': {
      title: 'BGMI',
      track: 'NON-TECHNICAL CONCLAVE // TRACK 02',
      image: 'assets/events/bgmi.jpg?v=15.0',
      registerUrl: REGISTER_FORM_URL,
      description: '',
      rules: `1. Erangle and livik matchs.
2. In tdm no slides and no level 3 vest and no awm.
3. Both Android and iOS devices are allowed.
4. Qualified teams will move to tdm .
5. Devices will be checked, and violations may lead to disqualification.`
    },
    'chaos-league': {
      title: 'CHAOS LEAGUE',
      track: 'NON-TECHNICAL CONCLAVE // TRACK 03',
      image: 'assets/events/chaos_league.jpg?v=16.0',
      registerUrl: REGISTER_FORM_URL,
      description: `Chaos League is an exciting team-based game where three members come together to challenge their teamwork and abilities. It takes trust, coordination, smart thinking, and quick decision-making to overcome unexpected challenges. Work together, think creatively, and act fast to stay ahead of the chaos. Remember, victory isn't just about individual skills but how well your team plays together!`,
      rules: ''
    },
    'clue-crew': {
      title: 'CLUE CREW',
      track: 'NON-TECHNICAL CONCLAVE // TRACK 04',
      tagline: 'Think Smart, Guess Fast, Win Big!',
      image: 'assets/events/clue_crew.jpg',
      registerUrl: REGISTER_FORM_URL,
      description: `Clue Crew is an exciting non-technical team event that tests your communication skills, quick thinking, creativity, teamwork and IQ. Get ready to face three thrilling rounds filled with guessing, fun challenges and mind-bending puzzles!`,
      rules: `Basic Rules & Rounds
Team Formation
- Each team must consist of 3 members.
- The event consists of 3 exciting rounds.`
    }
  };

  // Toast Notification for Registration
  function showRegistrationNotice(title, customMsg) {
    if (!regToast) return;
    if (toastTimeout) clearTimeout(toastTimeout);

    if (regToastTitle) regToastTitle.textContent = `✦ REGISTRATION: ${title} ✦`;
    if (regToastDesc) {
      regToastDesc.textContent = customMsg || `Official registration form for ${title} will be linked shortly by organizers. Prepare your squad!`;
    }

    regToast.classList.add('active');
    toastTimeout = setTimeout(() => {
      regToast.classList.remove('active');
    }, 4500);
  }

  // Unified Registration Handler
  function handleEventRegistration(eventId, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const data = DOSSIER_INFO[eventId];
    const url = (data && data.registerUrl) ? data.registerUrl : REGISTER_FORM_URL;
    window.open(url, '_blank', 'noopener');
  }

  function openRollingScroll(eventId) {
    const data = DOSSIER_INFO[eventId];
    if (!data || !scrollModalOverlay) return;

    activeModalEventId = eventId;

    if (modalEventTitle) modalEventTitle.textContent = data.title;
    if (modalEventTrack) modalEventTrack.textContent = data.track || '';

    if (modalEventTagline) {
      if (data.tagline) {
        modalEventTagline.textContent = data.tagline;
        modalEventTagline.style.display = 'block';
      } else {
        modalEventTagline.textContent = '';
        modalEventTagline.style.display = 'none';
      }
    }

    if (modalEventPoster) {
      modalEventPoster.src = (data.image ? data.image.split('?')[0] : '') + '?v=' + Date.now();
      modalEventPoster.alt = `${data.title} Official Poster`;
    }

    if (modalRegisterBtn) {
      modalRegisterBtn.setAttribute('data-event-id', eventId);
      modalRegisterBtn.href = data.registerUrl || REGISTER_FORM_URL;
    }
    if (modalRegisterBtnBottom) {
      modalRegisterBtnBottom.setAttribute('data-event-id', eventId);
      modalRegisterBtnBottom.href = data.registerUrl || REGISTER_FORM_URL;
    }

    // Dynamic Render of Modal Body: Strictly Only What the User Specified
    const bodyContainer = document.getElementById('modalDossierBody');
    if (bodyContainer) {
      bodyContainer.innerHTML = '';

      let hasContent = false;

      // 1. Description (if given by user)
      if (data.description && data.description.trim()) {
        hasContent = true;
        const descSection = document.createElement('div');
        descSection.className = 'blank-dossier-section';
        const titleBar = document.createElement('div');
        titleBar.className = 'blank-section-title-bar';
        titleBar.innerHTML = '<span class="section-bullet">❖</span><h5>EVENT BRIEF</h5>';
        const box = document.createElement('div');
        box.className = 'blank-dossier-box';
        const p = document.createElement('p');
        p.className = 'blank-desc';
        p.textContent = data.description;
        box.appendChild(p);
        descSection.appendChild(titleBar);
        descSection.appendChild(box);
        bodyContainer.appendChild(descSection);
      }

      // 2. Rules (if given by user)
      if (data.rules && data.rules.trim()) {
        hasContent = true;
        const rulesSection = document.createElement('div');
        rulesSection.className = 'blank-dossier-section';
        const titleBar = document.createElement('div');
        titleBar.className = 'blank-section-title-bar';
        titleBar.innerHTML = '<span class="section-bullet">❖</span><h5>RULES &amp; ROUNDS</h5>';
        const box = document.createElement('div');
        box.className = 'blank-dossier-box';
        const p = document.createElement('p');
        p.className = 'blank-desc';
        p.textContent = data.rules;
        box.appendChild(p);
        rulesSection.appendChild(titleBar);
        rulesSection.appendChild(box);
        bodyContainer.appendChild(rulesSection);
      }

      // 3. Fallback for events with info pending (Tech Pitch, Algo X)
      if (!hasContent) {
        const pendingBox = document.createElement('div');
        pendingBox.className = 'blank-dossier-section';
        pendingBox.innerHTML = `
          <div class="blank-dossier-box" style="text-align: center; padding: 18px 12px;">
            <p class="blank-desc" style="font-style: italic; color: #7a4b24;">[ Details and rules will be updated shortly by organizers ]</p>
          </div>
        `;
        bodyContainer.appendChild(pendingBox);
      }
    }

    // Reset parchment sheet scroll position to top
    const sheet = scrollModalOverlay.querySelector('.scroll-parchment-sheet');
    if (sheet) sheet.scrollTop = 0;

    scrollModalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeRollingScroll() {
    if (scrollModalOverlay) {
      scrollModalOverlay.classList.remove('active');
      document.body.classList.remove('modal-open');
      if (sfxScroll && isSoundEnabled) {
        try {
          sfxScroll.currentTime = 0;
          sfxScroll.play().catch(() => {});
        } catch (e) {}
      }
    }
  }

  // Prevent background touch scrolling on mobile while modal is open
  if (scrollModalOverlay) {
    scrollModalOverlay.addEventListener('touchmove', (e) => {
      if (!e.target.closest('.scroll-parchment-sheet')) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // Handle Dossier Card Press: Rotates ONCE in 3D, Plays SFX, then Unrolls Rolling Scroll
  dossierCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If click was on the direct register button, let register handler deal with it
      if (e.target.closest('.btn-dossier-register')) return;

      const eventId = card.getAttribute('data-event-id');

      // 1. Trigger the single 360° spin
      card.classList.remove('is-spinning');
      void card.offsetWidth; // Force reflow to re-trigger keyframe
      card.classList.add('is-spinning');

      // 2. Play Rolling Scroll SFX
      if (sfxScroll && isSoundEnabled) {
        try {
          sfxScroll.currentTime = 0;
          sfxScroll.play().catch(err => console.log('SFX play error:', err));
        } catch (err) {}
      }

      // 3. Unroll Rolling Scroll after a brief 220ms rotation
      setTimeout(() => {
        openRollingScroll(eventId);
      }, 220);

      // 4. Remove spin class after animation completes so it can spin again
      setTimeout(() => {
        card.classList.remove('is-spinning');
      }, 500);
    });

    // Dedicated Register Button on the card
    const cardRegBtn = card.querySelector('.btn-dossier-register');
    if (cardRegBtn) {
      cardRegBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const eventId = cardRegBtn.getAttribute('data-event-id') || card.getAttribute('data-event-id');
        handleEventRegistration(eventId, e);
      });
    }
  });

  // Modal Register Buttons
  if (modalRegisterBtn) {
    modalRegisterBtn.addEventListener('click', (e) => {
      const eventId = modalRegisterBtn.getAttribute('data-event-id') || activeModalEventId;
      handleEventRegistration(eventId, e);
    });
  }

  if (modalRegisterBtnBottom) {
    modalRegisterBtnBottom.addEventListener('click', (e) => {
      const eventId = modalRegisterBtnBottom.getAttribute('data-event-id') || activeModalEventId;
      handleEventRegistration(eventId, e);
    });
  }

  // Close Rolling Scroll Event Listeners
  if (scrollModalClose) {
    scrollModalClose.addEventListener('click', closeRollingScroll);
  }

  if (btnRollUp) {
    btnRollUp.addEventListener('click', closeRollingScroll);
  }

  if (scrollModalOverlay) {
    scrollModalOverlay.addEventListener('click', (e) => {
      if (e.target === scrollModalOverlay) {
        closeRollingScroll();
      }
    });
  }

  // ESC key to close rolling scroll
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && scrollModalOverlay && scrollModalOverlay.classList.contains('active')) {
      closeRollingScroll();
    }
  });

}



// Initialize application reliably regardless of readyState
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApplication);
  } else {
    initApplication();
  }
}

