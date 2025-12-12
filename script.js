// CINEMATIC INTRO
const cinematicIntro = document.getElementById("cinematic-intro");
const skipIntro = document.getElementById("skip-intro");
const introName = document.getElementById("intro-name");
const introTagline = document.getElementById("intro-tagline");

let introSkipped = false;

const hideIntro = () => {
  if (introSkipped) return;
  introSkipped = true;
  cinematicIntro.classList.add("hide");
  setTimeout(() => {
    cinematicIntro.style.display = "none";
  }, 1000);
};

// Auto-hide intro after 4 seconds
setTimeout(() => {
  hideIntro();
}, 4000);

// Skip button
skipIntro?.addEventListener("click", () => {
  hideIntro();
});

// AUDIO PLAYER
const body = document.body;
const playButtons = document.querySelectorAll(".track-card .play-btn, .track-card .play-inline");
const playerTitle = document.querySelector(".player-title");
const playToggle = document.getElementById("play-toggle");
const progress = document.getElementById("progress");
const timeLabel = document.getElementById("time");
const volume = document.getElementById("volume");
const downloadCurrent = document.getElementById("download-current");
const audio = document.getElementById("audio");
const visualizer = document.querySelector(".visualizer");
const backToTop = document.querySelector(".back-to-top");

let currentSrc = "";
let raf;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60) || 0;
  const secs = Math.floor(seconds % 60) || 0;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const setTrack = (card) => {
  const src = card.dataset.src;
  if (src !== currentSrc) {
    currentSrc = src;
    audio.src = src;
    if (downloadCurrent) downloadCurrent.href = src;
    const titleElement = card.querySelector("h3");
    if (playerTitle && titleElement) playerTitle.textContent = titleElement.textContent;
    if (progress) progress.value = 0;
    if (timeLabel) timeLabel.textContent = "00:00";
  }
  audio.play().catch((err) => {
    console.error("Error playing audio:", err);
  });
};

// Play button handlers
playButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const card = e.currentTarget.closest(".track-card");
    if (card) {
      setTrack(card);
    }
  });
});

// Play/pause toggle
playToggle?.addEventListener("click", (e) => {
  e.preventDefault();
  if (!audio.src) return;
  if (audio.paused) {
    audio.play().catch((err) => {
      console.error("Error playing audio:", err);
    });
  } else {
    audio.pause();
  }
});

// Update visualizer (keep microphone icon on button)
audio.addEventListener("play", () => {
  visualizer.classList.add("playing");
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(syncProgress);
});

audio.addEventListener("pause", () => {
  visualizer.classList.remove("playing");
  cancelAnimationFrame(raf);
});

audio.addEventListener("timeupdate", () => {
  const value = (audio.currentTime / audio.duration) * 100 || 0;
  progress.value = value;
  timeLabel.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  visualizer.classList.remove("playing");
  progress.value = 0;
  timeLabel.textContent = "00:00";
});

// Progress seek
progress.addEventListener("input", () => {
  if (!audio.duration) return;
  const seek = (progress.value / 100) * audio.duration;
  audio.currentTime = seek;
});

// Volume control
volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

const syncProgress = () => {
  const value = (audio.currentTime / audio.duration) * 100 || 0;
  progress.value = value;
  timeLabel.textContent = formatTime(audio.currentTime);
  if (!audio.paused) {
    raf = requestAnimationFrame(syncProgress);
  }
};

// DUAL DOWNLOAD LINKS
document.querySelectorAll(".download").forEach((link) => {
  link.addEventListener("click", (e) => {
    const card = e.currentTarget.closest(".track-card");
    const type = e.currentTarget.dataset.type;
    const url = type === "vocal" ? card.dataset.vocal : card.dataset.instrumental;
    if (url) {
      e.currentTarget.href = url;
      e.currentTarget.download = `${card.querySelector("h3").textContent}_${type}.mp3`;
    }
  });
});

// SMOOTH SCROLL
document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// BACK TO TOP
window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// MOBILE MENU
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuToggle?.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

// Close mobile menu when clicking a link
mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (mobileMenu && mobileMenu.classList.contains("active")) {
    if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      mobileMenu.classList.remove("active");
    }
  }
});

// CONTACT FORM
document.querySelector(".contact-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const collabInput = document.getElementById("collab");
  const messageInput = document.getElementById("message");
  
  const name = nameInput?.value.trim();
  const email = emailInput?.value.trim();
  const collab = collabInput?.value.trim();
  const message = messageInput?.value.trim();
  
  // Validation
  if (!name || !email || !collab || !message) {
    alert("Please fill in all required fields.");
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    emailInput?.focus();
    return;
  }
  
  // Create mailto link (for GitHub Pages compatibility)
  const subject = encodeURIComponent(`Collaboration Request: ${collab}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nType: ${collab}\n\nMessage:\n${message}`);
  window.location.href = `mailto:contact@purefusion.com?subject=${subject}&body=${body}`;
  
  // Reset form after a short delay
  setTimeout(() => {
    e.target.reset();
  }, 100);
});

// Image lazy loading enhancement
document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });
    img.addEventListener('error', () => {
      img.classList.add('loaded');
    });
  }
});

// Initialize defaults
if (audio && volume) audio.volume = volume.value;
if (downloadCurrent) downloadCurrent.href = "";

