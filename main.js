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

let level1 = new Level(simpleLevelPlan);

console.log("LEVEL 1: ", level1)
