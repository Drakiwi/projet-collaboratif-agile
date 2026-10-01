// Projet "Attribue ta place"
// Écrit par Antoine (Lead Dev) le 01/10/2026

// Ce qui est fait :
// 1. dessiner la salle avec les rangées et les places
// 2. marquer une place inutilisable en cliquant dessus
// 3. couper la liste des élèves et la mélanger
// 4. mettre un élève par place

// Ce qu'il reste à faire :
// 1. envoyer la salle dans le plan principal (bouton Appliquer au plan)
// 2. garder les données quand on rafraîchit la page (localStorage)
// 3. le bouton Exporter
// 4. un message d'erreur si on a plus d'élèves que de places

let rows = 4;
let cols = 6;
let students = [];
let plan = [];

// dessiner la salle
function renderGrid() {                 
  const zone = document.getElementById("apercu");
  zone.innerHTML = "";

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const div = document.createElement("div");
      div.className = "w-16 h-10 border rounded flex items-center justify-center text-xs";

      const nom = getNom("R" + r + "-C" + c);
      div.textContent = nom ? nom : "Libre";

      div.addEventListener("click", function () {
        toggleSeat("R" + r + "-C" + c);
      });

      zone.appendChild(div);
    }
  }
}

// trouver l'élève d'une place
function getNom(id) {                   
  for (let i = 0; i < plan.length; i++) {
    if (plan[i].seat === id) return plan[i].name;
  }
  return "";
}

// marquer une place
function toggleSeat(id) {               
  const i = plan.findIndex(function (l) { return l.seat === id; });

  if (i === -1) plan.push({ seat: id, name: "X" });
  else plan.splice(i, 1);

  renderGrid();
}

// mélanger et placer
function drawPlan() {                   
  const melanges = students.slice();
  melanges.sort(function () { return Math.random() - 0.5; });

  plan = [];
  let n = 0;

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      if (n >= melanges.length) return renderGrid();
      const div = document.createElement("div");
      const id = "R" + r + "-C" + c;
      plan.push({ seat: id, name: melanges[n] });
      n++;
    }
  }

  renderGrid();
}

// couper la liste en noms
function parseStudents(texte) {         
  return texte.split("\n").map(function (l) { return l.trim(); }).filter(function (l) { return l !== ""; });
}

// au démarrage
document.addEventListener("DOMContentLoaded", function () {   
  const zone = document.querySelector("#SaisieMlt textarea");

  document.getElementById("afficherAp").addEventListener("click", function () {
    rows = Number(document.getElementById("nb-range").value);
    cols = Number(document.getElementById("nb-place").value);
    renderGrid();
  });

  document.getElementById("appPlanSaisie").addEventListener("click", function () {
    students = parseStudents(zone.value);
    drawPlan();
  });

  renderGrid();
});
