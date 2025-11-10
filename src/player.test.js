import { Player } from './player.js';
import { Ship } from './ship.js';

describe('Player', () => {
  describe('Constructeur', () => {
    test('crée un joueur réel avec un nom', () => {
      const player = new Player('Alice', 'real');
      expect(player.name).toBe('Alice');
      expect(player.type).toBe('real');
      expect(player.gameboard).toBeDefined();
    });

    test('crée un joueur contrôlé par ordinateur', () => {
      const computer = new Player('Computer', 'computer');
      expect(computer.name).toBe('Computer');
      expect(computer.type).toBe('computer');
      expect(computer.gameboard).toBeDefined();
    });

    test('crée un joueur réel par défaut si le type n\'est pas spécifié', () => {
      const player = new Player('Bob');
      expect(player.type).toBe('real');
    });

    test('chaque joueur a son propre plateau de jeu', () => {
      const player1 = new Player('Alice', 'real');
      const player2 = new Player('Bob', 'real');
      
      expect(player1.gameboard).not.toBe(player2.gameboard);
    });

    test('lance une erreur si le nom est vide', () => {
      expect(() => new Player('', 'real')).toThrow('Le nom du joueur doit être une chaîne de caractères non vide');
    });

    test('lance une erreur si le nom n\'est pas une chaîne', () => {
      expect(() => new Player(123, 'real')).toThrow('Le nom du joueur doit être une chaîne de caractères non vide');
    });

    test('lance une erreur si le type est invalide', () => {
      expect(() => new Player('Alice', 'invalid')).toThrow('Le type doit être "real" ou "computer"');
    });
  });

  describe('isReal()', () => {
    test('retourne true pour un joueur réel', () => {
      const player = new Player('Alice', 'real');
      expect(player.isReal()).toBe(true);
    });

    test('retourne false pour un joueur contrôlé par ordinateur', () => {
      const computer = new Player('Computer', 'computer');
      expect(computer.isReal()).toBe(false);
    });
  });

  describe('isComputer()', () => {
    test('retourne true pour un joueur contrôlé par ordinateur', () => {
      const computer = new Player('Computer', 'computer');
      expect(computer.isComputer()).toBe(true);
    });

    test('retourne false pour un joueur réel', () => {
      const player = new Player('Alice', 'real');
      expect(player.isComputer()).toBe(false);
    });
  });

  describe('attack()', () => {
    let player1;
    let player2;
    let ship;

    beforeEach(() => {
      player1 = new Player('Alice', 'real');
      player2 = new Player('Bob', 'real');
      ship = new Ship(3);
      player2.gameboard.placeShip(ship, 0, 0, 'horizontal');
    });

    test('permet à un joueur d\'attaquer le plateau d\'un adversaire', () => {
      const result = player1.attack(player2, 0, 0);
      expect(result).toBe('hit');
    });

    test('retourne "miss" quand l\'attaque manque', () => {
      const result = player1.attack(player2, 5, 5);
      expect(result).toBe('miss');
    });

    test('retourne "already-shot" quand la position a déjà été attaquée', () => {
      player1.attack(player2, 0, 0);
      const result = player1.attack(player2, 0, 0);
      expect(result).toBe('already-shot');
    });

    test('lance une erreur si l\'adversaire n\'est pas une instance de Player', () => {
      expect(() => player1.attack({}, 0, 0)).toThrow('L\'adversaire doit être une instance de Player');
    });
  });

  describe('randomAttack()', () => {
    let computer;
    let player;
    let ship;

    beforeEach(() => {
      computer = new Player('Computer', 'computer');
      player = new Player('Alice', 'real');
      ship = new Ship(2);
      player.gameboard.placeShip(ship, 0, 0, 'horizontal');
    });

    test('génère une attaque aléatoire valide', () => {
      const attack = computer.randomAttack(player);
      
      expect(attack).toHaveProperty('x');
      expect(attack).toHaveProperty('y');
      expect(attack).toHaveProperty('result');
      expect(attack.x).toBeGreaterThanOrEqual(0);
      expect(attack.x).toBeLessThan(player.gameboard.size);
      expect(attack.y).toBeGreaterThanOrEqual(0);
      expect(attack.y).toBeLessThan(player.gameboard.size);
      expect(['hit', 'miss']).toContain(attack.result);
    });

    test('ne retourne jamais "already-shot"', () => {
      const attack = computer.randomAttack(player);
      expect(attack.result).not.toBe('already-shot');
    });

    test('évite les positions déjà attaquées', () => {
      // Simuler un petit plateau pour forcer la détection
      const smallPlayer = new Player('Test', 'real');
      smallPlayer.gameboard.size = 2; // 2x2 plateau
      
      const smallShip = new Ship(1);
      smallPlayer.gameboard.placeShip(smallShip, 0, 0, 'horizontal');
      
      const attacks = new Set();
      
      // Faire 4 attaques (toutes les cases du plateau 2x2)
      for (let i = 0; i < 4; i++) {
        const attack = computer.randomAttack(smallPlayer);
        const coord = `${attack.x},${attack.y}`;
        expect(attacks.has(coord)).toBe(false); // Pas de doublon
        attacks.add(coord);
      }
      
      expect(attacks.size).toBe(4);
    });

    test('lance une erreur si l\'adversaire n\'est pas une instance de Player', () => {
      expect(() => computer.randomAttack({})).toThrow('L\'adversaire doit être une instance de Player');
    });
  });

  describe('hasLost()', () => {
    test('retourne false si aucun navire n\'est coulé', () => {
      const player = new Player('Alice', 'real');
      const ship = new Ship(2);
      player.gameboard.placeShip(ship, 0, 0, 'horizontal');
      
      expect(player.hasLost()).toBe(false);
    });

    test('retourne false si certains navires sont coulés mais pas tous', () => {
      const player = new Player('Alice', 'real');
      const ship1 = new Ship(2);
      const ship2 = new Ship(2);
      
      player.gameboard.placeShip(ship1, 0, 0, 'horizontal');
      player.gameboard.placeShip(ship2, 0, 2, 'horizontal');
      
      // Couler ship1
      player.gameboard.receiveAttack(0, 0);
      player.gameboard.receiveAttack(1, 0);
      
      expect(player.hasLost()).toBe(false);
    });

    test('retourne true si tous les navires sont coulés', () => {
      const player = new Player('Alice', 'real');
      const ship1 = new Ship(2);
      const ship2 = new Ship(2);
      
      player.gameboard.placeShip(ship1, 0, 0, 'horizontal');
      player.gameboard.placeShip(ship2, 0, 2, 'horizontal');
      
      // Couler tous les navires
      player.gameboard.receiveAttack(0, 0);
      player.gameboard.receiveAttack(1, 0);
      player.gameboard.receiveAttack(0, 2);
      player.gameboard.receiveAttack(1, 2);
      
      expect(player.hasLost()).toBe(true);
    });

    test('retourne false si le joueur n\'a pas de navires', () => {
      const player = new Player('Alice', 'real');
      expect(player.hasLost()).toBe(false);
    });
  });

  describe('Scénario de jeu complet', () => {
    test('partie entre deux joueurs réels', () => {
      const alice = new Player('Alice', 'real');
      const bob = new Player('Bob', 'real');
      
      // Placer les navires
      const aliceShip = new Ship(2);
      const bobShip = new Ship(2);
      
      alice.gameboard.placeShip(aliceShip, 0, 0, 'horizontal');
      bob.gameboard.placeShip(bobShip, 0, 0, 'horizontal');
      
      // Alice attaque Bob
      expect(alice.attack(bob, 0, 0)).toBe('hit');
      expect(alice.attack(bob, 1, 0)).toBe('hit');
      
      // Bob attaque Alice
      expect(bob.attack(alice, 5, 5)).toBe('miss');
      
      // Vérifier les états
      expect(bob.hasLost()).toBe(true);
      expect(alice.hasLost()).toBe(false);
    });

    test('partie entre un joueur réel et un ordinateur', () => {
      const player = new Player('Alice', 'real');
      const computer = new Player('Computer', 'computer');
      
      const playerShip = new Ship(3);
      const computerShip = new Ship(3);
      
      player.gameboard.placeShip(playerShip, 0, 0, 'horizontal');
      computer.gameboard.placeShip(computerShip, 5, 5, 'vertical');
      
      // Le joueur attaque
      expect(player.attack(computer, 5, 5)).toBe('hit');
      
      // L'ordinateur attaque aléatoirement
      const attack = computer.randomAttack(player);
      expect(['hit', 'miss']).toContain(attack.result);
      
      // Vérifier que les deux joueurs sont toujours en jeu
      expect(player.hasLost()).toBe(false);
      expect(computer.hasLost()).toBe(false);
    });
  });
});
