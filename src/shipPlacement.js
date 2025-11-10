/**
 * Module pour gérer le placement des navires
 */
export class ShipPlacement {
  constructor() {
    this.ships = [
      { name: 'Porte-avions', length: 5, placed: false },
      { name: 'Cuirassé', length: 4, placed: false },
      { name: 'Croiseur', length: 3, placed: false },
      { name: 'Sous-marin', length: 3, placed: false },
      { name: 'Destroyer', length: 2, placed: false }
    ];
    this.currentShipIndex = 0;
    this.currentOrientation = 'horizontal';
    this.draggedShip = null;
  }

  /**
   * Obtient le navire actuellement sélectionné
   */
  getCurrentShip() {
    if (this.currentShipIndex < this.ships.length) {
      return this.ships[this.currentShipIndex];
    }
    return null;
  }

  /**
   * Marque le navire actuel comme placé et passe au suivant
   */
  confirmPlacement() {
    if (this.currentShipIndex < this.ships.length) {
      this.ships[this.currentShipIndex].placed = true;
      this.currentShipIndex++;
    }
  }

  /**
   * Vérifie si tous les navires ont été placés
   */
  allShipsPlaced() {
    return this.currentShipIndex >= this.ships.length;
  }

  /**
   * Bascule l'orientation du navire
   */
  toggleOrientation() {
    this.currentOrientation = this.currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
  }

  /**
   * Obtient l'orientation actuelle
   */
  getOrientation() {
    return this.currentOrientation;
  }

  /**
   * Réinitialise le placement
   */
  reset() {
    this.ships.forEach(ship => ship.placed = false);
    this.currentShipIndex = 0;
    this.currentOrientation = 'horizontal';
  }

  /**
   * Obtient tous les navires
   */
  getShips() {
    return [...this.ships];
  }

  /**
   * Place tous les navires de manière aléatoire
   */
  async placeRandomly(gameboard) {
    const { Ship } = await import('./ship.js');
    
    for (const shipData of this.ships) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!placed && attempts < maxAttempts) {
        const x = Math.floor(Math.random() * gameboard.size);
        const y = Math.floor(Math.random() * gameboard.size);
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        
        const ship = new Ship(shipData.length);
        placed = gameboard.placeShip(ship, x, y, orientation);
        attempts++;
      }

      if (!placed) {
        throw new Error(`Impossible de placer le navire ${shipData.name}`);
      }
    }
  }
}
