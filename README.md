# 🚢 Battaille Navale - Cuirassé

Jeu de bataille navale moderne développé avec JavaScript ES6 modules, Jest pour les tests, et une interface utilisateur interactive.

## 🎮 Fonctionnalités

### ✨ Principales
- **Interface utilisateur moderne** : Design responsive avec effets visuels
- **Placement de navires** : Interface dédiée pour placer vos navires
- **Placement aléatoire** : Option pour placer automatiquement tous les navires
- **IA intelligente** : L'ordinateur cible les cases adjacentes après un coup réussi
- **Rotation des navires** : Touche 'R' ou bouton pour changer l'orientation
- **Affichage en temps réel** : Mise à jour instantanée des plateaux
- **Détection de fin de partie** : Modal de victoire/défaite

### 🎯 Navires
- Porte-avions (5 cases)
- Cuirassé (4 cases)  
- Croiseur (3 cases)
- Sous-marin (3 cases)
- Destroyer (2 cases)

## 📁 Structure du projet

```
cuirass-/
├── src/
│   ├── ship.js              # Classe Ship
│   ├── ship.test.js         # Tests Ship
│   ├── gameboard.js         # Classe Gameboard
│   ├── gameboard.test.js    # Tests Gameboard
│   ├── player.js            # Classe Player (avec IA)
│   ├── player.test.js       # Tests Player
│   ├── player-ai.test.js    # Tests IA intelligente
│   ├── gameController.js    # Contrôleur du jeu
│   ├── domController.js     # Gestion du DOM
│   └── shipPlacement.js     # Gestion du placement
├── index.html               # Interface utilisateur
├── index.js                 # Point d'entrée
├── styles.css               # Styles CSS
├── package.json             # Configuration npm
├── babel.config.cjs         # Configuration Babel
├── jest.config.cjs          # Configuration Jest
└── README.md                # Documentation

```

## 🚀 Installation et utilisation

### Prérequis
- Node.js (v14 ou supérieur)
- npm

### Installation

```bash
# Installer les dépendances
npm install
```

### Lancer le jeu

```bash
# Démarrer le serveur de développement
npm start
```

Ouvrez votre navigateur à l'adresse : `http://localhost:8000`

### Lancer les tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Couverture de code
npm run test:coverage
```

## 🎲 Comment jouer

### 1. Placement des navires
- **Cliquez** sur le plateau pour placer un navire
- **Appuyez sur 'R'** ou cliquez sur "Rotation" pour changer l'orientation
- **Utilisez "Placement aléatoire"** pour placer tous les navires automatiquement
- **Cliquez sur "Commencer la partie"** une fois tous les navires placés

### 2. Phase de combat
- **Cliquez** sur une case du plateau ennemi pour attaquer
- L'ordinateur riposte automatiquement
- Les **navires touchés** apparaissent en rouge
- Les **tirs manqués** apparaissent en bleu

### 3. Victoire
- Le premier joueur qui coule tous les navires adverses gagne!

## 🧠 IA Intelligente

L'ordinateur utilise une stratégie avancée :

1. **Attaque aléatoire** initiale
2. Après un **coup réussi**, cible les **cases adjacentes** (haut, bas, gauche, droite)
3. Continue de **poursuivre** les navires jusqu'à les couler
4. Évite les cases déjà attaquées

## 🏗️ Architecture

### Classes principales

#### Ship
- Représente un navire avec sa longueur
- Gère les coups reçus (`hit()`)
- Détermine si le navire est coulé (`isSunk()`)

#### Gameboard
- Plateau de jeu 10x10
- Placement des navires
- Gestion des attaques
- Suivi des tirs manqués et réussis

#### Player
- Joueur humain ou contrôlé par ordinateur
- Possède son propre plateau
- Méthodes d'attaque : `attack()`, `randomAttack()`, `smartAttack()`

#### GameController
- Gère le flux du jeu
- Alterne les tours
- Détecte la fin de partie

#### DOMController
- Affichage des plateaux
- Mise à jour de l'interface
- Messages utilisateur

#### ShipPlacement
- Gère le placement des navires
- Validation des positions
- Placement aléatoire

## 🧪 Tests

Le projet utilise Jest avec Babel pour les tests :

- **84 tests** au total
- Couverture de l'interface publique des classes
- Tests unitaires et d'intégration
- Tests de l'IA intelligente

```bash
Test Suites: 4 passed, 4 total
Tests:       84 passed, 84 total
```

## 🔧 Configuration

### ESM et Jest
Le projet utilise les modules ES6 (ESM) avec Jest via Babel :

- `package.json` : `"type": "module"`
- `babel.config.cjs` : Transformation ESM → CommonJS
- `jest.config.cjs` : Configuration Jest avec babel-jest

### Scripts npm
```json
{
  "test": "NODE_OPTIONS=--experimental-vm-modules jest",
  "test:watch": "NODE_OPTIONS=--experimental-vm-modules jest --watch",
  "test:coverage": "NODE_OPTIONS=--experimental-vm-modules jest --coverage",
  "start": "python3 -m http.server 8000"
}
```

## 🎨 Technologies utilisées

- **JavaScript ES6+** : Classes, modules, async/await
- **Jest** : Framework de test
- **Babel** : Transpilation pour Jest
- **HTML5 / CSS3** : Interface utilisateur
- **Python HTTP Server** : Serveur de développement

## ✨ Fonctionnalités avancées implémentées

- ✅ **Placement de navires interactif**
- ✅ **Placement aléatoire automatique**
- ✅ **IA intelligente** avec ciblage adjacent
- ✅ **Rotation des navires** (touche R)
- ✅ **Interface responsive**
- ✅ **Tests complets** (84 tests)

## 📝 Licence

ISC

## 👨‍💻 Auteur

Développé dans le cadre du projet Cuirassé - The Odin Project
