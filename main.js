/**
 * title: U Just Jump
 * type: Browser game
 * description: Multiple levels for player to complete.
 * A level is completed when all coins have been collected.
 * If player touches the lava, the current level is restored to its
 * starting position, and the player may start again.
 *
 * Human-editable level, as string:
 * (.) empty spaces
 * (#) walls
 * (+) laval
 * (@) players starting position
 * (o) coins
 * (=) block of lava moving horiontally
 * (|) block of lava moving vertically
 * (v) dripping lava, only moves downwards and it resets once it hits the floor
 *
 * Use a state class to track the state of a running game
 *
 */

let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

/**
 * @description Stores a level object
 * @param {string} plan - human readable level
 */
class Level {
  constructor(plan) {
    // Array or array rows
    let rows = plan.trim().split("\n").map(l => [...l]);

    // Number or array rows give the map height
    this.height = rows.length;

    // String length of a row give the map width
    this.width = rows[0].length;

    // Array of objects to store the actors
    this.startActors = [];

    // Map every row in the map
    this.rows = rows.map((row, y) => {

      // Map through each item, row by row
      return row.map((ch, x) => {

        // `levelChars` maps background elements to strings and actors to classes
        let type = levelChars[ch];
        if (typeof type == "string") return type;

        // store actore position as a 2d vector
        this.startActors.push(type.create(new Vec(x, y), ch));
        return "empty";
      });
    });
  }
}



class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;

    //will switch to "lost" or "won" when the game has ended.
    this.status = status;
  }

  /**
   * @description Creates a new state and leaves the old one intact.
   * Persistent data structure.
   */
  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  /**
   * @description Return a player
   */
  get player() {
    return this.actors.find(a => a.type == "player");
  }
}



class Vec {
  constructor(x, y) {
    this.x = x; this.y = y;
  }

  /**
   * @description represent the current position and state of a given moving element in our game.
   * @param {integer} other
   */
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }

  /**
   * @description Scales a vector by a given number.
   * @param {integer} factor
   */
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}




class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() { return "player"; }

  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
  }
}

Player.prototype.size = new Vec(0.8, 1.5);




class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type() { return "lava"; }

  static create(pos, ch) {
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




class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  get type() { return "coin"; }

  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos,
    Math.random() * Math.PI * 2);
  }
}

Coin.prototype.size = new Vec(0.6, 0.6);

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




class DOMDisplay {
  constructor(parent, level) {
    this.dom = elt("div", {class: "game"}, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  clear() { this.dom.remove(); }
}




const scale = 20;

function drawGrid(level) {
  return elt("table", {
      class: "background",
      style: `width: ${level.width * scale}px`
    }, ...level.rows.map(row =>
    elt("tr", {style: `height: ${scale}px`},
    ...row.map(type => elt("td", {class: type})))
  ));
}



function drawActors(actors) {
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", {class: `actor ${actor.type}`});
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;
    return rect;
  }));
}




DOMDisplay.prototype.syncState = function(state) {
  if (this.actorLayer) this.actorLayer.remove();
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
  this.scrollPlayerIntoView(state);
};







DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
  let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 3;
  // The viewport
  let left = this.dom.scrollLeft, right = left + width;
  let top = this.dom.scrollTop, bottom = top + height;
  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5))
  .times(scale);
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



// TEST DRAWING, delete when done
let simpleLevel = new Level(simpleLevelPlan);
let display = new DOMDisplay(document.body, simpleLevel);
display.syncState(State.start(simpleLevel));


// MOTION AND COLLISION
// Split time into small steps and for each step, move the actors
// by a distance corresponding to their speed multiplied by the size
// of time step. Units per second.

// This method tells us whether a rectangle (specified by a position and a size)
// touches a grid element of the given type.
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




// The state update method uses touches to figure out whether the player is
// touching lava.
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






// Overlap between actors is detected with the overlap function.
function overlap(actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
    actor1.pos.x < actor2.pos.x + actor2.size.x &&
    actor1.pos.y + actor1.size.y > actor2.pos.y &&
    actor1.pos.y < actor2.pos.y + actor2.size.y;
}




Lava.prototype.collide = function(state) {
  return new State(state.level, state.actors, "lost");
};

Coin.prototype.collide = function(state) {
  let filtered = state.actors.filter(a => a != this);
  let status = state.status;
  if (!filtered.some(a => a.type == "coin")) status = "won";
  return new State(state.level, filtered, status);
};




// ACTOR UPDATES

// This update method computes a new position by adding the product of the
// time step and the current speed to its old position.
Lava.prototype.update = function(time, state) {
  let newPos = this.pos.plus(this.speed.times(time));
  if (!state.level.touches(newPos, this.size, "wall")) {
    return new Lava(newPos, this.speed, this.reset);
  } else if (this.reset) {
    return new Lava(this.reset, this.speed, this.reset);
  } else {
    return new Lava(this.pos, this.speed.times(-1));
  }
};



// Coins use their update method to wobble. They ignore collisions with the
// grid since they are simply wobbling around inside of their own square.
const wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.update = function(time) {
  let wobble = this.wobble + time * wobbleSpeed;
  let wobblePos = Math.sin(wobble) * wobbleDist;
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble);
};



// Player motion is handled separately per axis
// because hitting the floor should not prevent horizontal motion, and hitting a
// wall should not stop falling or jumping motion.
const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

Player.prototype.update = function(time, state, keys) {
  let xSpeed = 0;
  if (keys.ArrowLeft) xSpeed -= playerXSpeed;
  if (keys.ArrowRight) xSpeed += playerXSpeed;
  let pos = this.pos;
  let movedX = pos.plus(new Vec(xSpeed * time, 0));
  if (!state.level.touches(movedX, this.size, "wall")) {
    pos = movedX;
  }
  let ySpeed = this.speed.y + time * gravity;
  let movedY = pos.plus(new Vec(0, ySpeed * time));
  if (!state.level.touches(movedY, this.size, "wall")) {
    pos = movedY;
  } else if (keys.ArrowUp && ySpeed > 0) {
    ySpeed = -jumpSpeed;
  } else {
    ySpeed = 0;
  }
  return new Player(pos, new Vec(xSpeed, ySpeed));
};



// TRACKING KEYS
function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}
const arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);









