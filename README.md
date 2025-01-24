# doodle_jump_project
School project

Use web server to launch to prevent CORS error `php -S localhost:8000`

## To do
- Draw basic map
- Move player

****

## Gameflow
### Game loop
I think we have three main steps to process (like in many games)
1) Process inputs
*If something is pressed, update data according to it.*
2) Update states
*Update player position, check for collision, load new portion of map etc...*
3) Render view
*Update graphics*

### Platform spawning
*Two (or more) possible choices here* :
1) Definition of an initial value representing the medium space between platforms -> Increments with score until it reaches a max gap
2) Keep sentinel tiles and randomize the spawning of middle platforms between depending on score

### Game behavior
- **Score**: Player must go upwards to gain points. 
- **Gameplay**: The player is auto jumping a constant height 
- **Game over**: When player falls out of screen.
- **Difficulty**: As player goes up, so does difficulty (less platforms -*Some maths needed here to compute platforms placement*-, more chances of special platforms, *etc?..*) 
- **Player input**: Player can go left/right | *to discuss* -> I'd like `speed_y` to increase and decrease gradually :
  - When pressing Left or Right : speed is increasing and goes at full speed after a defined number of frames
  - When releasing inputs : speed slowly decreases.
  - **After writing it and playing https://doodlejump.io/** : It clearly seems like a shitty idea, inertia may create some frustration in gameplay. Still need to discuss it as a one of the few gameplays choices.
- **Progression**: Map maybe twice (*at least?*) higher than displayed on screen to anticipate player going up.

****

## MVC
*MVC will be used in this project as a core concept*
### Model
Will contain data about game objects or assets
**Ideas about data contained**
``` javascript
/** Informations about tiles we're going to use in view
 * id : The id of tile, used to retrieve it
 * x/y : leftmost/topmost postion of the tile
 * w/h : width/height of the tile
 */
tiles [
    {id: 'player', x: 70, y: 15, w: 20, h: 70},
    {id: 'base_block', x: 1, y: 1, w: 50, h: 10},
    {id: 'moving_block', x: 11, y: 1, w: 50, h: 10}
];
player {x_speed: 0, y_speed: 0, direction: 1, x, y}


```
