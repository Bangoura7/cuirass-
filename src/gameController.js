import { Player } from './player.js';
import { Ship } from './ship.js';
import { DOMController } from './domController.js';

/**
 * Contrôleur principal du jeu
 * Gère le flux du jeu, les tours, et les conditions de victoire
 */
export class GameController {
  constructor() {
    this.player1 = null;
    this.player2 = null;
    this.currentPlayer = null;
    this.gameOver = false;
  }

  /**
   * Initialise une nouvelle partie
   */
  initGame() {
    this.gameOver = false;
    DOMController.hideGameOver();

    // Créer les joueurs (ou utiliser le joueur existant avec ses navires)
    if (!this.player1) {
      this.player1 = new Player('Joueur', 'real');
      // Placer les navires uniquement si pas déjà placés
      if (this.player1.gameboard.ships.length === 0) {
        this._placeShipsForPlayer(this.player1);
      }
    }
    
    this.player2 = new Player('Ordinateur', 'computer');
    this._placeShipsForPlayer(this.player2);

    // Le joueur humain commence
    this.currentPlayer = this.player1;

    // Afficher les plateaux
    this.renderBoards();

    // Afficher le message de début
    DOMController.displayMessage('C\'est votre tour ! Cliquez sur le plateau ennemi pour attaquer.', 'info');
    DOMController.updateCurrentPlayer(this.currentPlayer.name);
  }

  /**
   * Place les navires pour un joueur (positions prédéfinies pour l'instant)
   * @private
   */
  _placeShipsForPlayer(player) {
    // Flotte standard de bataille navale
    const fleet = [
      { length: 5, name: 'Porte-avions' },
      { length: 4, name: 'Cuirassé' },
      { length: 3, name: 'Croiseur' },
      { length: 3, name: 'Sous-marin' },
      { length: 2, name: 'Destroyer' }
    ];

    // Positions prédéfinies pour le joueur
    const playerPositions = [
      { x: 0, y: 0, orientation: 'horizontal' },
      { x: 0, y: 2, orientation: 'horizontal' },
      { x: 0, y: 4, orientation: 'horizontal' },
      { x: 5, y: 0, orientation: 'vertical' },
      { x: 7, y: 0, orientation: 'vertical' }
    ];

    // Positions prédéfinies pour l'ordinateur
    const computerPositions = [
      { x: 2, y: 1, orientation: 'vertical' },
      { x: 5, y: 5, orientation: 'horizontal' },
      { x: 0, y: 7, orientation: 'horizontal' },
      { x: 7, y: 2, orientation: 'vertical' },
      { x: 4, y: 9, orientation: 'horizontal' }
    ];

    const positions = player.isReal() ? playerPositions : computerPositions;

    fleet.forEach((shipData, index) => {
      const ship = new Ship(shipData.length);
      const pos = positions[index];
      player.gameboard.placeShip(ship, pos.x, pos.y, pos.orientation);
    });
  }

  /**
   * Affiche les deux plateaux de jeu
   */
  renderBoards() {
    const playerBoard = document.getElementById('player-board');
    const enemyBoard = document.getElementById('enemy-board');

    if (playerBoard && enemyBoard) {
      // Afficher le plateau du joueur (avec les navires visibles)
      DOMController.renderBoard(this.player1.gameboard, playerBoard, false);

      // Afficher le plateau ennemi (navires masqués, cliquable)
      DOMController.renderBoard(
        this.player2.gameboard,
        enemyBoard,
        true,
        (x, y) => this.handlePlayerAttack(x, y)
      );
    }
  }

  /**
   * Gère l'attaque du joueur humain
   * @param {number} x - Coordonnée x
   * @param {number} y - Coordonnée y
   */
  handlePlayerAttack(x, y) {
    // Vérifier si le jeu est terminé
    if (this.gameOver) return;

    // Vérifier que c'est le tour du joueur
    if (!this.currentPlayer.isReal()) return;

    // Effectuer l'attaque
    const result = this.player1.attack(this.player2, x, y);

    // Gérer le résultat
    if (result === 'already-shot') {
      DOMController.displayMessage('Vous avez déjà tiré sur cette case !', 'error');
      return;
    }

    // Afficher le résultat
    if (result === 'hit') {
      DOMController.displayMessage('Touché ! 🎯', 'success');
    } else {
      DOMController.displayMessage('Manqué ! 💦', 'info');
    }

    // Rafraîchir l'affichage
    this.renderBoards();

    // Vérifier si le joueur a gagné
    if (this._checkGameOver()) return;

    // Passer au tour de l'ordinateur
    this._switchTurn();
    
    // L'ordinateur joue après un court délai
    setTimeout(() => this.handleComputerTurn(), 1000);
  }

  /**
   * Gère le tour de l'ordinateur
   */
  handleComputerTurn() {
    if (this.gameOver) return;

    // Désactiver les clics pendant le tour de l'ordinateur
    DOMController.setEnemyBoardClickable(false);

    // L'ordinateur attaque avec l'IA intelligente
    const attack = this.player2.smartAttack(this.player1);

    // Afficher le résultat
    const message = attack.result === 'hit'
      ? `L'ordinateur a touché en (${attack.x}, ${attack.y}) ! 💥`
      : `L'ordinateur a manqué en (${attack.x}, ${attack.y})`;
    
    DOMController.displayMessage(message, attack.result === 'hit' ? 'error' : 'info');

    // Rafraîchir l'affichage
    this.renderBoards();

    // Vérifier si l'ordinateur a gagné
    if (this._checkGameOver()) return;

    // Repasser au tour du joueur
    this._switchTurn();
    DOMController.setEnemyBoardClickable(true);
    DOMController.displayMessage('C\'est votre tour ! Cliquez sur le plateau ennemi pour attaquer.', 'info');
  }

  /**
   * Change le joueur actuel
   * @private
   */
  _switchTurn() {
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    DOMController.updateCurrentPlayer(this.currentPlayer.name);
  }

  /**
   * Vérifie si la partie est terminée
   * @returns {boolean} true si la partie est terminée
   * @private
   */
  _checkGameOver() {
    if (this.player1.hasLost()) {
      this.gameOver = true;
      DOMController.showGameOver(this.player2.name);
      DOMController.displayMessage('L\'ordinateur a gagné ! 🤖', 'error');
      return true;
    }

    if (this.player2.hasLost()) {
      this.gameOver = true;
      DOMController.showGameOver(this.player1.name);
      DOMController.displayMessage('Vous avez gagné ! 🎉', 'success');
      return true;
    }

    return false;
  }

  /**
   * Réinitialise le jeu
   */
  resetGame() {
    this.initGame();
  }
}
