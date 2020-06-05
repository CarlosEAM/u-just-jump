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

let simpleLevel = new Level(simpleLevelPlan);
console.log(`${simpleLevel.width} by ${simpleLevel.height}`);










