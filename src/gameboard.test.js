import { Gameboard } from './gameboard.js';
import { Ship } from './ship.js';

describe('Gameboard', () => {
  describe('Constructeur', () => {
    test('crée un plateau de taille par défaut (10x10)', () => {
      const board = new Gameboard();
      expect(board.size).toBe(10);
      expect(board.ships).toEqual([]);
      expect(board.missedShots).toEqual([]);
    });

    test('crée un plateau de taille personnalisée', () => {
      const board = new Gameboard(8);
      expect(board.size).toBe(8);
    });
  });

  describe('placeShip()', () => {
    let board;
    let ship;

    beforeEach(() => {
      board = new Gameboard();
      ship = new Ship(3);
    });

    test('place un navire horizontalement aux coordonnées valides', () => {
      const result = board.placeShip(ship, 0, 0, 'horizontal');
      expect(result).toBe(true);
      expect(board.ships.length).toBe(1);
    });

    test('place un navire verticalement aux coordonnées valides', () => {
      const result = board.placeShip(ship, 0, 0, 'vertical');
      expect(result).toBe(true);
      expect(board.ships.length).toBe(1);
    });

    test('stocke les coordonnées correctes pour un navire horizontal', () => {
      board.placeShip(ship, 2, 3, 'horizontal');
      const placedShip = board.ships[0];
      expect(placedShip.coordinates).toEqual([[2, 3], [3, 3], [4, 3]]);
    });

    test('stocke les coordonnées correctes pour un navire vertical', () => {
      board.placeShip(ship, 2, 3, 'vertical');
      const placedShip = board.ships[0];
      expect(placedShip.coordinates).toEqual([[2, 3], [2, 4], [2, 5]]);
    });

    test('refuse de placer un navire qui dépasse le bord droit', () => {
      const result = board.placeShip(ship, 8, 0, 'horizontal');
      expect(result).toBe(false);
      expect(board.ships.length).toBe(0);
    });

    test('refuse de placer un navire qui dépasse le bord inférieur', () => {
      const result = board.placeShip(ship, 0, 8, 'vertical');
      expect(result).toBe(false);
      expect(board.ships.length).toBe(0);
    });

    test('refuse de placer un navire sur des coordonnées négatives', () => {
      const result = board.placeShip(ship, -1, 0, 'horizontal');
      expect(result).toBe(false);
    });

    test('refuse de placer un navire qui chevauche un autre navire', () => {
      board.placeShip(ship, 2, 2, 'horizontal');
      const ship2 = new Ship(3);
      const result = board.placeShip(ship2, 3, 0, 'vertical');
      expect(result).toBe(false);
      expect(board.ships.length).toBe(1);
    });

    test('permet de placer plusieurs navires qui ne se chevauchent pas', () => {
      const ship2 = new Ship(2);
      board.placeShip(ship, 0, 0, 'horizontal');
      const result = board.placeShip(ship2, 0, 2, 'horizontal');
      expect(result).toBe(true);
      expect(board.ships.length).toBe(2);
    });

    test('lance une erreur si le paramètre n\'est pas une instance de Ship', () => {
      expect(() => board.placeShip({}, 0, 0)).toThrow('Le premier paramètre doit être une instance de Ship');
    });

    test('lance une erreur si l\'orientation est invalide', () => {
      expect(() => board.placeShip(ship, 0, 0, 'diagonal')).toThrow('L\'orientation doit être "horizontal" ou "vertical"');
    });
  });

  describe('receiveAttack()', () => {
    let board;
    let ship;

    beforeEach(() => {
      board = new Gameboard();
      ship = new Ship(3);
      board.placeShip(ship, 2, 3, 'horizontal'); // Occupe [2,3], [3,3], [4,3]
    });

    test('retourne "hit" quand l\'attaque touche un navire', () => {
      const result = board.receiveAttack(2, 3);
      expect(result).toBe('hit');
    });

    test('retourne "miss" quand l\'attaque manque tous les navires', () => {
      const result = board.receiveAttack(0, 0);
      expect(result).toBe('miss');
    });

    test('appelle la méthode hit() du navire touché', () => {
      expect(ship.hits).toBe(0);
      board.receiveAttack(2, 3);
      expect(ship.hits).toBe(1);
      board.receiveAttack(3, 3);
      expect(ship.hits).toBe(2);
    });

    test('enregistre les coordonnées des tirs manqués', () => {
      board.receiveAttack(0, 0);
      board.receiveAttack(1, 1);
      expect(board.missedShots).toContainEqual([0, 0]);
      expect(board.missedShots).toContainEqual([1, 1]);
      expect(board.missedShots.length).toBe(2);
    });

    test('n\'enregistre pas les tirs réussis comme manqués', () => {
      board.receiveAttack(2, 3);
      expect(board.missedShots).toEqual([]);
    });

    test('enregistre les coordonnées des tirs réussis', () => {
      board.receiveAttack(2, 3);
      board.receiveAttack(3, 3);
      expect(board.hits).toContainEqual([2, 3]);
      expect(board.hits).toContainEqual([3, 3]);
      expect(board.hits.length).toBe(2);
    });

    test('retourne "already-shot" si la position a déjà été attaquée (miss)', () => {
      board.receiveAttack(0, 0);
      const result = board.receiveAttack(0, 0);
      expect(result).toBe('already-shot');
      expect(board.missedShots.length).toBe(1);
    });

    test('retourne "already-shot" si la position a déjà été attaquée (hit)', () => {
      board.receiveAttack(2, 3);
      const result = board.receiveAttack(2, 3);
      expect(result).toBe('already-shot');
    });

    test('lance une erreur pour des coordonnées invalides', () => {
      expect(() => board.receiveAttack(-1, 0)).toThrow('Coordonnées invalides');
      expect(() => board.receiveAttack(0, -1)).toThrow('Coordonnées invalides');
      expect(() => board.receiveAttack(10, 0)).toThrow('Coordonnées invalides');
      expect(() => board.receiveAttack(0, 10)).toThrow('Coordonnées invalides');
    });
  });

  describe('getMissedShots()', () => {
    test('retourne un tableau vide au début', () => {
      const board = new Gameboard();
      expect(board.getMissedShots()).toEqual([]);
    });

    test('retourne toutes les coordonnées des tirs manqués', () => {
      const board = new Gameboard();
      board.receiveAttack(0, 0);
      board.receiveAttack(1, 1);
      board.receiveAttack(5, 5);
      
      const missed = board.getMissedShots();
      expect(missed).toContainEqual([0, 0]);
      expect(missed).toContainEqual([1, 1]);
      expect(missed).toContainEqual([5, 5]);
      expect(missed.length).toBe(3);
    });

    test('ne retourne pas les tirs qui ont touché', () => {
      const board = new Gameboard();
      const ship = new Ship(2);
      board.placeShip(ship, 0, 0, 'horizontal');
      
      board.receiveAttack(0, 0); // hit
      board.receiveAttack(5, 5); // miss
      
      const missed = board.getMissedShots();
      expect(missed).toEqual([[5, 5]]);
    });

    test('retourne une copie du tableau (pas de mutation)', () => {
      const board = new Gameboard();
      board.receiveAttack(0, 0);
      
      const missed = board.getMissedShots();
      missed.push([9, 9]);
      
      expect(board.getMissedShots().length).toBe(1);
    });
  });

  describe('allShipsSunk()', () => {
    test('retourne false s\'il n\'y a pas de navires sur le plateau', () => {
      const board = new Gameboard();
      expect(board.allShipsSunk()).toBe(false);
    });

    test('retourne false si au moins un navire n\'est pas coulé', () => {
      const board = new Gameboard();
      const ship1 = new Ship(2);
      const ship2 = new Ship(3);
      
      board.placeShip(ship1, 0, 0, 'horizontal');
      board.placeShip(ship2, 0, 2, 'horizontal');
      
      // Couler ship1
      board.receiveAttack(0, 0);
      board.receiveAttack(1, 0);
      
      expect(board.allShipsSunk()).toBe(false);
    });

    test('retourne true si tous les navires sont coulés', () => {
      const board = new Gameboard();
      const ship1 = new Ship(2);
      const ship2 = new Ship(2);
      
      board.placeShip(ship1, 0, 0, 'horizontal');
      board.placeShip(ship2, 0, 2, 'horizontal');
      
      // Couler ship1
      board.receiveAttack(0, 0);
      board.receiveAttack(1, 0);
      
      // Couler ship2
      board.receiveAttack(0, 2);
      board.receiveAttack(1, 2);
      
      expect(board.allShipsSunk()).toBe(true);
    });

    test('fonctionne avec un seul navire', () => {
      const board = new Gameboard();
      const ship = new Ship(1);
      board.placeShip(ship, 0, 0, 'horizontal');
      
      expect(board.allShipsSunk()).toBe(false);
      
      board.receiveAttack(0, 0);
      
      expect(board.allShipsSunk()).toBe(true);
    });
  });

  describe('Scénarios de jeu complets', () => {
    test('partie complète avec plusieurs navires', () => {
      const board = new Gameboard();
      const destroyer = new Ship(2);
      const submarine = new Ship(3);
      const battleship = new Ship(4);
      
      // Placer les navires
      board.placeShip(destroyer, 0, 0, 'horizontal');
      board.placeShip(submarine, 0, 2, 'horizontal');
      board.placeShip(battleship, 5, 5, 'vertical');
      
      expect(board.ships.length).toBe(3);
      expect(board.allShipsSunk()).toBe(false);
      
      // Quelques tirs manqués
      expect(board.receiveAttack(9, 9)).toBe('miss');
      expect(board.receiveAttack(4, 4)).toBe('miss');
      
      // Couler le destroyer
      board.receiveAttack(0, 0);
      board.receiveAttack(1, 0);
      expect(destroyer.isSunk()).toBe(true);
      expect(board.allShipsSunk()).toBe(false);
      
      // Couler le submarine
      board.receiveAttack(0, 2);
      board.receiveAttack(1, 2);
      board.receiveAttack(2, 2);
      expect(submarine.isSunk()).toBe(true);
      expect(board.allShipsSunk()).toBe(false);
      
      // Couler le battleship
      board.receiveAttack(5, 5);
      board.receiveAttack(5, 6);
      board.receiveAttack(5, 7);
      board.receiveAttack(5, 8);
      expect(battleship.isSunk()).toBe(true);
      
      // Tous les navires coulés
      expect(board.allShipsSunk()).toBe(true);
      
      // Vérifier les statistiques
      expect(board.getMissedShots().length).toBe(2);
      expect(board.getHits().length).toBe(9);
    });

    test('gestion des tirs répétés', () => {
      const board = new Gameboard();
      const ship = new Ship(2);
      board.placeShip(ship, 0, 0, 'horizontal');
      
      expect(board.receiveAttack(0, 0)).toBe('hit');
      expect(board.receiveAttack(0, 0)).toBe('already-shot');
      
      expect(board.receiveAttack(5, 5)).toBe('miss');
      expect(board.receiveAttack(5, 5)).toBe('already-shot');
      
      expect(ship.hits).toBe(1);
      expect(board.missedShots.length).toBe(1);
    });
  });
});
