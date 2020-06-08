# U Just Jump :video_game:

Browser based platform game, where the player runs and jumps around collecting coins while avoiding the lava.

## Getting Started

Here is what you need to start playing the game.

### Prerequisites

- Because we use ES6 modules and due to CORS policy the game can't be run directly from the file.

- [Python3](https://www.python.org/downloads/) can be used to run a quick local server (see below) or you can use any other method you'd prefer.

### Setup

- Clone this repo

`git clone https://github.com/carloseam/u-just-jump.git`

- Now go into the folder and run:

`python3 -m http.server 8888`

`8888` is just the port number I use but you can use any port number you like.

## How to Play

- The game has one simple goal: **collect all the coins**.

- Make sure not to let the lava touch you or the level will restart.

- Use the **left** :arrow_left: and **right** :arrow_right: *arrow keys* to **move**

- Use the **up** :arrow_up: *arrow key* to **jump**

**NOTE:**

Right now there is only 1 level available. I am currently designing a few more levels. :smiley:

If you have any levels you want to add please see [Contributing](#contributing).

## Built with

- HTML
- CSS
- JS (ES6)

## Contributing

Pull request are welcomed.

- Fork the repo
- Clone locally or not
- Make your changes
- Make a pull request

I will be maintaining this product on my own so please allow a couple of days for a reply.

### Creating maps

The map is made from a string. This keeps it simple and easily readable.

Use the following characters to create the map:
- `#` for walls and floors
- `.` full stops are black spaces
- `@` player
- `o` the letter o are the coins
- Lava consists of 4 different characters depending on the desired effect:
  - `+` sitting still lava block
  - `=` moving back and forth horizontally in a loop
  - `|` moving up and down in a loop
  - `v` dripping lava, once it hits the the floor it starts falling again

**Map Example**

```
const mapName = `
....................|...................
.#.............|.........|............#.
.#....................................#.
.#....................................#.
.#........................o.o.o.o.....#.
.#.o....=..############################.
.###.........................v......o.#.
.#....................................#.
.#.o.o..............o...............o.#.
.############++##+########......#######.
.#..........######..................o.#.
.#o.................................o.#.
.##.......................#############.
.#....o..........o.....o.#..............
.#.@..##++++######+++####...............
.#####################..................
........................................`;
```

## Notes

- Currently the game does not support touch screen devices.

- This version of the game uses the DOM to draw out the game, therefore it may not perform games console smooth.

## Authors

- [Carlos E Alford M](https://carlosealford.com) - website implementation and code customization.

## License

- [MIT License](LICENSE.md)

## Acknowledgements

Thanks to [Eloquent JavaScript](https://eloquentjavascript.net/) written by Marijn Haverbeke.
The challenges presented in the book were worth the time.
The base engine for the game comes from chapter 16: A Platform Game.
