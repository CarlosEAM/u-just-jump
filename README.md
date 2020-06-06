# U Just Jump

Browser based game, where the player jumps around collecting coins avoiding obstacles and lava.

## Getting Started

Here is what you need to start playing the game.

### Prerequisites

- Download and install [Python3](https://www.python.org/downloads/) or if you have another way to run a local server use that.

### Setup

- Clone this repo

`git clone https://github.com/carloseam/u-just-jump.git`

- Now go into the folder and run:

`python3 -m http.server 8888`

You can use any port number you like

## How to Play

- The game consists of:
  - **Lava** which kills the player, causing a level reset.
  - **coins** all must be collected for the player to win.

- Use the left and right arrow keys to **move**

- Use the up arrow key to **jump**

**NOTE:**

Right now there is only 1 level, while I create other levels.

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
- Lava consists of 3 different characters depending on the desired effect:
  - `+` sitting still lava block
  - `=` moving back and forth horizontally in a loop
  - `|` moving up and down in a loop
  - `v` dripping lava, once it hits the the floor it drips again

## Authors

- [Carlos E Alford M](https://carlosealford.com) - website implementation and code customization.

## License

- [MIT License](LICENSE.md)

## Acknowledgements

Thanks to [Eloquent JavaScript](https://eloquentjavascript.net/) written by Marijn Haverbeke.
The challenges presented in the book were worth the time.
The base engine for the game comes from chapter 16: A Platform Game.
