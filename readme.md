# 🎯 Projet Collaboratif Agile : Attribue ta place !

## 🌟 Introduction & Vision du Projet

Votre mission : créer l'application web officielle de la promo pour attribuer aléatoirement les places dans la salle chaque lundi matin.

Ce projet se déroule sur **3 jours**, rythmés par **3 Sprints de deux demi journées chacun** en équipe de **3 personnes**.

> 🚀 **Au-delà du TP : Devenir un Projet Open Source de Promo**  
> À la fin du Sprint 3, toute la promo votera pour la meilleure application. **Le projet élu deviendra le dépôt Open Source officiel de la promo** !  
> Dès les semaines suivantes, n'importe quel apprenant de la promo pourra continuer à faire évoluer l'outil via des *forks*, des *issues* et des *Pull Requests*. L'équipe créatrice (rejointe par ceux qui le souhaitent) pourra piloter de nouveaux sprints de maintenance et d'amélioration continue sur son temps libre ou en veille.

---

## 📑 Cahier des Charges

### 1. Contexte & Enjeux
Chaque lundi matin en formation, l'attribution des places physiques en salle de classe engendre des pertes de temps, des regroupements répétitifs par affinité et des contestations.  
**Le client (votre dévoué formateur)** souhaite s'équiper d'une application web légère, intuitive et projetable au tableau, capable d'assigner automatiquement et équitablement une place aléatoire à chaque apprenant selon la disposition de la salle du jour.

---

### 2. Personas (Utilisateurs cibles)
* **Le Formateur (Admin/Organisateur)** : A besoin de configurer rapidement la géométrie de la salle (ex: 4 rangées de 6 places), de coller la liste des présents du jour et de projeter le résultat en 30 secondes chrono sans ressaisir les données chaque semaine.
* **L'Apprenant (Bénéficiaire)** : Doit pouvoir repérer sa place du premier coup d'œil sur l'écran projeté au fond de la salle ou depuis son smartphone.

---

### 3. Spécifications Fonctionnelles Détaillées (SFD)

#### SF-01 : Configuration spatiale de la salle
* **Besoin client :** La salle peut changer de configuration selon les modules ou les locaux.
* **Spécifications :**
  - L'utilisateur doit pouvoir définir la grille de la salle en saisissant un nombre de **rangées** et le nombre de **places** pour chaque rangée.
  - La grille générée doit s'afficher dynamiquement à l'écran pour donner un aperçu visuel immédiat de la disposition physique.
  - Chaque place peut être marquée comme **inutilisable**.

#### SF-02 : Gestion des apprenants (Saisie & Traitement)
* **Besoin client :** Éviter à tout prix la corvée de taper les prénoms un par un chaque lundi.
* **Spécifications :**
  - **Saisie en masse :** Un champ texte multi-lignes permettant de coller directement la liste des apprenants.
  - **Compteur temps réel :** Affichage d'un indicateur de jauge : `"X apprenants saisis / Y places disponibles"`, tenant compte des places inutilisables.

#### SF-03 : Algorithme d'attribution aléatoire
* **Règles de gestion (RG) :**
  - **RG-01 (Unicité) :** Un apprenant est assigné à une et une seule place.
  - **RG-02 (Équiprobabilité) :** Le tirage doit être équitable et aléatoire.
  - **RG-03 (Capacité) :** 
    - Si `Nombre d'apprenants > Nombre de places` : Le tirage est bloqué et un message d'alerte explicite s'affiche à l'écran.
    - Si `Nombre d'apprenants < Nombre de places` : Le tirage s'effectue normalement, les places non attribuées sont marquées comme `"Libre"`. 
  - **RG-04 (Reproductibilité contrôlée) :** Un bouton `"Relancer"` permet de relancer un tirage aléatoire complet en conservant la même promo et la même salle.

#### SF-04 : Rendu visuel
* **Besoin client :** Le plan doit être compréhensible instantanément.
* **Spécifications :**
  - Représentation cartographique de la salle :
    - Repère visuel pour le **"Bureau formateur"**.
    - Cases distinctes pour chaque place.
  - Distinction visuelle claire entre :
    - Place occupée (Nom de l'apprenant en gras, fond contrasté).
    - Place vide (Mention "Libre" ou icône grisée pour les places inutilisables).

#### SF-05 : Persistance des données (LocalStorage)
* **Besoin client :** En cas de rechargement accidentel ou d'une semaine sur l'autre, ne rien perdre.
* **Spécifications :**
  - Sauvegarde automatique dans le navigateur :
    - De la dernière configuration de salle (dimensions).
    - De la liste des apprenants enregistrée.
    - Du dernier plan de table généré.
  - Présence d'un bouton `"Réinitialiser"` pour effacer les données enregistrées après confirmation.

#### SF-06 : Export & Partage
* **Besoin client :** Pouvoir diffuser le plan dans le canal de la promo sans faire de capture d'écran bricolée.
* **Spécifications :**
  - Bouton `"Copier la liste"` : copie au format texte dans le presse-papier le récapitulatif prêt pour Slack/Discord.
  - Mode d'affichage épuré : masquage des panneaux de configuration pour ne laisser que le plan en plein écran lors de la projection.

---

### 4. Spécifications Techniques & Contraintes

* **Architecture :** Application front-end monopage (SPA) sans framework lourd (`index.html`, `main.js`, styles).
* **Technologies imposées :**
  - **HTML5 sémantique** & **Vanilla JavaScript (ES6+)**.
  - **Tailwind CSS** pour l'intégralité du design et des composants.
* **Hébergement & Versioning :** Dépôt **GitHub** privé partagé en équipe, respect du *GitHub Flow* (branches + Pull Requests).
* **Stockage :** Web Storage API (`localStorage`), zéro base de données externe requise.

---

### 5. Exigences d'Ergonomie & UI/UX
* **Conception préalable (Figma) :** Maquette validée en équipe avant la première ligne de code.
* **Feedback visuel :** États de survol (*hover*), états de focus accessibles, messages d'erreurs en rouge/orange visibles.
* **Suspense & Fluidité :** Légère transition ou temporisation visuelle lors du clic sur "Générer" (évite l'effet brutal d'affichage instantané).

---

## 👥 Rôles en Trinôme & Gouvernance

Chaque membre de l'équipe code, mais porte une casquette spécifique :

* **Product Owner (PO) & Référent UX** :
  * Conçoit les parcours et valide les écrans sur Figma avant d'écrire le code.
  * Définit et vérifie les critères d'acceptation (*Definition of Done*) de chaque tâche.
* **Scrum Master (SM) & Référent UI** :
  * Garant du temps (*timeboxing*) et animateur des rituels (Daily, Planning, Review).
  * Veille à l'intégration propre de Tailwind CSS (design system, cohérence visuelle, responsive).
* **Lead Dev & Référent Git** :
  * Structure le code JavaScript et valide les algorithmes.
  * Administre le dépôt GitHub et relit les Pull Requests avant fusion sur la branche principale.

---

## ⏱️ Phase Initiale : Cadrage & Setup

Avant d'écrire la moindre ligne de code, l'équipe pose son cadre de travail :

1. **Outillage Collaboratif :**
   * Création du dépôt **GitHub** (public, ajout des collaborateurs, protection de la branche `main`).
   * Initialisation du board **Trello** ou **GitHub Projects** (colonnes : *Backlog*, *To Do*, *In Progress*, *PR*, *Done*).
   * Initialisation du squelette de projet (`index.html`, `main.js`, intégration de Tailwind CSS).

2. **User Stories :**
   * Transformation du cahier des charges en User Stories sur le board.
     * Chaque User Stories est un élément de la board Kanban qui doit être placée dans la colonne *To Do*
     * A la fin de chaque sprint, les User Stories non placées dans la colonne "Done" seront reportées au prochain sprint

---

## 🔄 Organisation du Travail : 3 Sprints de deux demi journées

### Rituels quotidiens
* **Matin (9h00 - 9h30)** : *Sprint Planning* (découpage des tâches sur Trello / GitHub Projects) et *Daily Standup* pour les jours 2 et 3.
* **Midi (13h30 - 13h40)** : *Daily Standup* (10 min chrono debout : *ce qui est fait, ce qui bloque, ce qu'on va faire*).
* **Fin d'après-midi (16h30 - 17h00)** : *Sprint Review / Démo* (validation de l'incrément du jour).

### Workflow Git (GitHub Flow)
* Pas de push direct sur `main`.
* Une branche par fonctionnalité (`feature/nom-de-la-tache`).
* Une **Pull Request** obligatoire, relue et validée avant d'être mergée.

---

## 📋 SPRINT 1 — De la Maquette à l'Interface Statique et Saisie

**Objectif du Jour 1 :** Poser les bases visuelles sur Figma, intégrer l'interface avec Tailwind CSS, permettre de saisir la liste d'élèves et de configurer dynamiquement la taille de la grille de la salle.

---

## 📋 SPRINT 2 — Tirage Aléatoire, Persistance et Export

**Objectif du Jour 2 :** Coder l'algorithme de tirage aléatoire et le rendu du plan de classe, gérer les places inutilisables, ne pas perdre les données saisies, soigner l'expérience utilisateur et permettre d'exporter le plan de classe.

---

## 📋 SPRINT 3 — Version Avancée et Intégration de Bonus

**Objectif du Jour 3 :** Développer une version plus avancée de l'application en intégrant un ou plusieurs bonus au choix parmi la liste ci-dessous, et finaliser le projet.

---

## 🏆 Présentation & Élection du Projet (Fin du Jour 3)

Chaque équipe dispose de **10 minutes** de passage devant la promo :
1. **Pitch & Démo** : Saisie d'une liste test, génération du plan de classe en direct, démonstration de la sauvegarde après rafraîchissement de la page et présentation du ou des bonus intégrés.
2. **Revue Design & Méthode** : Présentation de la maquette Figma vs le résultat final, organisation de l'équipe sur Trello/Git.
3. **Questions / Réponses**.

**Vote de la promo :** L'équipe élue voit son projet désigné comme **l'outil officiel**.

---

## 🚀 La suite : Le Backlog Open Source de la Promo !

Une fois le projet gagnant sélectionné, le dépôt passe en public. Les autres équipes et tous les apprenants motivés peuvent continuer à contribuer via des issues et des Pull Requests sur leur temps libre.

Voici les **User Stories bonus** proposées (à choisir pour le Sprint 3 ou pour le futur backlog Open Source) :

* **[Bonus 1] Taille de tables et Allées :** Pouvoir définir la longueur des tables et des allées entre plusieurs tables.
* **[Bonus 2] Échange manuel par Drag & Drop :** Pouvoir glisser-déposer deux élèves pour échanger leurs places à la main après le tirage.
* **[Bonus 3] Contraintes pédagogiques :** Possibilité d'épingler un élève au premier rang avant le tirage aléatoire du reste de la promo, ainsi que d'autres règles.
* **[Bonus 4] Dark Mode :** Bascule thème clair / sombre mémorisée dans le navigateur.
* **[Bonus 5] Export Image / PDF :** Téléchargement direct du plan sous format PNG pour l'envoyer en image sur Discord.