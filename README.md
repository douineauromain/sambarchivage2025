# 🕹️ Samba de Galec : Le Jeu !

Bienvenue dans le dépôt du mini-jeu de l'événement d'archivage **"SAMBA DE GALEC… Archivez, Dansez, Défilez !"**.

Ce petit jeu a été créé avec l'aide de l'IA **Google Gemini** et **Google AI Studio** pour célébrer de manière ludique notre journée de tri et d'archivage du 27 juin. L'objectif est simple : collectez un maximum de documents pour faire le meilleur score, mais attention aux obstacles !

## 🎮 Comment jouer ?

Le jeu est accessible directement en ligne à cette adresse :

**[https://douineauromain.github.io/sambarchivage2025/](https://douineauromain.github.io/sambarchivage2025/)**

### Guide des objets :

* **Les Collectibles (bons pour le score) :**
    * 📄 **Le Document Papier** : Le gain de base.
    * 💻 **Le Fichier Numérique** : Rapporte plus de points.
    * 📦 **Le Carton d'Archives** : Le jackpot !
* **Les Bonus (à attraper !) :**
    * 🪶 **La Plume Pailletée** : Vous donne un bouclier temporaire.
    * ❤️ **Le Like du Hub** : Active un multiplicateur de score "x2".
* **Les Obstacles (attention !) :**
    * 🍮 **Le Flan Pâtissier** : Vous fait perdre quelques points.
    * 🚨 **L'Alerte SVP Info** : Obstacle fatal, la partie est terminée si vous le touchez !

Partagez votre meilleur score et voyons qui sera le champion de l'archivage ! 🏆

## 🛠️ Pour les développeurs

Ce projet est une application web créée avec [Vite](https://vitejs.dev/) et [Lit](https://lit.dev/), et le code du jeu utilise la librairie [p5.js](https://p5js.org/).

### Lancer le projet en local

**Prérequis :** [Node.js](https://nodejs.org/)

1.  **Clonez le dépôt :**
    ```bash
    git clone [https://github.com/douineauromain/sambarchivage2025.git](https://github.com/douineauromain/sambarchivage2025.git)
    ```
2.  **Installez les dépendances :**
    ```bash
    npm install
    ```
3.  **Lancez le serveur de développement :**
    Le jeu sera disponible sur `http://localhost:5173`.
    ```bash
    npm run dev
    ```
4.  **Pour prévisualiser la version finale (build) :**
    ```bash
    npm run build
    npm run preview
    ```
