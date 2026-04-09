let achievements = [];
let currentCategory = "All";

// 📡 Charger depuis backend
async function loadAchievements() {
  const res = await fetch("/api/achievements");
  achievements = await res.json();

  renderCategories();
  renderAchievements();
  updateProgress();
}

// 📊 Progression
function updateProgress() {
  const total = achievements.length;
  const unlocked = achievements.filter(a => a.unlocked).length;
  const percent = Math.round((unlocked / total) * 100);

  document.getElementById("progress-fill").style.width = percent + "%";
  document.getElementById("progress-text").innerText = percent + "% complété";
}

// 📂 Catégories
function renderCategories() {
  const container = document.getElementById("categories");
  container.innerHTML = "";

  const cats = ["All", ...new Set(achievements.map(a => a.category))];

  cats.forEach(cat => {
    const div = document.createElement("div");
    div.className = "category " + (cat === currentCategory ? "active" : "");
    div.innerText = cat;

    div.onclick = () => {
      currentCategory = cat;
      renderAchievements();
      renderCategories();
    };

    container.appendChild(div);
  });
}

// 🎨 Render
function renderAchievements() {
  const container = document.getElementById("achievements");
  container.innerHTML = "";

  achievements
    .filter(a => currentCategory === "All" || a.category === currentCategory)
    .forEach(a => {
      const card = document.createElement("div");
      card.className = "card " + (a.unlocked ? "unlocked" : "locked");

      card.innerHTML = `
        <h3>${a.title}</h3>
        <p>${a.description}</p>
        <button onclick="unlock('${a.id}')">
          ${a.unlocked ? "✔ Débloqué" : "Débloquer"}
        </button>
      `;

      container.appendChild(card);
    });
}

// 🔓 Débloquer via backend
async function unlock(id) {
  await fetch("/api/unlock/" + id, { method: "POST" });
  loadAchievements();
}

// 🤖 Conditions automatiques (exemple simple)
function autoCheck() {
  achievements.forEach(a => {
    if (a.id === "sport" && !a.unlocked) {
      // exemple fake (à remplacer par vrai capteur)
      if (Math.random() > 0.95) unlock(a.id);
    }
  });
}

// ⏱️ Vérification auto
setInterval(autoCheck, 5000);

// 🚀 Init
loadAchievements();