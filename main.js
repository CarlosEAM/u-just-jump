// load function from game engine to start game
import {startGame} from './game-engine.js';


/**
 * @description Initialise the how to play modal.
 */
const initModal = () => {
  let modal = document.querySelector('#howToModal');
  // Open modal
  document.querySelector('#openModalBtn').addEventListener('click', () => {
    modal.style.display = 'block';
  });
  // Close modal
  document.querySelector('.close-modal-btn').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  // Close modal when user clicks outside of modal
  window.addEventListener('click', (event) => {
    if (event.target == modal) modal.style.display = 'none';
  });
}


/**
 * @description Loads the game.
 */
const loadGame = () => {
  // query DOM for the game wrapper element to pass to the game engine
  let gameWrapper = document.querySelector('.game-wrapper');
  // startGame(gameWrapper)
}

window.onload = () => {
  initModal();
  loadGame();
}
