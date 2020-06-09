// load function from game engine to start game
import {loadGame} from './game-engine.js';


/**
 * @description Initialise MODAL how to play.
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
 * @description Start game
 * @param {object} gameWrapper - DOM element
 * @param {object} startBtn - DOM element
 */
const startGame = (gameWrapper, startBtn) => {
  // disable start button
  startBtn.setAttribute('disabled', 'disabled');
  loadGame(gameWrapper).then(() => {
    // enable start button
    startBtn.removeAttribute('disabled');
  });
}


/**
 * @description Initialize site settings
 */
const initSettings = () => {
  // Get DOM elements outside Modules
  const startBtn = document.querySelector('#startBtn');
  let gameWrapper = document.querySelector('.game-wrapper');

  // Listener for the start button
  startBtn.addEventListener('click', () => {
    startGame(gameWrapper, startBtn);
  });
}


window.onload = () => {
  initModal();
  initSettings();
}
