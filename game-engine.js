/**
 * U Just Jump - Browser game
 */

// Load the module with the game maps
import {GAME_LEVELS} from './game-levels.js';

/**
 * @description Stores a level object
 * @param {string} plan - human readable level
 */
class Level {
  // To interpret the characters in the plan, the Level
  // constructor uses the levelChars object.
  constructor(plan) {
    // Game map as array of arrays of string
    let rows = plan.trim().split("\n").map(l => [...l]);

    // use array to get the maps height and width
    this.height = rows.length;
    this.width = rows[0].length;

    // Array of actor objects
    this.startActors = [];

    // Map background as Array of arrays of strings
    // With field types: "empty", "wall" or "lava"
    this.rows = rows.map((row, y) => {
      // Map through each item, row by row
      return row.map((ch, x) => {

        // map current character to background or actor
        let type = levelChars[ch];
        // return the background
        if (typeof type == "string") return type;

        // create actor object and add to list
        this.startActors.push(type.create(new Vec(x, y), ch));
        // space taken by actors is also empty so return this
        return "empty";
      });
    });
  }
}


/**
 * @description Track the state of a running game.
 * @param {array} level - human readable level
 * @param {object} plan - game actors
 * @param {string} status - either lost or won
 */
class State {
  // This is a persistent data structure.
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    // will change when the game has ended
    this.status = status;
  }

  // Creates a new state and leaves the old one intact.
  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  // Return a player
  get player() {
    return this.actors.find(a => a.type == "player");
  }
}


/**
 * @description For 2 dimentional values
 * @param {integer} x - actors top-left x position
 * @param {integer} y - actors top-left y position
 */
class Vec {
  // Different types of actors get their own classes since
  // their behaviour is different.
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // Represent the current position and state of a given moving element in our game.
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }

  // Scales a vector by a given number.
  // to multiply a speed vector by a time interval to get the
  // distance traveled during that time.
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}


/* === ACTORS ==


/**
 * @description Create a player actor
 * @param {object} pos - actors current location
 * @param {integer} speed - actors current speed
 */
class Player {
  constructor(pos, speed) {
    this.pos = pos;
    // Stores current speed to simulate momentum and gravity.
    this.speed = speed;
  }

  get type() { return "player"; }

  // A player is one-and-a-half squares high, initial position is set to
  // be half a square above the position where the @ character appeared.
  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
  }
}

// Size is the same for all instances, add to prototype
Player.prototype.size = new Vec(0.8, 1.5);


/**
 * @description Create a lava type actor
 * @param {object} pos - actors current location
 * @param {integer} speed - actors current speed
 */
class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type() { return "lava"; }

  // actor character type required to choose laval
  static create(pos, ch) {
    // Decide which type of lava to build
    if (ch == "=") {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch == "|") {
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == "v") {
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }
}

Lava.prototype.size = new Vec(1, 1);


/**
 * @description Create a coin actor
 * @param {object} pos - actors current location
 * @param {object} basePos - base position
 * @param {object} wobble - the wobble
 */
class Coin {
  // are given a “wobble”, a slight vertical back-and-forth motion.
  // basePos and wobble determine the coins current pos
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  get type() { return "coin"; }

  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    // starting pos is randomised to avoid all coins moving in sync
    return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
  }
}

// All coins are same size so place in prototype
Coin.prototype.size = new Vec(0.6, 0.6);


// maps background elements to strings and
// actor characters to classes.
const levelChars = {
  ".": "empty",
  "#": "wall",
  "+": "lava",
  "@": Player,
  "o": Coin,
  "=": Lava,
  "|": Lava,
  "v": Lava
};


/**
 * @description Create an element
 * @param {string} name - element name
 * @param {object} attrs - attributes for element
 * @param {object} children - child nodes
 * @return {object}
 */
function elt(name, attrs, ...children) {
  let dom = document.createElement(name);

  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }

  for (let child of children) {
    dom.appendChild(child);
  }

  return dom;
}


/**
 * @description Displays a given level and state.
 * @param {object} parent - element to append game grid to
 * @param {object} level - current level map
 */
class DOMDisplay {
  constructor(parent, level) {
    this.dom = elt("div", {class: "game"}, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  clear() { this.dom.remove(); }
}


// Grid, square scale
const scale = 20;


/**
 * @description Draw the game map grid
 * @param {object} level - current game level map
 * @return {object}
 */
function drawGrid(level) {
  // Uing the <table> element to build current level background
  return elt("table", {
      class: "background",
      style: `width: ${level.width * scale}px`
    }, ...level.rows.map(row =>
    elt("tr", {style: `height: ${scale}px`},
      ...row.map(type => elt("td", {class: type})))
  ));
}


/**
 * @description Draw the game actors attached to <div> element
 * @param {object} actors - class of actors
 * @return {object}
 */
function drawActors(actors) {
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", {class: `actor ${actor.type}`});
    // Apply actor type unique size
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    // Place the actor in the right pos
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;
    return rect;
  }));
}


/**
 * @description Make the display show a given Actor state.
 * @param {string} state - current game state
 */
DOMDisplay.prototype.syncState = function(state) {
  // remove old actors layer if one exists
  if (this.actorLayer) this.actorLayer.remove();
  // Update the actors
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
  this.scrollPlayerIntoView(state);
};


/**
 * @description find the player’s position and update the wrapping element’s scroll position.
 * @param {object} state - current game state
 */
DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
  // We change the scroll position by manipulating that element’s
  // scrollLeft and scrollTop properties when the player is too
  // close to the edge.
  let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 3;

  // The viewport
  let left = this.dom.scrollLeft, right = left + width;
  let top = this.dom.scrollTop, bottom = top + height;

  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5)).times(scale);

  if (center.x < left + margin) {
    this.dom.scrollLeft = center.x - margin;
  } else if (center.x > right - margin) {
    this.dom.scrollLeft = center.x + margin - width;
  }

  if (center.y < top + margin) {
    this.dom.scrollTop = center.y - margin;
  } else if (center.y > bottom - margin) {
    this.dom.scrollTop = center.y + margin - height;
  }
};


// MOTION AND COLLISION

/**
 * @description Is rectangle touching a grid element of a given type
 * @param {object} pos - element position
 * @param {integer} size - size of element
 * @param {string} type - type of element
 * @return {boolean}
 */
Level.prototype.touches = function(pos, size, type) {
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);

  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
      let here = isOutside ? "wall" : this.rows[y][x];
      if (here == type) return true;
    }
  }
  return false;
};


/**
 * @description Is rectangle touching a grid element of a given type
 * @param {integer} time - element position
 * @param {integer} keys - size of element
 * @return {object}
 */
State.prototype.update = function(time, keys) {
  let actors = this.actors.map(actor => actor.update(time, this, keys));
  let newState = new State(this.level, actors, this.status);

  if (newState.status != "playing") return newState;

  let player = newState.player;
  if (this.level.touches(player.pos, player.size, "lava")) {
    return new State(this.level, actors, "lost");
  }

  for (let actor of actors) {
    if (actor != player && overlap(actor, player)) {
      newState = actor.collide(newState);
    }
  }
  return newState;
}


/**
 * @description Detect overlap between actors
 * @param {object} actor1 - actor instace
 * @param {object} actor2 - actor instace
 * @return {boolean}
 */
function overlap(actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
    actor1.pos.x < actor2.pos.x + actor2.size.x &&
    actor1.pos.y + actor1.size.y > actor2.pos.y &&
    actor1.pos.y < actor2.pos.y + actor2.size.y;
}


/**
 * @description Updates the Player state on collide with Lava
 * @param {object} state - current game state
 * @return {object}
 */
Lava.prototype.collide = function(state) {
  return new State(state.level, state.actors, "lost");
};


/**
 * @description Updates the Player state on collide with Coin
 * @param {object} state - current game state
 * @return {object}
 */
Coin.prototype.collide = function(state) {
  let filtered = state.actors.filter(a => a != this);
  let status = state.status;
  if (!filtered.some(a => a.type == "coin")) status = "won";
  return new State(state.level, filtered, status);
};


// ACTOR UPDATES


/**
 * @description Computes a new position for Lava actor
 * @param {integer} time - time step
 * @param {object} state - current game state
 * @return {object}
 */
Lava.prototype.update = function(time, state) {
  // Add the product of the time step and the current speed to its old position
  let newPos = this.pos.plus(this.speed.times(time));
  // The bahaviour depends on the type of lava block
  if (!state.level.touches(newPos, this.size, "wall")) {
    return new Lava(newPos, this.speed, this.reset);
  } else if (this.reset) {
    // Dripping lava resets its position
    return new Lava(this.reset, this.speed, this.reset);
  } else {
    // Bouncing lava inverts its speed
    return new Lava(this.pos, this.speed.times(-1));
  }
};


// Coin variable configuration
const wobbleSpeed = 8, wobbleDist = 0.07;


// Coins use their update method to wobble. They ignore collisions with the
// grid since they are simply wobbling around inside of their own square.
/**
 * @description Create the coins wobble
 * @param {integer} time - time step
 * @return {object}
 */
Coin.prototype.update = function(time) {
  // method ignores collisions with the grid since they are simply
  // wobbling around in their own square.

  // property used to track time and used as argument to Math.sin
  let wobble = this.wobble + time * wobbleSpeed;
  // coins new position computed from its base pos and an offset based on this wave
  let wobblePos = Math.sin(wobble) * wobbleDist;
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble);
};


// Player abilities are set here, twick them to your liking
const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;


/**
 * @description Hanlde player motion inside of map
 * @param {integer} time - time step
 * @param {object} state - current game state
 * @param {object} keys - game keys
 * @return {object}
 */
Player.prototype.update = function(time, state, keys) {
  // Player motion is handled per axis.

  // Calculate left and right movement
  let xSpeed = 0;
  if (keys.ArrowLeft) xSpeed -= playerXSpeed;
  if (keys.ArrowRight) xSpeed += playerXSpeed;

  // With no wall blocking new position is used
  let pos = this.pos;
  let movedX = pos.plus(new Vec(xSpeed * time, 0));
  if (!state.level.touches(movedX, this.size, "wall")) {
    pos = movedX;
  }

  // Calculate up and down movement, using gravity and jumping.

  // ySPeed accelerated to account for gravity
  let ySpeed = this.speed.y + time * gravity;
  let movedY = pos.plus(new Vec(0, ySpeed * time));

  // Check for walls before making a move, out a possible two:
  // 1. arrow key up pressed and moving down, speed is changed to jump again.
  // 2. player simply bumped into something and speed is set to zero.
  if (!state.level.touches(movedY, this.size, "wall")) {
    pos = movedY;
  } else if (keys.ArrowUp && ySpeed > 0) {
    ySpeed = -jumpSpeed;
  } else {
    ySpeed = 0;
  }
  return new Player(pos, new Vec(xSpeed, ySpeed));
};


/**
 * @description Track keys pressed
 * @param {array} keys - string of 3 possible keys
 * @return {object}
 */
function trackKeys(keys) {
  // their effects are active as long as the key is held down
  let down = Object.create(null);

  // Key handler, stores the current state of the key
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      // stop auto page scroll
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);

  // Unregister handlers and methods
  down.unregister = () => {
    window.removeEventListener('keydown', track);
    window.removeEventListener('keyup', track);
  }
  return down;
}


// RUNNING THE GAME


/**
 * @description Wrapper function for requestAnimationFrame()
 * @param {object} framFunc - function that expects a time difference
 */
function runAnimation(frameFunc) {
  // Max frame step = 100ms
  let lastTime = null;

  // Draws a single fram
  function frame(time) {
    if (lastTime != null) {
      // convert time step to seconds
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      // on false, animation stops
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  // first request to animation frame
  requestAnimationFrame(frame);
}


/**
 * @description Displays the level in document letting user play
 * @param {object} level - current game level
 * @param {object} Display - a constructor
 * @param {object} gameWrapper - DOM element
 * @return {promise}
 */
function runLevel(level, Display, gameWrapper) {
  let display = new Display(gameWrapper, level);
  let state = State.start(level);
  let ending = 1;
  // As suggested in EloquentJS, ther is a 'running' state
  let running = 'yes';

  return new Promise(resolve => {

    // check if game has been paused
    function pauseHandler(event) {
      if (event.key != 'p') return;
      event.preventDefault()
      // swap between running states;
      if (running == 'no') {
        running = 'yes';
        runAnimation(frame);
      } else if (running == 'yes') {
        running = 'pausing';
      } else {
        running = 'yes';
      }
    }

    // Add event handler to listen out for pause
    window.addEventListener('keydown', pauseHandler);
    let arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);

    function frame(time) {
      // check game state
      if (running == 'pausing') {
        running = 'no';
        return false;
      }

      // Run the game
      state = state.update(time, arrowKeys);
      display.syncState(state);
      if (state.status == 'playing') {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        // Game end, clear screen and remove events
        display.clear();
        window.removeEventListener('keydown', pauseHandler);
        arrowKeys.unregister();
        resolve(state.status);
        return false;
      }
    }
    runAnimation(frame);
  });
}


/**
 * @description Change level on completion
 * @param {array} plans - game levels as array of strings
 * @param {object} Display - display constructor
 * @param {object} gameWrapper - DOM element
 */
async function runGame(plans, Display, gameWrapper) {

  // Implement player lives
  let lives = 3;
  let won = false;
  // Create infinite loop to play through the levels
  for (let level = 0; level < plans.length;) {

    // Check lives, ends or reloads game
    if(lives > 0) {
      console.log(`You have ${lives} left`);
      won = await runLevel(new Level(plans[level]), Display, gameWrapper)
        .then(status => (status == 'won') ? true : false);
    }

    // Update lives and current level
    if (won) {
      level++;
      lives = 3;
    } else {
      lives--;
    }

  }
  return won;
}


/**
 * @description Loads the game
 * @param {object} gameWrapper - DOM element queried from outside module
 */
export function loadGame(gameWrapper) {
  return runGame(GAME_LEVELS, DOMDisplay, gameWrapper);
}
