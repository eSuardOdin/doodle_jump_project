export default class Model {
    static GRAVITY     = 40;
    static FINISH      = 20000;
    static JUMP_FORCE  = 1400;
    static SPEED       = 230;
    static HEIGHT_TRIG = 315;   // ES : Height to trigger ascension
    static MAX_GAP = 370;       // ES : Max distance between platforms 
    constructor() {
        this.InitGame('MENU');
    }

    get position() { return this._position; }
    get direction() { return this._direction; }
    set direction(value) { return this._direction = value; }
    
    /**
     * Used by Controller to bind with View
     * @returns Player's score
     */
    GetScore() {
        return this._score;
    }

    /**
     * Used by Controller to bind with View
     * @returns Location and type of objects present on map
     */
    GetMap() {
        return this._map_objects;
    }

    GetNearest(){
        return this._map_nearest;
    }

    /**
     * Used by Controller to bind with View
     * @returns The game state { GAME | MENU | OVER }
     */
    GetGameState() {
        return this._game_state;
    }

    /**
     * Used by Controller so View can set Game state on keyboard events
     * @param {*} game_state The game state to set { GAME | MENU | OVER }
     */
    SetGameState(game_state) {
        this._game_state = game_state;
    }

    BindDisplay(callback) {
        this.b_Display = callback;
    }


   
    Move(fps) {
        // ES : Incrementing highest position
        let score = this._GetScore();
        // console.log(score);
        if(score > this._score) {
            this._score = score;
        }
        // ES : Incrementing gap between platforms
        if(this._actual_gap < Model.MAX_GAP) {
            this._actual_gap += this._score/50000;
            if(this._actual_gap > Model.MAX_GAP) {
                this._actual_gap = Model.MAX_GAP;
            }
        }


        // ES : Apply gravity to player
        this._gravitySpeed += Model.GRAVITY;

        // ES : If going up without go over height trigger, make map go down.
        //  else, player goes up/down depending on gravitySpeed.
        if(this.position.y < Model.HEIGHT_TRIG && this._gravitySpeed < 0) {
            this._map_objects.forEach(o => {
                o.y -= this._gravitySpeed / fps;
                if(o.type === "moving_tile") {
                    this._MovePlateform(o);
                } else if(o.type === "falling_tile" && o.is_falling === true) {
                    this._DropPlatform(o);
                }
            });
            // this._score = Math.floor(this._score - ((this._gravitySpeed / fps)/2));
            // this._distance+=1;
        } else {
            this._position.y += this._gravitySpeed / fps;
            this._map_objects.forEach(o => {
                if(o.type === "moving_tile") {
                    this._MovePlateform(o);
                } else if(o.type === "falling_tile" && o.is_falling === true) {
                    this._DropPlatform(o);
                }
            })
        }
        
        // ES : Apply horizontal motion
        this._position.x += (this._direction * Model.SPEED / fps);
        if(this._position.x > 370){
            this._position.x = -60;
        } else if (this._position.x < -65){
            this._position.x = 365;
        }

        // ES : If falling down, check for platform collision
        //  maybe improved by checking only viewable objects?
        if(this._gravitySpeed > 0) {
            this._map_objects.forEach(o => {
                if((this._position.y+25 <= o.y  && this._position.y >= o.y-50) && (this._position.x >= o.x - 28 && this._position.x <= o.x + 45)) {
                    this._Jump();
                    if(o.type === "falling_tile") o.is_falling = true;
                }
            })
            // ES : If falling
            if (this._position.y > 830 ) { 
                // ES : Comment this for real conditions
                //this._Jump();
                
                // ES : Comment this to debug
                this._game_state = 'OVER';
            }
            // if(this._position.y > this._GetFinishY()+500) {
            //     this._game_state = 'FINISH';
            // }
        }

        this.b_Display(this._position);
        // ES : Get rid of bottom platforms
        this._map_objects = this._map_objects.filter(o => o.y < 800);
        
        // LG : Get four of the nearest tile of the player
        this._map_nearest = this._map_objects;
        this._map_nearest.forEach(o => {
            o.distance = this._CalculateDistance(this._position.x, this._position.y, o.x, o.y); // Calculate the distance between the player and a platform
        })
        this._map_nearest = this._map_nearest.sort((a, b) => a.distance - b.distance); // Sort the Array by the distance
        this._map_nearest = this._map_nearest.slice(0, 4); // Slice it to only get 4 elements


        while(Math.min(...this._map_objects.filter(o => o.type != 'finish_tile').map(o => o.y)) > -400 && this._GetFinishY() >= 0) {
            this._FillMap();
        }
    }

    /**
     * Init of the game, used in Model constructor with `InitGame('MENU')` and
     * in View with `InitGame('GAME')` after a game over
     * @param {*} state The state we want the game to (re)/init in.
     */
    InitGame(state) {
        this._game_state = state;
        this._score = 0;
        this._highestPosition = 0;
        this._direction = 0;                
        this._gravitySpeed = 0;
        this._position = {x: 170, y:493, last_pos: 'r'};
        this._actual_gap = 40;
        this._map_objects = [                   
            {type: 'basic_tile', x: 160, y: 750, is_sentinel: true}
        ];
        this._map_nearest = [];
        this._FillMap();
        this._GenerateEnd();
    }

    /**
     * Boing boing
     */
    _Jump() {
        this._gravitySpeed = -Model.JUMP_FORCE;
    }

    /**
     * Push new platform after the last one
     * @todo sentinel concept is deprecated, to refactor.
     */
    _FillMap() {
            const last_sentinel = this._map_objects.filter(o => o.type != 'finish_tile').findLast(o => o.is_sentinel === true);
            let new_sentinel = this._GeneratePlatform(last_sentinel);
            this._map_objects.push(new_sentinel);
    }

    /**
     * Generate a new platform :
     *      - Randomize X and Y of new platform
     *      - Randomize type of plateform (more chance of special platforms spawning depending on score)
     * @param {*} last_sentinel Deprecated, this is juste the plateform placed before the one we're creating 
     * @returns An object representing platform
     */
    _GeneratePlatform(last_sentinel) {
        const platform_x = Math.floor(Math.random() * 340); // Max = canvas width - platform width
        // Math.random() * (max - min) + min;
        const platform_y = Math.floor(Math.random() * ((last_sentinel.y - this._actual_gap - 15) - (last_sentinel.y - this._actual_gap + 15)) + (last_sentinel.y - this._actual_gap + 15));
        
        let x = Math.random() * 20;
        // ES : Check if returning falling/moving or normal platform 
        if(x < this._score / 500) {
            if(platform_x % 2 >= 1) {
                return {type: "falling_tile", x: platform_x, y: platform_y, is_sentinel: true, is_falling: false, speed: 7};    
            }
            let dir = x % 2 >= 1 ? 1 : -1;
            return {type: "moving_tile", x: platform_x, y: platform_y, is_sentinel: true, direction: dir, speed: 0.7};
        } else {
            return {type: "basic_tile", x: platform_x, y: platform_y, is_sentinel: true};
        }
    }

    /**
     * Generate the End
     */
    _GenerateEnd(){
        for(let i = 0; i < 7; i++ ){
            this._map_objects.push({type: "finish_tile", x: i*57, y: -Model.FINISH, is_sentinel: true});     
        }         
        // console.log(this._map_objects);    
    }

    _GetFinishY() 
    {
        return -Math.min(...this._map_objects.filter(o => o.type == 'finish_tile').map(o => o.y));
    }
    _GetScore() {
        // ES : Get new distance of finish line
        // const dist = -Math.min(...this._map_objects.filter(o => o.type == 'finish_tile').map(o => o.y));
        // console.log(dist);
        // console.log((Model.FINISH - (Model.FINISH + dist))/2);
        return (Model.FINISH+1 - this._GetFinishY())/2;
    }

    /**
     * Move moving platform
     * @param {*} obj The platform to move
     */
    _MovePlateform(obj) {
        if(obj.direction === 1 && obj.x > 340) {
            obj.direction = -1;
        } else if(obj.direction === -1 && obj.x < 2) {
            obj.direction = 1;
        }
        obj.x += (obj.direction * obj.speed);
    }

    /**
     * Drop falling platform
     * @param {*} obj The platform to drop
     */
    _DropPlatform(obj) {
        obj.y += obj.speed;
    }

    _CalculateDistance(x1 , y1, x2, y2){
        let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return distance;
    }

}