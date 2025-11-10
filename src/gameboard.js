import { Ship } from './ship.js';

/**
 * Classe représentant le plateau de jeu de bataille navale
 */
export class Gameboard {
  /**
   * Crée un nouveau plateau de jeu
   * @param {number} size - La taille du plateau (par défaut 10x10)
   */
  constructor(size = 10) {
    this.size = size;
    this.ships = []; // Liste des navires placés avec leurs positions
    this.missedShots = []; // Coordonnées des tirs manqués
    this.hits = []; // Coordonnées des tirs réussis
  }

  /**
   * Place un navire sur le plateau à des coordonnées spécifiques
   * @param {Ship} ship - Le navire à placer
   * @param {number} x - Coordonnée x de départ
   * @param {number} y - Coordonnée y de départ
   * @param {string} orientation - 'horizontal' ou 'vertical'
   * @returns {boolean} true si le placement a réussi, false sinon
   */
  placeShip(ship, x, y, orientation = 'horizontal') {
    // Validation des paramètres
    if (!(ship instanceof Ship)) {
      throw new Error('Le premier paramètre doit être une instance de Ship');
    }

    if (!this._isValidOrientation(orientation)) {
      throw new Error('L\'orientation doit être "horizontal" ou "vertical"');
    }

    if (!this._isValidCoordinate(x, y)) {
      return false;
    }

    // Calculer toutes les coordonnées que le navire occupera
    const coordinates = this._getShipCoordinates(x, y, ship.length, orientation);

    // Vérifier si le placement est valide
    if (!this._canPlaceShip(coordinates)) {
      return false;
    }

    // Placer le navire
    this.ships.push({
      ship,
      coordinates,
      orientation
    });

    return true;
  }

  /**
   * Reçoit une attaque à des coordonnées spécifiques
   * @param {number} x - Coordonnée x
   * @param {number} y - Coordonnée y
   * @returns {string} 'hit', 'miss', ou 'already-shot'
   */
  receiveAttack(x, y) {
    // Valider les coordonnées
    if (!this._isValidCoordinate(x, y)) {
      throw new Error('Coordonnées invalides');
    }

    const coordString = `${x},${y}`;

    // Vérifier si cette position a déjà été attaquée
    if (this._isAlreadyShot(x, y)) {
      return 'already-shot';
    }

    // Chercher si un navire est à cette position
    const targetShip = this._findShipAt(x, y);

    if (targetShip) {
      // Touché !
      targetShip.ship.hit();
      this.hits.push([x, y]);
      return 'hit';
    } else {
      // Manqué
      this.missedShots.push([x, y]);
      return 'miss';
    }
  }

  /**
   * Retourne les coordonnées de tous les tirs manqués
   * @returns {Array} Tableau de coordonnées [x, y]
   */
  getMissedShots() {
    return [...this.missedShots];
  }

  /**
   * Retourne les coordonnées de tous les tirs réussis
   * @returns {Array} Tableau de coordonnées [x, y]
   */
  getHits() {
    return [...this.hits];
  }

  /**
   * Vérifie si tous les navires ont été coulés
   * @returns {boolean} true si tous les navires sont coulés, false sinon
   */
  allShipsSunk() {
    if (this.ships.length === 0) {
      return false;
    }

    return this.ships.every(({ ship }) => ship.isSunk());
  }

  /**
   * Retourne tous les navires placés sur le plateau
   * @returns {Array} Tableau des navires avec leurs informations
   */
  getShips() {
    return this.ships.map(({ ship, coordinates, orientation }) => ({
      ship,
      coordinates: [...coordinates],
      orientation
    }));
  }

  // Méthodes privées (helpers)

  /**
   * Vérifie si les coordonnées sont valides
   * @private
   */
  _isValidCoordinate(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  /**
   * Vérifie si l'orientation est valide
   * @private
   */
  _isValidOrientation(orientation) {
    return orientation === 'horizontal' || orientation === 'vertical';
  }

  /**
   * Calcule toutes les coordonnées qu'un navire occupera
   * @private
   */
  _getShipCoordinates(x, y, length, orientation) {
    const coordinates = [];
    for (let i = 0; i < length; i++) {
      if (orientation === 'horizontal') {
        coordinates.push([x + i, y]);
      } else {
        coordinates.push([x, y + i]);
      }
    }
    return coordinates;
  }

  /**
   * Vérifie si un navire peut être placé aux coordonnées données
   * @private
   */
  _canPlaceShip(coordinates) {
    // Vérifier que toutes les coordonnées sont dans les limites
    for (const [x, y] of coordinates) {
      if (!this._isValidCoordinate(x, y)) {
        return false;
      }
    }

    // Vérifier qu'aucune coordonnée n'est déjà occupée
    for (const [x, y] of coordinates) {
      if (this._isOccupied(x, y)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Vérifie si une position est déjà occupée par un navire
   * @private
   */
  _isOccupied(x, y) {
    return this.ships.some(({ coordinates }) =>
      coordinates.some(([shipX, shipY]) => shipX === x && shipY === y)
    );
  }

  /**
   * Vérifie si une position a déjà été attaquée
   * @private
   */
  _isAlreadyShot(x, y) {
    const checkCoord = (coord) => coord[0] === x && coord[1] === y;
    return this.missedShots.some(checkCoord) || this.hits.some(checkCoord);
  }

  /**
   * Trouve le navire à une position donnée
   * @private
   */
  _findShipAt(x, y) {
    return this.ships.find(({ coordinates }) =>
      coordinates.some(([shipX, shipY]) => shipX === x && shipY === y)
    );
  }
}
