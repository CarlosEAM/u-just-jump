/**
 * U-Just-jump - Game levels
 * This file holds all the levels for the game:
 * 1 - Each level is a const string, level name is not important.
 * 2 - Use back sticks `` to create the string to mainting formatting.
 * 3 - Levels are not of fix size, height and width is down to you.
 * 4 - Add the variable to the GAME_LEVELS array at the end of file.
 */

// Demo level to serve as example
const demoLevel = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;


// Add level name here
const GAME_LEVELS = [
  demoLevel,
]

export {GAME_LEVELS};
