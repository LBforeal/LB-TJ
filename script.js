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
    downloadCurrent.href = src;
    playerTitle.textContent = card.querySelector("h3").textContent;
    progress.value = 0;
    timeLabel.textContent = "00:00";
  }
  audio.play().catch(() => {});
};

// Play button handlers
playButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.currentTarget.closest(".track-card");
    setTrack(card);
  });
});

// Play/pause toggle
playToggle.addEventListener("click", () => {
  if (!audio.src) return;
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

// Update play button icon
audio.addEventListener("play", () => {
  playToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
  visualizer.classList.add("playing");
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(syncProgress);
});

audio.addEventListener("pause", () => {
  playToggle.innerHTML = '<i class="fa-solid fa-play"></i>';
  visualizer.classList.remove("playing");
  cancelAnimationFrame(raf);
});

audio.addEventListener("timeupdate", () => {
  const value = (audio.currentTime / audio.duration) * 100 || 0;
  progress.value = value;
  timeLabel.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  playToggle.innerHTML = '<i class="fa-solid fa-play"></i>';
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

// CONTACT FORM
document.querySelector(".contact-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Message sent. We'll get back to you soon.");
});

// Initialize defaults
audio.volume = volume.value;
downloadCurrent.href = "";
