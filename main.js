// load function from game engine to start game
import {startGame} from './game-engine.js';


/**
 * @description Loads the game.
 */
const loadGame = () => {
  // query DOM for the game wrapper element to pass to the game engine
  let gameWrapper = document.querySelector('.game-wrapper');
  startGame(gameWrapper)
}

window.onload = loadGame;
