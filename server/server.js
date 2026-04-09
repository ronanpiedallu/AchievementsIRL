const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("../public"));

const DATA_FILE = "./data.json";

// 📥 Lire données
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// 💾 Sauvegarder
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 📦 GET achievements
app.get("/api/achievements", (req, res) => {
  res.json(readData());
});

// 🔓 Débloquer
app.post("/api/unlock/:id", (req, res) => {
  const data = readData();
  const ach = data.find(a => a.id === req.params.id);

  if (ach && !ach.unlocked) {
    ach.unlocked = true;
    writeData(data);
  }

  res.json(data);
});

app.listen(3000, () => console.log("🚀 Serveur lancé sur http://localhost:3000"));