// Projet "Attribue ta place"
// Écrit par Antoine (Lead Dev) le 01/10/2026
//
// Ce qui est fait :
// 1. dessiner la salle dans #apercu (nb-range rangées x nb-place places)
// 2. marquer une place inutilisable en cliquant dessus
// 3. couper la liste des élèves et la mélanger
// 4. envoyer la salle dans le plan principal (#planTotal)
// 5. interface adaptée PC / portable (barre de menus + fenêtres)
// 6. bouton Exporter : copie texte ou capture d'écran dans le presse-papier

/* =======================================================================
   1. STYLE RESPONSIVE (injecté en JS pour ne pas toucher index.html)
   ======================================================================= */

const STYLE_PCA = `
/* ---------- page entière ---------- */
body.h-screen{
  height:auto;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  background:#eef2f7;
}

body header[class]{
  height:auto;
  min-height:3.25rem;
  padding:.5rem .75rem;
  flex-wrap:wrap;
  position:sticky;
  top:0;
  z-index:30;
}

body main[class]{
  height:auto;
  flex:1 1 auto;
  min-height:0;
  width:100%;
  padding:clamp(.5rem,2vw,2rem);
}

body footer[class]{
  height:auto;
  min-height:1.75rem;
  padding:.5rem;
  flex:0 0 auto;
}

/* ---------- barre de menus ---------- */
#menuBar{
  width:100%;
  max-width:72rem;
  margin:0 auto;
  padding:0;
  flex-wrap:wrap;
  justify-content:center;
  gap:clamp(.4rem,1.2vw,1.5rem);
}

#menuBar .menuBtn{
  font-size:clamp(.75rem,.3vw + .7rem,1rem);
  line-height:1.15;
  padding:.45rem .85rem;
  border-radius:.75rem;
  white-space:nowrap;
  transition:background-color .15s, color .15s, transform .1s;
}
#menuBar .menuBtn:focus-visible{ outline:3px solid #fde68a; outline-offset:2px; }
#menuBar .menuBtn:active{ transform:translateY(1px); }

/* ---------- plan principal ---------- */
#planTotal{
  width:100%;
  height:100%;
  min-height:10rem;
  padding:.75rem;
  overflow:auto;
  border-width:clamp(2px,.35vw,4px);
  border-radius:clamp(.5rem,1vw,1rem);
  background:
    repeating-linear-gradient(45deg,#fafafa 0 12px,#f2f2f2 12px 24px);
}
#planTotal:empty::before{
  content:"Plan vide - utilisez « Définir la disposition » puis « Saisie des élèves ».";
  color:#6b7280;
  font-size:clamp(.85rem,1.6vw,1.05rem);
  text-align:center;
  padding:2rem 1rem;
}

.pca-plan-holder{ position:relative; margin:auto; flex:0 0 auto; }
.pca-plan-colonne{
  position:absolute; top:0; left:0;
  transform-origin:top left;
  display:flex; flex-direction:column; align-items:center;
  gap:.5rem;
}

/* ---------- fenêtres (modales) ---------- */
#menuDisposition,#menuSaisie,#export{
  position:fixed;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%) scale(.97);
  width:min(94vw,54rem);
  max-height:min(92vh,60rem);
  overflow-y:auto;
  overflow-x:hidden;
  z-index:50;
  padding:clamp(.75rem,2vw,1.25rem);
  border-radius:clamp(.6rem,1.4vw,1rem);
  opacity:0;
  visibility:hidden;
  pointer-events:none;
  transition:opacity .15s ease, transform .15s ease;
}
#menuDisposition.pca-ouvert,#menuSaisie.pca-ouvert,#export.pca-ouvert{
  opacity:1;
  visibility:visible;
  pointer-events:auto;
  transform:translate(-50%,-50%) scale(1);
}

#pca-fond{
  position:fixed;
  inset:0;
  background:rgba(15,23,42,.55);
  z-index:40;
  opacity:0;
  visibility:hidden;
  transition:opacity .15s ease;
}
#pca-fond.pca-ouvert{ opacity:1; visibility:visible; }

#menuDisposition,#menuSaisie,#export{
  display:grid;
  gap:clamp(.4rem,1.2vw,.75rem);
  align-items:stretch;
  justify-items:stretch;
}
#menuDisposition > h2,
#menuSaisie > h2,
#export > h2{
  grid-column:1 / -1;
  font-size:clamp(1rem,2.4vw,1.5rem) !important;
  margin:.25rem;
  line-height:1.2;
}

/* fenêtres en 2 colonnes dès qu'il y a de la place */
@media (min-width:860px){
  #menuDisposition{
    grid-template-columns:minmax(15rem,21rem) minmax(0,1fr);
    grid-template-areas:"titre titre" "form apercu" "actions actions";
    align-items:start;
  }
  #menuSaisie{
    grid-template-columns:1fr 1fr;
    grid-template-areas:"titre titre" "ind mlt" "actions actions";
    align-items:start;
  }
}
@media (max-width:859px){
  #menuDisposition{ grid-template-areas:"titre" "form" "apercu-titre" "apercu" "actions"; }
  #menuSaisie{ grid-template-areas:"titre" "ind" "mlt" "actions"; }
}

#pca-form-dispo{ grid-area:form; }
#pca-titre-apercu{ grid-area:apercu-titre; }
#apercu{ grid-area:apercu; }
#menuDisposition>#appPlanDisp{ grid-area:actions; }
#menuSaisie>#appPlanSaisie{ grid-area:actions; }

#saisieInd{ grid-area:ind; }
#SaisieMlt{ grid-area:mlt; width:100%; }

/* fenêtre d'export : simple colonne centrée */
#export{ width:min(94vw,40rem); }
#export>label,#export>select,#export>button,#export>#pca-export-statut{ width:100%; }
#export>#pca-export-actions{
  width:100%;
  flex-direction:row;
  flex-wrap:wrap;
  justify-content:center;
  gap:.5rem;
}
#export>#pca-export-actions>button{ flex:1 1 14rem; max-width:20rem; width:auto; }
#SaisieMlt textarea{
  width:100%;
  height:clamp(8rem,22vh,13rem);
  padding:.5rem;
  border-radius:.6rem;
  font-size:clamp(.85rem,1.4vw,1rem);
  font-family:inherit;
  resize:vertical;
}

#menuDisposition h3,#menuSaisie h3{
  font-size:clamp(.9rem,1.6vw,1.15rem);
  margin:.25rem 0;
  line-height:1.3;
}

#menuDisposition input,#menuSaisie input,#export select{
  width:auto;
  min-width:5rem;
  padding:.4rem .5rem;
  border-radius:.6rem;
  font-size:clamp(.9rem,1.4vw,1rem);
  font-family:inherit;
}
#export select{ width:100%; }

#menuDisposition>div,#saisieInd,#SaisieMlt,#export>div{
  display:flex; flex-direction:column; align-items:center; gap:.5rem;
}
#menuDisposition label,#saisieInd label,#export label{ font-size:clamp(.85rem,1.5vw,1rem); }

#menuDisposition button,#menuSaisie button,#export button{
  width:100%;
  max-width:26rem;
  padding:.6rem .9rem;
  border-radius:.75rem;
  font-size:clamp(.85rem,1.5vw,1rem);
  font-weight:600;
}
#menuDisposition button:focus-visible,
#menuSaisie button:focus-visible,
#export button:focus-visible{ outline:3px solid #a78bfa; outline-offset:2px; }

#errNb,#errInd,#errMlt,#pca-export-statut{
  color:#dc2626;
  font-size:clamp(.8rem,1.4vw,1rem);
  min-height:1.2em;
  margin:0;
}
#pca-export-statut{ text-align:center; max-width:40rem; }
#pca-export-statut.pca-ok{ color:#15803d; }

#apercu{
  width:100%;
  max-height:clamp(12rem,42vh,26rem);
  padding:.5rem;
  overflow:auto;
}
.pca-apercu-interieur{ transform-origin:top center; width:max-content; margin:0 auto; }

/* écrans étroits ou bas : on empile et on grossit les zones tactiles */
@media (max-width:620px){
  #menuBar .menuBtn{ width:100%; }
  #menuDisposition>div,#saisieInd,#SaisieMlt{ align-items:stretch; }
  #menuDisposition>div{flex-direction:row; flex-wrap:wrap; justify-content:center; }
}
@media (max-height:640px){
  #menuDisposition h2,#menuSaisie h2,#export h2{ font-size:1rem !important; }
  #apercu{ max-height:34vh; }
}

/* ---------- message flottant ---------- */
#pca-toast{
  position:fixed;
  left:50%;
  bottom:clamp(.75rem,3vh,2rem);
  transform:translateX(-50%) translateY(150%);
  z-index:60;
  max-width:min(92vw,34rem);
  padding:.6rem 1rem;
  border-radius:.75rem;
  background:#111827;
  color:#fff;
  font-size:clamp(.8rem,1.5vw,.95rem);
  box-shadow:0 10px 25px rgba(0,0,0,.3);
  opacity:0;
  transition:opacity .2s ease, transform .2s ease;
  pointer-events:none;
}
#pca-toast.pca-visible{ opacity:1; transform:translateX(-50%) translateY(0); }

@media (prefers-reduced-motion:reduce){
  *{ transition:none !important; }
}
`;

function injecterStyle() {
  if (document.getElementById("pca-style")) return;
  const style = document.createElement("style");
  style.id = "pca-style";
  style.textContent = STYLE_PCA;
  document.head.appendChild(style);
}

/* =======================================================================
   2. ÉTAT GLOBAL
   ======================================================================= */

let room = { rows: 0, cols: 0, unavailable: [] };
let students = [];
let plan = [];

const MENUS = ["menuDisposition", "menuSaisie", "export"];

/* =======================================================================
   3. PETITS OUTILS
   ======================================================================= */

function el(id) {
  return document.getElementById(id);
}

function dateCourante() {
  return new Date().toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function nomFichier() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return "plan-de-classe-" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate())
    + "-" + p(d.getHours()) + p(d.getMinutes());
}

function afficherToast(message) {
  let toast = el("pca-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "pca-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("pca-visible");
  clearTimeout(afficherToast._t);
  afficherToast._t = setTimeout(function () {
    toast.classList.remove("pca-visible");
  }, 3200);
}

/* =======================================================================
   4. STRUCTURE DES FENÊTRES (créée en JS)
   ======================================================================= */

function preparerStructure() {
  // fond sombre qui ferme la fenêtre au clic
  const fond = document.createElement("div");
  fond.id = "pca-fond";
  document.body.appendChild(fond);
  fond.addEventListener("click", function () {
    fermerMenus();
  });

  // zone de message dans la fenêtre d'export
  const exportMenu = el("export");
  const statut = document.createElement("p");
  statut.id = "pca-export-statut";
  statut.setAttribute("role", "status");
  statut.setAttribute("aria-live", "polite");
  exportMenu.appendChild(statut);

  // deux boutons d'export clairs, en plus du bouton déjà présent
  const actions = document.createElement("div");
  actions.id = "pca-export-actions";
  actions.className = "flex flex-row flex-wrap gap-2 justify-center";

  const btnTexte = document.createElement("button");
  btnTexte.id = "pca-export-texte";
  btnTexte.type = "button";
  btnTexte.textContent = "Copier le plan en texte";
  btnTexte.addEventListener("click", function () { exporter("texte"); });

  const btnImage = document.createElement("button");
  btnImage.id = "pca-export-image";
  btnImage.type = "button";
  btnImage.textContent = "Copier une capture d'écran";
  btnImage.addEventListener("click", function () { exporter("sS"); });

  actions.appendChild(btnTexte);
  actions.appendChild(btnImage);
  exportMenu.insertBefore(actions, statut);

  // libellés utiles pour la mise en page en grille
  const formDispo = document.querySelector("#menuDisposition > div");
  if (formDispo) formDispo.id = "pca-form-dispo";
  const titreApercu = document.querySelector("#menuDisposition > h3");
  if (titreApercu) titreApercu.id = "pca-titre-apercu";

  // accessibilité : chaque bouton de menu commande une fenêtre
  const paires = { dispBtn: "menuDisposition", eleveBtn: "menuSaisie", expBtn: "export" };
  for (const bouton in paires) {
    const b = el(bouton);
    if (!b) continue;
    b.setAttribute("aria-haspopup", "dialog");
    b.setAttribute("aria-controls", paires[bouton]);
    b.setAttribute("aria-expanded", "false");
  }
  MENUS.forEach(function (id) {
    const m = el(id);
    if (!m) return;
    m.setAttribute("role", "dialog");
    m.setAttribute("aria-modal", "true");
    m.classList.remove("invisible"); // la visibilité est gérée par la classe .pca-ouvert
  });
}

/* =======================================================================
   5. RENDU
   ======================================================================= */

function render() {
  renderGrid();
}

function renderGrid() {
  const apercu = el("apercu");
  if (!apercu) return;
  apercu.innerHTML = "";

  // si la salle est vide, on n'affiche rien
  if (room.rows === 0 || room.cols === 0) return;

  const interieur = document.createElement("div");
  interieur.className = "pca-apercu-interieur";

  // le bureau du formateur : taille fixe, jamais calculée
  const bureauLigne = document.createElement("div");
  bureauLigne.className = "flex gap-2 mb-2 justify-center shrink-0";

  const bureau = document.createElement("div");
  bureau.className = "w-40 h-16 shrink-0 bg-white border-2 border-black rounded flex items-center justify-center text-center text-sm font-bold";
  bureau.textContent = "Bureau formateur";
  bureauLigne.appendChild(bureau);
  interieur.appendChild(bureauLigne);

  for (let r = 1; r <= room.rows; r++) {
    // une div par rangée, les places se mettent à côté et au centre
    const ligne = document.createElement("div");
    ligne.className = "flex gap-2 mb-2 justify-center shrink-0";

    for (let c = 1; c <= room.cols; c++) {
      const id = "R" + r + "-C" + c;
      const place = document.createElement("div");
      place.className = "w-20 h-14 shrink-0 border-2 border-black rounded flex items-center justify-center text-center text-xs p-1";
      place.textContent = id;
      place.title = id + " - cliquer pour marquer / décocher la place";

      // si la place est inutilisable, on la grise
      if (room.unavailable.includes(id)) {
        place.className = place.className + " bg-gray-300 text-gray-500";
        place.textContent = "Indisponible";
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
    interieur.appendChild(ligne);
  }

  apercu.appendChild(interieur);
  ajusterApercu();
}

function getNom(id) {
  for (let i = 0; i < plan.length; i++) {
    if (plan[i].seat === id) {
      return plan[i].name;
    }
  }
  return "";
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

/* l'aperçu se réduit pour tenir dans la fenêtre, quel que soit l'écran */
function ajusterApercu() {
  const boite = el("apercu");
  if (!boite) return;
  const interieur = boite.firstElementChild;
  if (!interieur) return;

  interieur.style.transform = "none";
  interieur.style.height = "auto";

  const dispoW = boite.clientWidth - 16;
  const dispoH = boite.clientHeight - 16;
  const w = interieur.offsetWidth;
  const h = interieur.offsetHeight;
  if (!w || !h || dispoW <= 0 || dispoH <= 0) return;

  const k = Math.min(1, dispoW / w, dispoH / h);
  if (k >= 1) {
    interieur.style.transform = "";
    interieur.style.height = "";
    return;
  }
  interieur.style.transform = "scale(" + k.toFixed(3) + ")";
  interieur.style.height = (h * k).toFixed(0) + "px";
}

/* =======================================================================
   6. SAISIE DES ÉLÈVES
   ======================================================================= */

function saisieInd() {
  const champNb = el("nb-eleve");
  const errInd = el("errInd");
  const zone = document.querySelector("#SaisieMlt textarea");
  const nbEl = parseInt(champNb.value, 10);

  if (isNaN(nbEl) || nbEl < 1) {
    errInd.textContent = "Indiquez un nombre d'élèves supérieur à 0.";
    return;
  }

  const places = room.rows * room.cols - room.unavailable.length;
  errInd.textContent = "";
  if (room.rows === 0 || room.cols === 0) {
    errInd.textContent = "Définissez d'abord la disposition de la salle.";
    return;
  }
  if (nbEl > places) {
    errInd.textContent = "Il y a " + nbEl + " élèves pour " + places + " places.";
    return;
  }

  const noms = [];
  for (let i = 1; i <= nbEl; i++) {
    const rep = prompt("Donnez le nom de l'élève n°" + i);
    if (rep === null) return; // l'utilisateur a annulé
    const nom = rep.trim();
    if (nom !== "") noms.push(nom);
  }
  zone.value = noms.join(", ");
  afficherToast(noms.length + " élève(s) saisis dans la liste.");
}

function parseStudents(texte) {
  const lignes = texte.trim().split(",");
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
  const melanges = students.slice(); // copie, pour garder students
  melanges.sort(function () { return Math.random() - 0.5; });

  plan = [];
  let n = 0;

  for (let r = 1; r <= room.rows; r++) {
    for (let c = 1; c <= room.cols; c++) {
      const id = "R" + r + "-C" + c;
      if (room.unavailable.includes(id)) continue; // on saute les places marquées

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

/* =======================================================================
   7. MENUS
   ======================================================================= */

function ouvrirMenu(id) {
  const menu = el(id);
  if (!menu) return;

  fermerMenus();

  menu.classList.add("pca-ouvert");
  menu.removeAttribute("invisible");
  const fond = el("pca-fond");
  if (fond) fond.classList.add("pca-ouvert");

  const declencheur = document.querySelector('[aria-controls="' + id + '"]');
  if (declencheur) declencheur.setAttribute("aria-expanded", "true");

  // on met le curseur dans le premier champ de la fenêtre
  const champ = menu.querySelector("input, select, textarea, button");
  if (champ) setTimeout(function () { champ.focus(); }, 60);
}

function basculerMenu(id) {
  const menu = el(id);
  if (!menu) return;

  const estOuvert = menu.classList.contains("pca-ouvert");
  if (estOuvert) {
    fermerMenus();
  } else {
    ouvrirMenu(id);
  }
}

function fermerMenus() {
  MENUS.forEach(function (id) {
    const menu = el(id);
    if (!menu) return;
    menu.classList.remove("pca-ouvert");
    menu.classList.add("invisible");
    const declencheur = document.querySelector('[aria-controls="' + id + '"]');
    if (declencheur) declencheur.setAttribute("aria-expanded", "false");
  });
  const fond = el("pca-fond");
  if (fond) fond.classList.remove("pca-ouvert");
}

/* =======================================================================
   8. PLAN PRINCIPAL (mis à l'échelle pour tous les écrans)
   ======================================================================= */

function contenuApercu() {
  const interieur = document.querySelector("#apercu .pca-apercu-interieur");
  return interieur ? interieur.innerHTML : "";
}

function appliquerAuPlan() {
  const planTotal = el("planTotal");
  if (!planTotal) return;

  planTotal.innerHTML = "";
  if (room.rows === 0 || room.cols === 0) return;

  const holder = document.createElement("div");
  holder.className = "pca-plan-holder";

  const colonne = document.createElement("div");
  colonne.className = "pca-plan-colonne";
  colonne.innerHTML = contenuApercu();

  holder.appendChild(colonne);
  planTotal.appendChild(holder);
  ajusterPlan();
}

function ajusterPlan() {
  const planTotal = el("planTotal");
  const colonne = planTotal ? planTotal.querySelector(".pca-plan-colonne") : null;
  if (!colonne || !planTotal) return;

  const holder = colonne.parentElement;
  colonne.style.transform = "none";

  const dispoW = planTotal.clientWidth - 32;
  const dispoH = planTotal.clientHeight - 32;
  const w = colonne.offsetWidth;
  const h = colonne.offsetHeight;
  if (!w || !h || dispoW <= 0 || dispoH <= 0) return;

  const k = Math.min(dispoW / w, dispoH / h, 1.5);
  if (k < 1) {
    colonne.style.transform = "scale(" + k.toFixed(3) + ")";
  } else {
    colonne.style.transform = "";
  }
  holder.style.width = (w * k).toFixed(0) + "px";
  holder.style.height = (h * Math.min(k, 1)).toFixed(0) + "px";
}

/* =======================================================================
   9. EXPORT : texte ou capture d'écran
   ======================================================================= */

function textePlan() {
  const lignes = [];
  const dispo = room.rows * room.cols - room.unavailable.length;

  lignes.push("PLAN DE CLASSE - " + room.rows + " rangee(s) x " + room.cols + " place(s)");
  lignes.push("Genere le " + dateCourante());
  lignes.push("");
  lignes.push("[ Bureau formateur ]");
  lignes.push("");

  for (let r = 1; r <= room.rows; r++) {
    lignes.push("Rangee " + r);
    for (let c = 1; c <= room.cols; c++) {
      const id = "R" + r + "-C" + c;
      const nom = getNom(id);
      let etat;
      if (room.unavailable.includes(id)) etat = "Indisponible";
      else if (nom) etat = nom;
      else etat = "Libre";
      lignes.push("   " + id.padEnd(9, " ") + ": " + etat);
    }
    lignes.push("");
  }

  lignes.push("-------------------------------");
  lignes.push("Eleves places : " + plan.length + " / " + students.length);
  lignes.push("Places utilisables : " + dispo);
  if (room.unavailable.length) {
    lignes.push("Indisponibles : " + room.unavailable.join(", "));
  }
  lignes.push("");
  lignes.push("Application « Attribue ta place » - projet collaboratif agile");

  return lignes.join("\n");
}

function arrondi(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function couperTexte(ctx, texte, largeurMax) {
  const mots = String(texte).split(/\s+/);
  const lignes = [];
  let courante = "";

  for (let i = 0; i < mots.length; i++) {
    let mot = mots[i];
    // mot seul plus large que la case : on le coupe
    while (ctx.measureText(mot).width > largeurMax && mot.length > 1) {
      if (courante) { lignes.push(courante); courante = ""; }
      let coupe = mot.length;
      while (coupe > 1 && ctx.measureText(mot.slice(0, coupe)).width > largeurMax) coupe--;
      lignes.push(mot.slice(0, coupe));
      mot = mot.slice(coupe);
    }
    const essai = courante ? courante + " " + mot : mot;
    if (ctx.measureText(essai).width > largeurMax && courante) {
      lignes.push(courante);
      courante = mot;
    } else {
      courante = essai;
    }
  }
  if (courante) lignes.push(courante);
  return lignes.length ? lignes : [""];
}

function ecrireCentre(ctx, texte, x, y, largeurMax, tailleDepart, poids) {
  let taille = tailleDepart;
  ctx.font = (poids || "600") + " " + taille + "px sans-serif";
  let lignes = couperTexte(ctx, texte, largeurMax);
  while (lignes.length > 3 && taille > 11) {
    taille -= 2;
    ctx.font = (poids || "600") + " " + taille + "px sans-serif";
    lignes = couperTexte(ctx, texte, largeurMax);
  }
  const hauteur = taille + 4;
  let y0 = y - ((lignes.length - 1) * hauteur) / 2;
  for (let i = 0; i < lignes.length; i++) {
    ctx.fillText(lignes[i], x, y0);
    y0 += hauteur;
  }
}

function dessinerPlan() {
  const cellW = 170, cellH = 104, gap = 16, marg = 44;
  const titreH = 120, bureauH = 74, legendeH = 92;

  const gridW = room.cols * cellW + (room.cols - 1) * gap;
  const gridH = room.rows * cellH + (room.rows - 1) * gap;
  const W = Math.max(640, gridW + marg * 2);
  const H = marg + titreH + bureauH + gap + gridH + legendeH;

  const canvas = document.createElement("canvas");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // fond
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, W - 4, H - 4);

  // titre
  ctx.fillStyle = "#111827";
  ctx.font = "bold 34px sans-serif";
  ctx.fillText("Plan de classe", W / 2, marg + 26);
  ctx.fillStyle = "#4b5563";
  ctx.font = "18px sans-serif";
  ctx.fillText(
    room.rows + " rangee(s) x " + room.cols + " place(s) - " + plan.length + " eleve(s) place(s)",
    W / 2, marg + 62
  );
  ctx.fillStyle = "#6b7280";
  ctx.font = "15px sans-serif";
  ctx.fillText("Genere le " + dateCourante(), W / 2, marg + 88);

  // bureau
  const bx = (W - gridW) / 2, by = marg + titreH;
  ctx.fillStyle = "#f9fafb";
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 3;
  arrondi(ctx, bx, by, gridW, bureauH, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#111827";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("Bureau formateur", W / 2, by + bureauH / 2);

  // grille
  const gx = (W - gridW) / 2, gy = by + bureauH + gap;

  for (let r = 1; r <= room.rows; r++) {
    for (let c = 1; c <= room.cols; c++) {
      const id = "R" + r + "-C" + c;
      const x = gx + (c - 1) * (cellW + gap);
      const y = gy + (r - 1) * (cellH + gap);
      const nom = getNom(id);
      const indisponible = room.unavailable.includes(id);

      let fond = "#ffffff", bordure = "#111827", texte = "Libre", couleur = "#9ca3af";
      if (indisponible) { fond = "#d1d5db"; texte = "Indisponible"; couleur = "#4b5563"; }
      else if (nom) { fond = "#ddd6fe"; bordure = "#6d28d9"; couleur = "#3b0764"; }

      ctx.fillStyle = fond;
      ctx.strokeStyle = bordure;
      ctx.lineWidth = 3;
      arrondi(ctx, x, y, cellW, cellH, 10);
      ctx.fill();
      ctx.stroke();

      // petit repère de la place
      ctx.fillStyle = "#6b7280";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(id, x + 10, y + 14);
      ctx.textAlign = "center";

      // contenu de la place
      ctx.fillStyle = couleur;
      if (indisponible) {
        ctx.font = "600 16px sans-serif";
        ctx.fillText("Indisponible", x + cellW / 2, y + cellH / 2);
      } else if (nom) {
        ecrireCentre(ctx, nom, x + cellW / 2, y + cellH / 2 + 6, cellW - 20, 19, "700");
      } else {
        ctx.font = "16px sans-serif";
        ctx.fillText("Libre", x + cellW / 2, y + cellH / 2);
      }
    }
  }

  // légende
  const items = [
    ["#ddd6fe", "#6d28d9", "eleve place"],
    ["#d1d5db", "#111827", "indisponible"],
    ["#ffffff", "#111827", "libre"],
  ];
  let largeurTotale = 0;
  ctx.font = "16px sans-serif";
  const dims = items.map(function (it) {
    const l = 28 + 8 + ctx.measureText(it[2]).width;
    largeurTotale += l + 30;
    return l;
  });
  let lx = W / 2 - (largeurTotale - 30) / 2;
  const ly = gy + gridH + 42;
  items.forEach(function (it, i) {
    ctx.fillStyle = it[0];
    ctx.strokeStyle = it[1];
    ctx.lineWidth = 2;
    arrondi(ctx, lx, ly, 28, 20, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#374151";
    ctx.textAlign = "left";
    ctx.font = "16px sans-serif";
    ctx.fillText(it[2], lx + 36, ly + 10);
    ctx.textAlign = "center";
    lx += dims[i] + 30;
  });

  return canvas;
}

function canvasEnBlob(canvas) {
  return new Promise(function (resoudre) {
    if (canvas.toBlob) {
      canvas.toBlob(function (blob) { resoudre(blob); }, "image/png");
      return;
    }
    // vieux navigateur : on passe par la version "data URL"
    try {
      const data = canvas.toDataURL("image/png").split(",")[1];
      const binaire = atob(data);
      const octets = new Uint8Array(binaire.length);
      for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
      resoudre(new Blob([octets], { type: "image/png" }));
    } catch (e) {
      resoudre(null);
    }
  });
}

function telecharger(blob, nom) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nom;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
}

async function copierTexte(txt) {
  // méthode moderne (HTTPS / localhost)
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(txt);
      return true;
    }
  } catch (e) { /* on tente la méthode de secours */ }

  // méthode de secours : opened in file:// ou navigateur ancien
  try {
    const zone = document.createElement("textarea");
    zone.value = txt;
    zone.setAttribute("readonly", "");
    zone.style.position = "fixed";
    zone.style.top = "-1000px";
    zone.style.opacity = "0";
    document.body.appendChild(zone);
    zone.select();
    zone.setSelectionRange(0, zone.value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(zone);
    return ok;
  } catch (e) {
    return false;
  }
}

async function copierImage(canvas) {
  const blob = await canvasEnBlob(canvas);
  if (!blob) return false;

  try {
    if (navigator.clipboard && navigator.clipboard.write && typeof ClipboardItem !== "undefined") {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      return true;
    }
  } catch (e) { /* image refusée : on propose le téléchargement */ }

  return false;
}

function messageExport(texte, ok) {
  const statut = el("pca-export-statut");
  if (statut) {
    statut.textContent = texte;
    statut.classList.toggle("pca-ok", !!ok);
  }
  afficherToast(texte);
}

async function exporter(format) {
  if (room.rows === 0 || room.cols === 0) {
    messageExport("Définissez d'abord la disposition de la salle.", false);
    return;
  }

  const select = el("format");
  const mode = format || (select ? select.value : "texte");

  if (mode === "sS") {
    const canvas = dessinerPlan();
    const copie = await copierImage(canvas);
    if (copie) {
      messageExport("Capture d'écran copiée : collez-la avec Ctrl+V.", true);
    } else {
      // le navigateur refuse l'image dans le presse-papier (souvent en file://)
      const blob = await canvasEnBlob(canvas);
      telecharger(blob, nomFichier() + ".png");
      messageExport("Image copiée impossible ici : le fichier .png a été téléchargé.", false);
    }
    return;
  }

  const txt = textePlan();
  const copie = await copierTexte(txt);
  if (copie) {
    messageExport("Plan copié dans le presse-papier (" + txt.length + " caractères).", true);
  } else {
    telecharger(new Blob([txt], { type: "text/plain;charset=utf-8" }), nomFichier() + ".txt");
    messageExport("Copie refusée par le navigateur : le fichier .txt a été téléchargé.", false);
  }
}

/* =======================================================================
   10. SAUVEGARDE
   ======================================================================= */

function save() {
  localStorage.setItem(
    "attribue-ta-place",
    JSON.stringify({ room: room, students: students, plan: plan })
  );
}

// On ne relit rien au démarrage : on repart de zéro à chaque rechargement.
function reset() {
  room = { rows: 0, cols: 0, unavailable: [] };
  students = [];
  plan = [];
  save();
}

/* =======================================================================
   11. DÉMARRAGE
   ======================================================================= */

document.addEventListener("DOMContentLoaded", function () {
  injecterStyle();
  preparerStructure();
  fermerMenus();

  const nbRange = el("nb-range");
  const nbPlace = el("nb-place");
  const errNb = el("errNb");
  const errMlt = el("errMlt");
  const zone = document.querySelector("#SaisieMlt textarea");

  // bouton reset
  el("resetBtn").addEventListener("click", function () {
    reset();
    nbRange.value = "";
    nbPlace.value = "";
    el("nb-eleve").value = "";
    errNb.textContent = "";
    errMlt.textContent = "";
    if (zone) zone.value = "";
    el("planTotal").innerHTML = "";
    el("apercu").innerHTML = "";
    fermerMenus();
    afficherToast("Tout a été réinitialisé.");
  });

  // les 3 boutons du header ouvrent et ferment leur menu
  el("dispBtn").addEventListener("click", function () { basculerMenu("menuDisposition"); });
  el("eleveBtn").addEventListener("click", function () { basculerMenu("menuSaisie"); });
  el("expBtn").addEventListener("click", function () { basculerMenu("export"); });

  // touche Échap pour fermer
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fermerMenus();
  });

  // saisie individuelle
  el("startSaisie").addEventListener("click", function () { saisieInd(); });

  // Afficher l'aperçu : on change la taille de la salle
  el("afficherAp").addEventListener("click", function () {
    const r = parseInt(nbRange.value, 10);
    const c = parseInt(nbPlace.value, 10);

    if (isNaN(r) || isNaN(c) || r < 1 || c < 1) {
      errNb.textContent = "Il faut au moins 1 rangée et 1 place.";
      return;
    }
    errNb.textContent = "";

    room.rows = r;
    room.cols = c;
    render();
  });

  // Appliquer au plan : on copie l'aperçu dans le plan principal
  el("appPlanDisp").addEventListener("click", function () {
    appliquerAuPlan();
    fermerMenus();
    afficherToast("Disposition appliquée au plan.");
  });

  // Appliquer au plan (saisie) : on lit les élèves et on tire les places
  el("appPlanSaisie").addEventListener("click", function () {
    if (room.rows === 0 || room.cols === 0) {
      errMlt.textContent = "Définissez d'abord la disposition de la salle.";
      return;
    }

    students = parseStudents(zone.value);

    const places = room.rows * room.cols - room.unavailable.length;
    if (students.length > places) {
      errMlt.textContent = "Il y a " + students.length + " élèves pour " + places + " places.";
      return;
    }
    errMlt.textContent = "";

    drawPlan();
    appliquerAuPlan();
    fermerMenus();
    afficherToast(plan.length + " élève(s) placé(s).");
  });

  // bouton Exporter (le select choisit texte ou capture)
  el("exportBtn").addEventListener("click", function () {
    exporter(el("format").value);
  });

  // le plan et l'aperçu se réajustent à chaque changement de taille d'écran
  window.addEventListener("resize", function () {
    ajusterApercu();
    ajusterPlan();
  });
  window.addEventListener("orientationchange", function () {
    setTimeout(function () { ajusterApercu(); ajusterPlan(); }, 200);
  });

  render();
});
