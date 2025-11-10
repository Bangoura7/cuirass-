import { GameController } from './src/gameController.js';
import { ShipPlacement } from './src/shipPlacement.js';
import { DOMController } from './src/domController.js';
import { Gameboard } from './src/gameboard.js';
import { Ship } from './src/ship.js';
import { Player } from './src/player.js';

/**
 * Point d'entrée de l'application
 * Initialise le jeu et configure les écouteurs d'événements
 */

// Instances
const shipPlacement = new ShipPlacement();
let game = null;
let placementGameboard = null;

/**
 * Initialise l'application au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser les écouteurs d'événements
  setupPlacementListeners();
  
  // Afficher l'écran de placement
  showPlacementScreen();
  
  // Message de bienvenue
  console.log('🎮 Bataille Navale chargée !');
});

/**
 * Affiche l'écran de placement
 */
function showPlacementScreen() {
  const placementScreen = document.getElementById('placement-screen');
  const gameScreen = document.getElementById('game-screen');
  
  placementScreen.classList.add('active');
  gameScreen.classList.remove('active');
  
  // Réinitialiser le placement
  shipPlacement.reset();
  
  // Créer un plateau temporaire pour le placement
  placementGameboard = new Gameboard();
  
  // Créer le plateau de placement
  const placementBoard = document.getElementById('placement-board');
  DOMController.createEmptyBoard(placementBoard, 10);
  
  // Ajouter les écouteurs pour le placement
  setupPlacementBoardListeners();
  
  // Mettre à jour l'affichage
  updatePlacementUI();
}

/**
 * Met à jour l'interface de placement
 */
function updatePlacementUI() {
  const currentShip = shipPlacement.getCurrentShip();
  
  if (currentShip) {
    document.getElementById('ship-name').textContent = currentShip.name;
    document.getElementById('ship-length').textContent = currentShip.length;
    document.getElementById('ship-orientation').textContent = 
      shipPlacement.getOrientation() === 'horizontal' ? 'Horizontal' : 'Vertical';
    
    // Mettre à jour la liste des navires
    const shipItems = document.querySelectorAll('.ship-item');
    shipItems.forEach((item, index) => {
      item.classList.remove('active', 'placed');
      if (index < shipPlacement.currentShipIndex) {
        item.classList.add('placed');
      } else if (index === shipPlacement.currentShipIndex) {
        item.classList.add('active');
      }
    });
  }
  
  // Activer/désactiver le bouton de démarrage
  const startBtn = document.getElementById('start-game-btn');
  startBtn.disabled = !shipPlacement.allShipsPlaced();
}

/**
 * Configure les écouteurs pour le placement
 */
function setupPlacementListeners() {
  // Rotation
  const rotateBtn = document.getElementById('rotate-btn');
  rotateBtn.addEventListener('click', () => {
    shipPlacement.toggleOrientation();
    updatePlacementUI();
    clearHoverPreview();
  });
  
  // Raccourci clavier R pour rotation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
      if (!shipPlacement.allShipsPlaced()) {
        shipPlacement.toggleOrientation();
        updatePlacementUI();
        clearHoverPreview();
      }
    }
  });
  
  // Placement aléatoire
  const randomBtn = document.getElementById('random-btn');
  randomBtn.addEventListener('click', async () => {
    await handleRandomPlacement();
  });
  
  // Démarrer la partie
  const startBtn = document.getElementById('start-game-btn');
  startBtn.addEventListener('click', () => {
    startGame();
  });
  
  // Bouton "Rejouer" (écran de fin)
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      showPlacementScreen();
    });
  }
  
  // Bouton "Nouvelle partie"
  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment recommencer une nouvelle partie ?')) {
        showPlacementScreen();
      }
    });
  }
}

/**
 * Configure les écouteurs pour le plateau de placement
 */
function setupPlacementBoardListeners() {
  const placementBoard = document.getElementById('placement-board');
  const cells = placementBoard.querySelectorAll('.cell');
  
  console.log(`🎯 Écouteurs placés sur ${cells.length} cellules`);
  
  cells.forEach(cell => {
    // Survol pour prévisualiser le placement
    cell.addEventListener('mouseenter', (e) => {
      if (shipPlacement.allShipsPlaced()) return;
      
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);
      const currentShip = shipPlacement.getCurrentShip();
      
      console.log(`👆 Survol sur (${x}, ${y})`);
      
      if (currentShip) {
        previewShipPlacement(x, y, currentShip.length, shipPlacement.getOrientation());
      }
    });
    
    // Clic pour placer le navire
    cell.addEventListener('click', (e) => {
      if (shipPlacement.allShipsPlaced()) return;
      
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);
      const currentShip = shipPlacement.getCurrentShip();
      
      if (currentShip) {
        handleShipPlacement(x, y);
      }
    });
  });
  
  // Effacer l'aperçu quand on quitte le plateau
  placementBoard.addEventListener('mouseleave', () => {
    clearHoverPreview();
  });
}

/**
 * Prévisualise le placement d'un navire
 */
function previewShipPlacement(x, y, length, orientation) {
  clearHoverPreview();
  
  const cells = document.querySelectorAll('#placement-board .cell');
  const coordinates = [];
  
  // Calculer les coordonnées du navire
  for (let i = 0; i < length; i++) {
    const newX = orientation === 'horizontal' ? x + i : x;
    const newY = orientation === 'vertical' ? y + i : y;
    coordinates.push({ x: newX, y: newY });
  }
  
  // Vérifier si le placement est valide
  const isValid = coordinates.every(coord => 
    coord.x >= 0 && coord.x < 10 && coord.y >= 0 && coord.y < 10
  ) && !coordinates.some(coord => 
    placementGameboard.ships.some(({ coordinates: shipCoords }) =>
      shipCoords.some(([sx, sy]) => sx === coord.x && sy === coord.y)
    )
  );
  
  // Appliquer l'aperçu
  cells.forEach(cell => {
    const cellX = parseInt(cell.dataset.x);
    const cellY = parseInt(cell.dataset.y);
    
    const isInPreview = coordinates.some(coord => coord.x === cellX && coord.y === cellY);
    
    if (isInPreview) {
      cell.classList.add(isValid ? 'hover-preview' : 'hover-invalid');
    }
  });
}

/**
 * Gère le placement d'un navire
 */
function handleShipPlacement(x, y) {
  const currentShip = shipPlacement.getCurrentShip();
  if (!currentShip) return;
  
  const ship = new Ship(currentShip.length);
  const orientation = shipPlacement.getOrientation();
  
  // Tenter de placer le navire
  const placed = placementGameboard.placeShip(ship, x, y, orientation);
  
  if (placed) {
    // Marquer le navire comme placé
    shipPlacement.confirmPlacement();
    
    // Rafraîchir l'affichage
    const placementBoard = document.getElementById('placement-board');
    DOMController.createEmptyBoard(placementBoard, 10);
    DOMController.renderShips(placementBoard, placementGameboard.getShips(), false);
    
    // Réattacher les écouteurs
    setupPlacementBoardListeners();
    
    // Mettre à jour l'interface
    updatePlacementUI();
    clearHoverPreview();
  } else {
    // Placement invalide
    alert('Impossible de placer le navire à cet endroit !');
  }
}

/**
 * Gère le placement aléatoire
 */
async function handleRandomPlacement() {
  // Réinitialiser
  placementGameboard = new Gameboard();
  shipPlacement.reset();
  
  const ships = shipPlacement.getShips();
  
  // Placer tous les navires aléatoirement
  for (const shipData of ships) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      
      const ship = new Ship(shipData.length);
      placed = placementGameboard.placeShip(ship, x, y, orientation);
      attempts++;
    }
    
    if (placed) {
      shipPlacement.confirmPlacement();
    }
  }
  
  // Afficher les navires sur le plateau
  const placementBoard = document.getElementById('placement-board');
  DOMController.createEmptyBoard(placementBoard, 10);
  DOMController.renderShips(placementBoard, placementGameboard.getShips(), false);
  
  updatePlacementUI();
}

/**
 * Démarre la partie
 */
function startGame() {
  // Créer le contrôleur de jeu
  game = new GameController();
  
  // Créer le joueur avec le plateau placé
  const player = new Player('Joueur', 'real');
  player.gameboard = placementGameboard;
  game.player = player;
  game.player1 = player;
  
  // Initialiser le jeu
  game.initGame();
  
  // Passer à l'écran de jeu
  const placementScreen = document.getElementById('placement-screen');
  const gameScreen = document.getElementById('game-screen');
  
  placementScreen.classList.remove('active');
  gameScreen.classList.add('active');
  
  // Configurer les écouteurs du jeu
  setupGameListeners();
}

/**
 * Configure les écouteurs pour le jeu
 */
function setupGameListeners() {
  const enemyBoard = document.getElementById('enemy-board');
  const cells = enemyBoard.querySelectorAll('.cell');
  
  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      if (!game.gameOver && game.currentPlayer === game.player) {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        game.handlePlayerAttack(x, y);
      }
    });
  });
}

/**
 * Efface l'aperçu du survol
 */
function clearHoverPreview() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('hover-preview', 'hover-invalid');
  });
}

