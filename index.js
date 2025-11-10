import { GameController } from './src/gameController.js';

/**
 * Point d'entrée de l'application
 * Initialise le jeu et configure les écouteurs d'événements
 */

// Instance du contrôleur de jeu
const game = new GameController();

/**
 * Initialise l'application au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser les écouteurs d'événements
  setupEventListeners();
  
  // Message de bienvenue
  console.log('🎮 Bataille Navale chargée !');
});

/**
 * Configure tous les écouteurs d'événements
 */
function setupEventListeners() {
  // Bouton "Nouvelle Partie"
  const newGameBtn = document.getElementById('new-game-btn');
  if (newGameBtn) {
    newGameBtn.addEventListener('click', () => {
      game.initGame();
    });
  }

  // Bouton "Recommencer"
  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      game.resetGame();
    });
  }

  // Bouton "Rejouer" (écran de fin)
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      game.resetGame();
    });
  }
}
