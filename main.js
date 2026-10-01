// Projet "Attribue ta place"
// Écrit par Antoine (Lead Dev) le 01/10/2026
//
// Ce qui est fait :
// 1. dessiner la salle dans #apercu (nb-range rangées x nb-place places)
// 2. marquer une place inutilisable en cliquant dessus
// 3. couper la liste des élèves et la mélanger
// 4. envoyer la salle dans le plan principal (#planTotal)
//
// Ce qu'il reste à faire :
// 1. le bouton Exporter
// 2. un message d'erreur si on a plus d'élèves que de places

let room = { rows: 0, cols: 0, unavailable: [] };
let students = [];
let plan = [];

//boutons du menu

const menuDispositionBtn = document.getElementById('dispBtn');
const menuEleveBtn = document.getElementById('eleveBtn');
const menuExportBtn = document.getElementById('expBtn');

const menuDisp = document.getElementById('menuDisposition');
const menuSaisie = document.getElementById('menuSaisie');
const menuExport = document.getElementById('export');

menuDispositionBtn.addEventListener('click', () => {
  menuDisp.classList.remove('hidden')
})

menuEleveBtn.addEventListener('click', () => {
  menuSaisie.classList.remove('hidden')
})

menuExportBtn.addEventListener('click', () => {
  menuExport.classList.remove('hidden')
})

function render() {                        // rafraîchir l'écran
  renderGrid();
}

function renderGrid() {                    // dessiner la salle
  const apercu = document.getElementById("apercu");
  if (!apercu) return;
  apercu.innerHTML = "";                   // on vide avant de redessiner

  // si la salle est vide, on n'affiche rien
  if (room.rows === 0 || room.cols === 0) return;

  // le bureau du formateur : taille fixe, jamais calculée
  const bureauLigne = document.createElement("div");
  bureauLigne.className = "flex gap-2 mb-2 justify-center shrink-0";

  const bureau = document.createElement("div");
  bureau.className = "w-40 h-16 shrink-0 bg-white border-2 border-black rounded flex items-center justify-center text-center text-sm font-bold";
  bureau.textContent = "Bureau formateur";
  bureauLigne.appendChild(bureau);
  apercu.appendChild(bureauLigne);

  for (let r = 1; r <= room.rows; r++) {
    // une div par rangée, les places se mettent à côté et au centre
    const ligne = document.createElement("div");
    ligne.className = "flex gap-2 mb-2 justify-center shrink-0";

    for (let c = 1; c <= room.cols; c++) {
      const id = "R" + r + "-C" + c;
      const place = document.createElement("div");
      place.className = "w-20 h-14 shrink-0 border-2 border-black rounded flex items-center justify-center text-center text-xs p-1";
      place.textContent = id;

      // si la place est inutilisable, on la grise
      if (room.unavailable.includes(id)) {
        place.className = place.className + " bg-gray-300 text-gray-500";
        place.textContent = "X";
      } else {
        // sinon on regarde si un élève est à cette place
        const nom = getNom(id);
        if (nom) {
          place.className = place.className + " bg-purple-200 font-bold";
          place.textContent = nom;
        } else {
          place.className = place.className + " text-gray-400";
          place.textContent = "Libre";
        }
      }

      place.addEventListener("click", function () {
        toggleSeat(id);
      });

      ligne.appendChild(place);
    }
    apercu.appendChild(ligne);
  }
}

function getNom(id) {                      // trouver l'élève d'une place
  for (let i = 0; i < plan.length; i++) {
    if (plan[i].seat === id) {
      return plan[i].name;
    }
  }
  return "";
}

function toggleSeat(id) {                  // marquer une place inutilisable
  const i = room.unavailable.indexOf(id);

  if (i === -1) {
    room.unavailable.push(id);             // pas encore marquée
  } else {
    room.unavailable.splice(i, 1);         // déjà marquée
  }

  save();
  render();
}

function parseStudents(texte) {            // couper la liste en noms
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

function drawPlan() {                      // mélanger et placer les élèves
  const melanges = students.slice();       // copie, pour garder students
  melanges.sort(function () { return Math.random() - 0.5; });

  plan = [];
  let n = 0;

  for (let r = 1; r <= room.rows; r++) {
    for (let c = 1; c <= room.cols; c++) {
      const id = "R" + r + "-C" + c;
      if (room.unavailable.includes(id)) continue;  // on saute les places marquées

      // si on a plus d'élèves que de places, on s'arrête
      if (n >= melanges.length) {
        render();
        return;
      }

      plan.push({ seat: id, name: melanges[n] });
      n++;
    }
  }

  render();
}

function save() {                          // garder les données
  localStorage.setItem(
    "attribue-ta-place",
    JSON.stringify({ room: room, students: students, plan: plan })
  );
}

// On ne relit rien au démarrage : on repart de zéro à chaque rechargement.
function reset() {                         // tout effacer
  room = { rows: 0, cols: 0, unavailable: [] };
  students = [];
  plan = [];
  save();
}

document.addEventListener("DOMContentLoaded", function () {   // au démarrage
  const nbRange = document.getElementById("nb-range");
  const nbPlace = document.getElementById("nb-place");
  const errNb = document.getElementById("errNb");
  const apercu = document.getElementById("apercu");
  const planTotal = document.getElementById("planTotal");
  const zone = document.querySelector("#SaisieMlt textarea");
  const errMlt = document.getElementById("errMlt");

  // au démarrage on part de zéro : champs vides, plan vide
  reset();
  nbRange.value = "";
  nbPlace.value = "";
  planTotal.innerHTML = "";

  //hover
  planTotal.addEventListener('mouseenter', () =>{
    planTotal.classList.toggle('bg-gray-200');
  })

  planTotal.addEventListener('mouseleave', () =>{
    planTotal.classList.toggle('bg-gray-200');
  })

  // Afficher l'aperçu : on change la taille de la salle
  document.getElementById("afficherAp").addEventListener("click", function () {
    const r = Number(nbRange.value);
    const c = Number(nbPlace.value);

    if (r < 1 || c < 1) {
      errNb.textContent = "Il faut au moins 1 rangée et 1 place.";
      return;
    }
    errNb.textContent = "";

    room.rows = r;
    room.cols = c;
    render();
  });

  // Appliquer au plan : on copie l'aperçu dans le plan principal
  document.getElementById("appPlanDisp").addEventListener("click", function () {
    planTotal.innerHTML = apercu.innerHTML;
    menuDisp.classList.add('hidden');
  });

  // Appliquer au plan (saisie) : on lit les élèves et on tire les places
  document.getElementById("appPlanSaisie").addEventListener("click", function () {
    students = parseStudents(zone.value);

    // message d'erreur s'il y a plus d'élèves que de places
    const places = room.rows * room.cols - room.unavailable.length;
    if (students.length > places) {
      errMlt.textContent = "Il y a " + students.length + " élèves pour " + places + " places.";
      return;
    }
    errMlt.textContent = "";

    drawPlan();
    planTotal.innerHTML = apercu.innerHTML;
  });

  render();
  menuSaisie.classList.add('hidden');
});