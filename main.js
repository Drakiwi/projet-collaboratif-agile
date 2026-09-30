// Projet "Attribue ta place"
// Écrit par Antoine (Lead Dev) le 30/09/2026
// 1=gérer la salle   2=coller les élèves   3=tirer les places   4=sauvegarder

let room = { rows: 4, cols: 6, unavailable: [] };
let students = [];
let plan = [];

function render() {
  renderGrid();
}

function renderGrid() {
  const grille = document.getElementById("seats-grid");
  if (!grille) return;

  grille.innerHTML = "";

  for (let r = 1; r <= room.rows; r++) {
    const ligne = document.createElement("div");
    ligne.className = "flex gap-2 mb-2";

    for (let c = 1; c <= room.cols; c++) {
      const id = "R" + r + "-C" + c;

      const place = document.createElement("div");
      place.className = "w-16 h-10 border rounded flex items-center justify-center text-xs";
      place.textContent = id;

      if (room.unavailable.includes(id)) {
        place.textContent = "X";
        place.className = place.className + " bg-gray-200";
      }

      place.addEventListener("click", function () {
        toggleSeat(id);
      });

      ligne.appendChild(place);
    }
    grille.appendChild(ligne);
  }
}

function parseStudents(texte) {
  return texte
    .split("\n")
    .map(function (nom) { return nom.trim(); })
    .filter(function (nom) { return nom !== ""; });
}

function drawPlan() {
  const melanges = students.slice();
  melanges.sort(function () { return Math.random() - 0.5; });

  plan = [];
  for (let i = 0; i < melanges.length; i++) {
    plan.push({ seat: "R" + (i + 1) + "-C1", name: melanges[i] });
  }

  render();
}

function toggleSeat(id) {
  const i = room.unavailable.indexOf(id);

  if (i === -1) {
    room.unavailable.push(id);
  } else {
    room.unavailable.splice(i, 1);
  }

  save();
  render();
}

function save() {
  localStorage.setItem(
    "attribue-ta-place",
    JSON.stringify({ room: room, students: students, plan: plan })
  );
}

document.addEventListener("DOMContentLoaded", function () {
  render();
});
