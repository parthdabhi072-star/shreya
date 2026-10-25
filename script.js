/* =========================================================
   SHREYAA — BIRTHDAY EXPERIENCE INTERACTIONS
   ========================================================= */
(() => {
  "use strict";

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const intro = $("#introOverlay");
  const enterButton = $("#enterExperience");
  const loader = $("#introOverlay");
  const audio = $("#birthdayAudio");
  const musicToggle = $("#musicToggle");
  const musicLabel = $("#musicLabel");
  const menuToggle = $("#menuToggle");
  const nav = $("#siteNav");
  const header = $("#siteHeader");
  const toast = $("#toastMessage");
  const backToTop = $("#backToTop");
  const makeWishButton = $("#makeWishButton");
  const candleFlame = $("#candleFlame");
  const wishResult = $("#wishResult");
  const revealButton = $("#revealSurprise");
  const surpriseMessage = $("#surpriseMessage");

  let toastTimer = null;
  let wishCount = 0;

  // Enter the experience with a short, graceful transition.
  function enterExperience() {
    if (!intro) return;
    intro.classList.add("is-hidden");
    document.body.classList.remove("no-scroll");
    createBurst(window.innerWidth * 0.5, window.innerHeight * 0.5, 24);
    showToast("Welcome to your little birthday universe, Shreyaa ♡");
  }
  enterButton?.addEventListener("click", enterExperience);

  // Respect people who prefer reduced motion; otherwise create subtle loops.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function createParticles() {
    const layer = $("#particleLayer");
    const hearts = $("#floatingHearts");
    if (!layer || !hearts || reducedMotion) return;

    const symbols = ["✧", "✦", "·", "✣", "⋆"];
    for (let i = 0; i < 28; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.setProperty("--duration", `${9 + Math.random() * 13}s`);
      particle.style.setProperty("--delay", `${-Math.random() * 20}s`);
      particle.style.setProperty("--drift", `${Math.round(Math.random() * 100 - 50)}px`);
      particle.style.fontSize = `${8 + Math.random() * 13}px`;
      layer.appendChild(particle);
    }

    for (let i = 0; i < 12; i++) {
      const heart = document.createElement("span");
      heart.className = "floating-heart";
      heart.textContent = Math.random() > 0.5 ? "♡" : "♥";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.setProperty("--duration", `${12 + Math.random() * 12}s`);
      heart.style.setProperty("--delay", `${-Math.random() * 22}s`);
      heart.style.setProperty("--drift", `${Math.round(Math.random() * 90 - 45)}px`);
      heart.style.setProperty("--size", `${10 + Math.random() * 15}px`);
      hearts.appendChild(heart);
    }
  }

  function createBurst(x, y, amount = 18) {
    if (reducedMotion) return;
    const symbols = ["♡", "✦", "✧", "♥", "·"];
    for (let i = 0; i < amount; i++) {
      const bit = document.createElement("span");
      bit.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      Object.assign(bit.style, {
        position: "fixed",
        zIndex: "6000",
        left: `${x}px`,
        top: `${y}px`,
        pointerEvents: "none",
        color: Math.random() > 0.5 ? "#e9c98d" : "#f2a9c5",
        fontSize: `${10 + Math.random() * 16}px`,
        transition: "transform 1.1s cubic-bezier(.15,.75,.2,1), opacity 1.1s ease",
        opacity: "1"
      });
      document.body.appendChild(bit);
      const angle = (Math.PI * 2 * i) / amount;
      const distance = 45 + Math.random() * 115;
      requestAnimationFrame(() => {
        bit.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${Math.random() * 180}deg)`;
        bit.style.opacity = "0";
      });
      window.setTimeout(() => bit.remove(), 1250);
    }
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
  }

  // Optional background music. Browsers require a user gesture before playback.
  async function toggleMusic() {
    if (!audio || !musicToggle) return;
    if (audio.paused) {
      try {
        await audio.play();
        musicToggle.classList.add("is-playing");
        musicToggle.setAttribute("aria-pressed", "true");
        musicToggle.setAttribute("aria-label", "Pause birthday music");
        if (musicLabel) musicLabel.textContent = "MUSIC ON";
      } catch {
        showToast("Add your own song at assets/music/birthday-song.mp3 first.");
        return;
      }
    } else {
      audio.pause();
      musicToggle.classList.remove("is-playing");
      musicToggle.setAttribute("aria-pressed", "false");
      musicToggle.setAttribute("aria-label", "Play birthday music");
      if (musicLabel) musicLabel.textContent = "MUSIC OFF";
    }
  }
  musicToggle?.addEventListener("click", toggleMusic);

  // Mobile navigation.
  function closeMenu() {
    nav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation menu");
  }
  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    nav?.classList.toggle("open", open);
  });
  $$(".nav-link").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  // Sticky header and back-to-top visibility.
  function onScroll() {
    const scrolled = window.scrollY > 35;
    header?.classList.toggle("scrolled", scrolled);
    backToTop?.classList.toggle("visible", window.scrollY > 550);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));

  // Reveal sections on scroll; gracefully show all if IntersectionObserver is unavailable.
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Navigation active state based on the current section.
  const sections = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$(".nav-link").forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Live clock: a small "enjoy the present" feature, not a countdown to a guessed birthday.
  function updateClock() {
    const now = new Date();
    const values = {
      clockHours: String(now.getHours()).padStart(2, "0"),
      clockMinutes: String(now.getMinutes()).padStart(2, "0"),
      clockSeconds: String(now.getSeconds()).padStart(2, "0")
    };
    Object.entries(values).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }
  updateClock();
  window.setInterval(updateClock, 1000);

  // Birthday wish button: extinguishes the candle, then relights it after a moment.
  makeWishButton?.addEventListener("click", event => {
    wishCount += 1;
    candleFlame?.classList.add("is-out");
    const messages = [
      "May a beautiful wish find its way to you. ♡",
      "A fresh wish, a fresh beginning. Keep shining! ✧",
      "May this year bring you plenty of happy surprises. ♥",
      "Your next chapter can be full of wonderful things. ✨"
    ];
    if (wishResult) wishResult.textContent = messages[(wishCount - 1) % messages.length];
    const rect = event.currentTarget.getBoundingClientRect();
    createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);
    showToast("Wish made. Keep a little magic in your day. ♡");
    window.setTimeout(() => candleFlame?.classList.remove("is-out"), 2600);
  });

  // Surprise reveal.
  revealButton?.addEventListener("click", event => {
    if (surpriseMessage) {
      surpriseMessage.hidden = false;
      revealButton.textContent = "YOUR MESSAGE IS UNLOCKED ♡";
      revealButton.setAttribute("aria-expanded", "true");
      const rect = event.currentTarget.getBoundingClientRect();
      createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 34);
      surpriseMessage.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    }
  });

  // Gentle click sparkle on the main page, excluding controls and links.
  document.addEventListener("click", event => {
    if (reducedMotion) return;
    if (event.target.closest("a, button, input, textarea, select")) return;
    createBurst(event.clientX, event.clientY, 7);
  });

  // Keep the audio UI accurate if playback ends or is interrupted.
  audio?.addEventListener("pause", () => {
    musicToggle?.classList.remove("is-playing");
    musicToggle?.setAttribute("aria-pressed", "false");
    if (musicLabel) musicLabel.textContent = "MUSIC OFF";
  });
  audio?.addEventListener("play", () => {
    musicToggle?.classList.add("is-playing");
    musicToggle?.setAttribute("aria-pressed", "true");
    if (musicLabel) musicLabel.textContent = "MUSIC ON";
  });

  createParticles();
})();
