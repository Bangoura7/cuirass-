import { Gameboard } from './gameboard.js';

/**
 * Classe représentant un joueur dans le jeu de bataille navale
 */
export class Player {
  /**
   * Crée un nouveau joueur
   * @param {string} name - Le nom du joueur
   * @param {string} type - Le type de joueur: 'real' ou 'computer'
   */
  constructor(name, type = 'real') {
    if (!name || typeof name !== 'string') {
      throw new Error('Le nom du joueur doit être une chaîne de caractères non vide');
    }

    if (type !== 'real' && type !== 'computer') {
      throw new Error('Le type doit être "real" ou "computer"');
    }

    this.name = name;
    this.type = type;
    this.gameboard = new Gameboard();
  }

  /**
   * Vérifie si le joueur est un joueur réel
   * @returns {boolean} true si le joueur est réel, false sinon
   */
  isReal() {
    return this.type === 'real';
  }

  /**
   * Vérifie si le joueur est contrôlé par l'ordinateur
   * @returns {boolean} true si le joueur est un ordinateur, false sinon
   */
  isComputer() {
    return this.type === 'computer';
  }

  /**
   * Effectue une attaque sur le plateau d'un adversaire
   * @param {Player} opponent - Le joueur adverse
   * @param {number} x - Coordonnée x de l'attaque
   * @param {number} y - Coordonnée y de l'attaque
   * @returns {string} Le résultat de l'attaque ('hit', 'miss', ou 'already-shot')
   */
  attack(opponent, x, y) {
    if (!(opponent instanceof Player)) {
      throw new Error('L\'adversaire doit être une instance de Player');
    }

    return opponent.gameboard.receiveAttack(x, y);
  }

  /**
   * Génère une attaque aléatoire (pour les joueurs contrôlés par ordinateur)
   * @param {Player} opponent - Le joueur adverse
   * @returns {object} Les coordonnées de l'attaque {x, y} et le résultat
   */
  randomAttack(opponent) {
    if (!(opponent instanceof Player)) {
      throw new Error('L\'adversaire doit être une instance de Player');
    }

    const size = opponent.gameboard.size;
    let x, y, result;

    // Continuer jusqu'à trouver une case non encore attaquée
    do {
      x = Math.floor(Math.random() * size);
      y = Math.floor(Math.random() * size);
      result = opponent.gameboard.receiveAttack(x, y);
    } while (result === 'already-shot');

    return { x, y, result };
  }

  /**
   * Vérifie si le joueur a perdu (tous ses navires sont coulés)
   * @returns {boolean} true si tous les navires sont coulés, false sinon
   */
  hasLost() {
    return this.gameboard.allShipsSunk();
  }
}
