// ====== 1. SUPABASE CONFIG (paste your own values) ======
const SUPABASE_URL = "https://jtbcfjfxxumvgpkdsula.supabase.co";
const SUPABASE_KEY = "sb_publishable_nTNdOCts3NOmrx4cxjTKcQ_zJeReadE";
// Never paste the service_role / secret key here: this file is public.

const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ====== 2. CURTAIN + MUSIC ======
const music = $("music");
const musicBtn = $("musicBtn");

music.querySelector("source").addEventListener("error", () => {
  musicBtn.hidden = true; // no music.mp3 in the repo: hide the button
});

$("openBtn").addEventListener("click", () => {
  $("curtain").classList.add("open");
  confetti(45);

  // Matasuegras: suena una vez al abrir el telón
  const horn = $("espantasuegras");
  horn.currentTime = 0;
  horn.play().catch((err) => console.log("Horn blocked:", err));

  // Música de fondo (un poco más baja para que se oiga el matasuegras)
  music.volume = 0.6;
  music.play().then(() => {
    musicBtn.hidden = false;
    musicBtn.textContent = "🎵 Pause music";
  }).catch(() => {
    if (music.querySelector("source")) musicBtn.hidden = false;
  });

  setTimeout(() => { $("curtain").style.display = "none"; }, 2000);
});
musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicBtn.textContent = "🎵 Pause music";
  } else {
    music.pause();
    musicBtn.textContent = "🎵 Play music";
  }
});

// ====== 3. CONFETTI ======
function confetti(n = 30) {
  if (reduceMotion) return;
  const bits = ["♥", "♦", "✦", "♠", "★"];
  const colors = ["#ff5c8a", "#c4143a", "#ffd6e2", "#f2c46d"];
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = "bit";
    s.textContent = bits[Math.floor(Math.random() * bits.length)];
    s.style.left = Math.random() * 100 + "vw";
    s.style.color = colors[Math.floor(Math.random() * colors.length)];
    s.style.fontSize = 14 + Math.random() * 20 + "px";
    s.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
    s.style.animationDelay = Math.random() * 0.6 + "s";
    s.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 6000);
  }
}

// ====== 4. GUESTBOOK (Supabase) ======
const configured = !SUPABASE_URL.startsWith("PASTE") && !SUPABASE_KEY.startsWith("PASTE");
let db = null;

const msgBox = $("wishMsg");
const status = $("formStatus");

msgBox.addEventListener("input", () => {
  $("count").textContent = msgBox.value.length + " / 500";
});

function renderWishes(rows) {
  const list = $("wishList");
  list.textContent = "";
  if (!rows.length) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "No wishes yet. Be the first one!";
    list.appendChild(p);
    return;
  }
  rows.forEach((row) => {
    const box = document.createElement("div");
    box.className = "wish";
    box.textContent = row.message; // textContent: no HTML injection
    const t = document.createElement("time");
    t.dateTime = row.created_at;
    t.textContent = new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    box.appendChild(t);
    list.appendChild(box);
  });
}

async function loadWishes() {
  const { data, error } = await db
    .from("wishes")
    .select("message, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("Load wishes error:", error);
    status.textContent = "Couldn't load the wishes. Try refreshing the page.";
    return;
  }
  renderWishes(data);
}

window.addEventListener("DOMContentLoaded", () => {
  if (!window.supabase) console.error("Supabase library did not load (check internet / CDN script tag).");
  if (!configured || !window.supabase) {
    status.textContent = "Wishes aren't connected yet. Add your Supabase URL and key in script.js.";
    $("sendBtn").disabled = true;
    return;
  }
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  loadWishes();
});

$("wishForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!db) return;
  const message = msgBox.value.trim();
  if (!message) return;

  // simple spam brake: one wish every 30 seconds per browser
  const last = Number(localStorage.getItem("lastWish") || 0);
  if (Date.now() - last < 30000) {
    status.textContent = "Easy there! Wait a few seconds before sending another wish.";
    return;
  }

  $("sendBtn").disabled = true;
  status.textContent = "Sending...";
  const { error } = await db.from("wishes").insert({ message });
  $("sendBtn").disabled = false;

  if (error) {
    console.error("Send wish error:", error);
    status.textContent = "Your wish didn't send. Please try again.";
    return;
  }
  localStorage.setItem("lastWish", String(Date.now()));
  msgBox.value = "";
  $("count").textContent = "0 / 500";
  status.textContent = "Wish sent! ✨";
  confetti(20);
  loadWishes();
});
