// Projet "Attribue ta place"

// Ce qui est fait :
// 1. dessiner la salle (nb-range rangées x nb-place places)
// 2. marquer une place inutilisable en cliquant dessus
// 3. couper la liste des élèves et la mélanger
// 4. envoyer la salle dans le plan principal

// Ce qu'il reste à faire :
// 1. le bouton Exporter
// 2. un message d'erreur si on a plus d'élèves que de places

let room = { rows: 4, cols: 6, unavailable: [] };
let students = [];
let plan = [];

function render() {
  renderGrid();
}

function renderGrid() {
  const apercu = document.getElementById("apercu");
  if (!apercu) return;
  apercu.innerHTML = "";

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
      }

      place.addEventListener("click", function () {
        toggleSeat(id);
      });

      ligne.appendChild(place);
    }
    apercu.appendChild(ligne);
  }
}

function parseStudents(texte) {
  const lignes = texte.split("\n");
  const noms = [];

  for (let i = 0; i < lignes.length; i++) {
    const nom = lignes[i].trim();
    if (nom !== "") {
      noms.push(nom);
    }
  }

  return noms;
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
  const btnApercu = document.getElementById("afficherAp");
  const nbRange = document.getElementById("nb-range");
  const nbPlace = document.getElementById("nb-place");

  btnApercu.addEventListener("click", function () {
    room.rows = Number(nbRange.value);
    room.cols = Number(nbPlace.value);
    render();
  });

  const btnAppliquer = document.getElementById("appPlanDisp");
  const apercu = document.getElementById("apercu");
  const planTotal = document.getElementById("planTotal");

  btnAppliquer.addEventListener("click", function () {
    planTotal.innerHTML = apercu.innerHTML;
  });

  const zone = document.querySelector("#SaisieMlt textarea");
  const btnSaisie = document.getElementById("appPlanSaisie");

  btnSaisie.addEventListener("click", function () {
    students = parseStudents(zone.value);
    drawPlan();
  });
});
