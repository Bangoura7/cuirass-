/**
 * Module DOM pour gérer l'affichage des plateaux de jeu
 */
export const DOMController = {
  /**
   * Affiche un plateau de jeu dans le DOM
   * @param {Gameboard} gameboard - Le plateau à afficher
   * @param {HTMLElement} container - Le conteneur DOM
   * @param {boolean} isEnemy - Si c'est le plateau ennemi (masque les navires)
   * @param {Function} onCellClick - Callback lors du clic sur une cellule
   */
  renderBoard(gameboard, container, isEnemy = false, onCellClick = null) {
    container.innerHTML = '';
    const boardElement = document.createElement('div');
    boardElement.classList.add('board');

    for (let y = 0; y < gameboard.size; y++) {
      for (let x = 0; x < gameboard.size; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;

        // Vérifier si cette cellule contient un navire
        const hasShip = this._hasShipAt(gameboard, x, y);
        
        // Vérifier si cette cellule a été touchée
        const isHit = this._isHitAt(gameboard, x, y);
        
        // Vérifier si cette cellule a été manquée
        const isMiss = this._isMissAt(gameboard, x, y);

        // Appliquer les classes CSS appropriées
        if (isMiss) {
          cell.classList.add('miss');
        } else if (isHit) {
          cell.classList.add('hit');
          if (hasShip) {
            cell.classList.add('ship-hit');
          }
        } else if (hasShip && !isEnemy) {
          // Afficher les navires seulement sur son propre plateau
          cell.classList.add('ship');
        }

        // Ajouter l'écouteur d'événement si fourni
        if (onCellClick && isEnemy) {
          cell.addEventListener('click', () => onCellClick(x, y));
          cell.classList.add('clickable');
        }

        boardElement.appendChild(cell);
      }
    }

    container.appendChild(boardElement);
  },

  /**
   * Vérifie si une cellule contient un navire
   * @private
   */
  _hasShipAt(gameboard, x, y) {
    return gameboard.ships.some(({ coordinates }) =>
      coordinates.some(([shipX, shipY]) => shipX === x && shipY === y)
    );
  },

  /**
   * Vérifie si une cellule a été touchée
   * @private
   */
  _isHitAt(gameboard, x, y) {
    return gameboard.hits.some(([hitX, hitY]) => hitX === x && hitY === y);
  },

  /**
   * Vérifie si une cellule a été manquée
   * @private
   */
  _isMissAt(gameboard, x, y) {
    return gameboard.missedShots.some(([missX, missY]) => missX === x && missY === y);
  },

  /**
   * Affiche un message dans le DOM
   * @param {string} message - Le message à afficher
   * @param {string} type - Le type de message ('info', 'success', 'error')
   */
  displayMessage(message, type = 'info') {
    const messageContainer = document.getElementById('message');
    if (messageContainer) {
      messageContainer.textContent = message;
      messageContainer.className = `message ${type}`;
    }
  },

  /**
   * Met à jour les informations du joueur actuel
   * @param {string} playerName - Le nom du joueur
   */
  updateCurrentPlayer(playerName) {
    const currentPlayerElement = document.getElementById('current-player');
    if (currentPlayerElement) {
      currentPlayerElement.textContent = playerName;
    }
  },

  /**
   * Affiche l'écran de fin de jeu
   * @param {string} winnerName - Le nom du gagnant
   */
  showGameOver(winnerName) {
    const gameOverScreen = document.getElementById('game-over');
    const winnerElement = document.getElementById('winner-name');
    
    if (gameOverScreen && winnerElement) {
      winnerElement.textContent = winnerName;
      gameOverScreen.classList.remove('hidden');
    }
  },

  /**
   * Masque l'écran de fin de jeu
   */
  hideGameOver() {
    const gameOverScreen = document.getElementById('game-over');
    if (gameOverScreen) {
      gameOverScreen.classList.add('hidden');
    }
  },

  /**
   * Active ou désactive les clics sur le plateau ennemi
   * @param {boolean} enabled - Si les clics sont activés
   */
  setEnemyBoardClickable(enabled) {
    const enemyBoard = document.querySelector('#enemy-board .board');
    if (enemyBoard) {
      if (enabled) {
        enemyBoard.classList.add('active');
      } else {
        enemyBoard.classList.remove('active');
      }
    }
  },

  /**
   * Crée un plateau vide pour le placement
   * @param {HTMLElement} container - Le conteneur DOM
   * @param {number} size - Taille du plateau
   */
  createEmptyBoard(container, size = 10) {
    console.log('📋 Création du plateau vide, taille:', size);
    container.innerHTML = '';
    const boardElement = document.createElement('div');
    boardElement.classList.add('board');

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;
        boardElement.appendChild(cell);
      }
    }

    container.appendChild(boardElement);
    console.log('✅ Plateau créé avec', size * size, 'cellules');
  },

  /**
   * Affiche les navires sur un plateau
   * @param {HTMLElement} container - Le conteneur du plateau
   * @param {Array} ships - Liste des navires avec leurs coordonnées
   * @param {boolean} hideShips - Masquer les navires (pour plateau ennemi)
   */
  renderShips(container, ships, hideShips = false) {
    if (hideShips) return;

    const cells = container.querySelectorAll('.cell');
    
    ships.forEach(({ coordinates }) => {
      coordinates.forEach(([x, y]) => {
        const cell = Array.from(cells).find(c => 
          parseInt(c.dataset.x) === x && parseInt(c.dataset.y) === y
        );
        if (cell) {
          cell.classList.add('ship');
        }
      });
    });
  }
};
