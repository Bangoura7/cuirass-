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
   * Génère une attaque intelligente (pour les joueurs contrôlés par ordinateur)
   * @param {Player} opponent - Le joueur adverse
   * @returns {object} Les coordonnées de l'attaque {x, y} et le résultat
   */
  smartAttack(opponent) {
    if (!(opponent instanceof Player)) {
      throw new Error('L\'adversaire doit être une instance de Player');
    }

    // Initialiser la liste de cibles si elle n'existe pas
    if (!this.targetQueue) {
      this.targetQueue = [];
    }

    const size = opponent.gameboard.size;
    let x, y, result;

    // Si on a des cibles potentielles (cases adjacentes à un coup réussi)
    if (this.targetQueue.length > 0) {
      // Prendre la première cible de la file
      const target = this.targetQueue.shift();
      x = target.x;
      y = target.y;
      result = opponent.gameboard.receiveAttack(x, y);

      // Si c'est un coup réussi, ajouter les cases adjacentes à la file
      if (result === 'hit') {
        this._addAdjacentTargets(x, y, size, opponent);
      }
    } else {
      // Sinon, attaque aléatoire
      do {
        x = Math.floor(Math.random() * size);
        y = Math.floor(Math.random() * size);
        result = opponent.gameboard.receiveAttack(x, y);
      } while (result === 'already-shot');

      // Si c'est un coup réussi, ajouter les cases adjacentes
      if (result === 'hit') {
        this._addAdjacentTargets(x, y, size, opponent);
      }
    }

    return { x, y, result };
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
   * Ajoute les cases adjacentes à la file de cibles
   * @private
   */
  _addAdjacentTargets(x, y, size, opponent) {
    const adjacents = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 }
    ];

    for (const adj of adjacents) {
      // Vérifier que la case est valide et non déjà attaquée
      if (
        adj.x >= 0 && adj.x < size &&
        adj.y >= 0 && adj.y < size &&
        !this._isInQueue(adj.x, adj.y) &&
        !this._isAlreadyShot(adj.x, adj.y, opponent)
      ) {
        this.targetQueue.push(adj);
      }
    }
  }

  /**
   * Vérifie si une case est déjà dans la file de cibles
   * @private
   */
  _isInQueue(x, y) {
    return this.targetQueue.some(target => target.x === x && target.y === y);
  }

  /**
   * Vérifie si une case a déjà été attaquée
   * @private
   */
  _isAlreadyShot(x, y, opponent) {
    const hits = opponent.gameboard.getHits();
    const misses = opponent.gameboard.getMissedShots();
    
    return hits.some(([hx, hy]) => hx === x && hy === y) ||
           misses.some(([mx, my]) => mx === x && my === y);
  }

  /**
   * Vérifie si le joueur a perdu (tous ses navires sont coulés)
   * @returns {boolean} true si tous les navires sont coulés, false sinon
   */
  hasLost() {
    return this.gameboard.allShipsSunk();
  }
}
