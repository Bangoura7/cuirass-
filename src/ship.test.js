import { Ship } from './ship.js';

describe('Ship', () => {
  describe('Constructeur', () => {
    test('crée un navire avec une longueur spécifiée', () => {
      const ship = new Ship(3);
      expect(ship.length).toBe(3);
      expect(ship.hits).toBe(0);
    });

    test('crée un navire de longueur 1', () => {
      const ship = new Ship(1);
      expect(ship.length).toBe(1);
      expect(ship.hits).toBe(0);
    });

    test('crée un grand navire de longueur 5', () => {
      const ship = new Ship(5);
      expect(ship.length).toBe(5);
      expect(ship.hits).toBe(0);
    });

    test('rejette une longueur invalide (0)', () => {
      expect(() => new Ship(0)).toThrow('La longueur du navire doit être un nombre positif');
    });

    test('rejette une longueur négative', () => {
      expect(() => new Ship(-1)).toThrow('La longueur du navire doit être un nombre positif');
    });

    test('rejette une longueur non-numérique', () => {
      expect(() => new Ship('3')).toThrow('La longueur du navire doit être un nombre positif');
    });
  });

  describe('hit()', () => {
    test('augmente le nombre de coups de 1', () => {
      const ship = new Ship(3);
      ship.hit();
      expect(ship.hits).toBe(1);
    });

    test('augmente le nombre de coups à chaque appel', () => {
      const ship = new Ship(3);
      ship.hit();
      ship.hit();
      expect(ship.hits).toBe(2);
    });

    test('peut être appelée plusieurs fois', () => {
      const ship = new Ship(4);
      ship.hit();
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.hits).toBe(4);
    });

    test('n\'augmente pas les coups au-delà de la longueur du navire', () => {
      const ship = new Ship(2);
      ship.hit();
      ship.hit();
      ship.hit(); // Le navire est déjà coulé
      expect(ship.hits).toBe(2);
    });
  });

  describe('isSunk()', () => {
    test('retourne false pour un navire neuf', () => {
      const ship = new Ship(3);
      expect(ship.isSunk()).toBe(false);
    });

    test('retourne false quand le navire n\'a pas reçu assez de coups', () => {
      const ship = new Ship(3);
      ship.hit();
      expect(ship.isSunk()).toBe(false);
      ship.hit();
      expect(ship.isSunk()).toBe(false);
    });

    test('retourne true quand le navire a reçu autant de coups que sa longueur', () => {
      const ship = new Ship(3);
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });

    test('retourne true pour un navire de longueur 1 après 1 coup', () => {
      const ship = new Ship(1);
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });

    test('reste true après que le navire soit coulé', () => {
      const ship = new Ship(2);
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(true);
      ship.hit(); // Tente un coup supplémentaire
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe('Scénarios d\'utilisation', () => {
    test('petit navire (destroyer) - longueur 2', () => {
      const destroyer = new Ship(2);
      expect(destroyer.isSunk()).toBe(false);
      
      destroyer.hit();
      expect(destroyer.isSunk()).toBe(false);
      
      destroyer.hit();
      expect(destroyer.isSunk()).toBe(true);
    });

    test('navire moyen (sous-marin) - longueur 3', () => {
      const submarine = new Ship(3);
      expect(submarine.isSunk()).toBe(false);
      
      submarine.hit();
      submarine.hit();
      expect(submarine.isSunk()).toBe(false);
      
      submarine.hit();
      expect(submarine.isSunk()).toBe(true);
    });

    test('grand navire (cuirassé) - longueur 4', () => {
      const battleship = new Ship(4);
      expect(battleship.isSunk()).toBe(false);
      
      battleship.hit();
      battleship.hit();
      battleship.hit();
      expect(battleship.isSunk()).toBe(false);
      
      battleship.hit();
      expect(battleship.isSunk()).toBe(true);
    });

    test('très grand navire (porte-avions) - longueur 5', () => {
      const carrier = new Ship(5);
      
      for (let i = 0; i < 4; i++) {
        carrier.hit();
        expect(carrier.isSunk()).toBe(false);
      }
      
      carrier.hit();
      expect(carrier.isSunk()).toBe(true);
    });
  });
});
