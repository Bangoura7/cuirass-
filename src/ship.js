/**
 * Classe représentant un navire dans le jeu de bataille navale
 */
export class Ship {
  /**
   * Crée un nouveau navire
   * @param {number} length - La longueur du navire (nombre de cases qu'il occupe)
   */
  constructor(length) {
    if (typeof length !== 'number' || length <= 0) {
      throw new Error('La longueur du navire doit être un nombre positif');
    }
    this.length = length;
    this.hits = 0;
  }

  /**
   * Enregistre un coup sur le navire
   * Incrémente le nombre de coups reçus
   */
  hit() {
    if (!this.isSunk()) {
      this.hits++;
    }
  }

  /**
   * Détermine si le navire est coulé
   * Un navire est coulé quand le nombre de coups reçus est égal ou supérieur à sa longueur
   * @returns {boolean} true si le navire est coulé, false sinon
   */
  isSunk() {
    return this.hits >= this.length;
  }
}
