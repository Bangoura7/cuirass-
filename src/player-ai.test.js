import { Player } from './player.js';
import { Ship } from './ship.js';

describe('Player - IA Intelligente', () => {
  describe('smartAttack()', () => {
    let computer;
    let player;

    beforeEach(() => {
      computer = new Player('Computer', 'computer');
      player = new Player('Alice', 'real');
    });

    test('effectue une attaque valide', () => {
      const ship = new Ship(3);
      player.gameboard.placeShip(ship, 0, 0, 'horizontal');
      
      const attack = computer.smartAttack(player);
      
      expect(attack).toHaveProperty('x');
      expect(attack).toHaveProperty('y');
      expect(attack).toHaveProperty('result');
      expect(['hit', 'miss']).toContain(attack.result);
    });

    test('initialise targetQueue si elle n\'existe pas', () => {
      const ship = new Ship(2);
      player.gameboard.placeShip(ship, 0, 0, 'horizontal');
      
      expect(computer.targetQueue).toBeUndefined();
      computer.smartAttack(player);
      expect(computer.targetQueue).toBeDefined();
    });

    test('ajoute les cases adjacentes à la file après un coup réussi', () => {
      const ship = new Ship(3);
      player.gameboard.placeShip(ship, 5, 5, 'horizontal'); // Occupe [5,5], [6,5], [7,5]
      
      // Forcer une attaque spécifique qui touche
      player.gameboard.receiveAttack(5, 5); // hit
      computer.targetQueue = [];
      
      // Ajouter manuellement les cibles adjacentes
      computer._addAdjacentTargets(5, 5, 10, player);
      
      // Vérifier que les cases adjacentes ont été ajoutées
      expect(computer.targetQueue.length).toBeGreaterThan(0);
      
      // Les cases adjacentes possibles sont [4,5], [6,5], [5,4], [5,6]
      const possibleTargets = [
        { x: 4, y: 5 },
        { x: 6, y: 5 },
        { x: 5, y: 4 },
        { x: 5, y: 6 }
      ];
      
      // Au moins une case adjacente devrait être dans la file
      const hasAdjacentTarget = computer.targetQueue.some(target =>
        possibleTargets.some(pt => pt.x === target.x && pt.y === target.y)
      );
      expect(hasAdjacentTarget).toBe(true);
    });

    test('utilise les cibles de la file en priorité', () => {
      const ship = new Ship(4);
      player.gameboard.placeShip(ship, 3, 3, 'horizontal'); // [3,3], [4,3], [5,3], [6,3]
      
      // Ajouter manuellement une cible
      computer.targetQueue = [{ x: 3, y: 3 }];
      
      const attack = computer.smartAttack(player);
      
      // L'attaque devrait cibler la position de la file
      expect(attack.x).toBe(3);
      expect(attack.y).toBe(3);
      expect(attack.result).toBe('hit');
    });

    test('continue de cibler les cases adjacentes après plusieurs coups', () => {
      const ship = new Ship(4);
      player.gameboard.placeShip(ship, 5, 5, 'vertical'); // [5,5], [5,6], [5,7], [5,8]
      
      // Premier coup qui touche
      player.gameboard.receiveAttack(5, 5);
      computer.targetQueue = [];
      computer._addAdjacentTargets(5, 5, 10, player);
      
      const initialQueueLength = computer.targetQueue.length;
      expect(initialQueueLength).toBeGreaterThan(0);
      
      // Deuxième coup qui touche aussi
      const secondAttack = computer.smartAttack(player);
      
      if (secondAttack.result === 'hit') {
        // La file devrait avoir de nouvelles cibles adjacentes
        expect(computer.targetQueue).toBeDefined();
      }
    });

    test('évite de cibler les cases déjà attaquées', () => {
      const ship = new Ship(2);
      player.gameboard.placeShip(ship, 0, 0, 'horizontal');
      
      // Attaquer plusieurs fois
      const attacks = new Set();
      for (let i = 0; i < 20; i++) {
        const attack = computer.smartAttack(player);
        const coord = `${attack.x},${attack.y}`;
        expect(attacks.has(coord)).toBe(false);
        attacks.add(coord);
      }
    });

    test('lance une erreur si l\'adversaire n\'est pas une instance de Player', () => {
      expect(() => computer.smartAttack({})).toThrow('L\'adversaire doit être une instance de Player');
    });
  });

  describe('Scénario d\'IA intelligente complet', () => {
    test('l\'IA cible intelligemment un navire après le premier coup', () => {
      const computer = new Player('Computer', 'computer');
      const player = new Player('Alice', 'real');
      
      // Placer un navire vertical au centre
      const ship = new Ship(4);
      player.gameboard.placeShip(ship, 5, 5, 'vertical'); // [5,5], [5,6], [5,7], [5,8]
      
      // Simuler plusieurs attaques de l'IA
      let hits = 0;
      let totalAttacks = 0;
      const maxAttacks = 50;
      
      while (!ship.isSunk() && totalAttacks < maxAttacks) {
        const attack = computer.smartAttack(player);
        if (attack.result === 'hit') {
          hits++;
        }
        totalAttacks++;
      }
      
      // Le navire devrait être coulé
      expect(ship.isSunk()).toBe(true);
      
      // L'IA devrait avoir pris moins d'attaques qu'une approche purement aléatoire
      // (en moyenne, une approche aléatoire prendrait beaucoup plus d'attaques)
      expect(totalAttacks).toBeLessThan(30);
    });
  });
});
