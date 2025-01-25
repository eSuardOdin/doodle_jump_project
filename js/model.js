/**
 * 0, plateforme normale: 1, 1, 57, 15
 * Will contain path to tilemap
 * Maybe an array of object representing tiles in tilemap (id, x, y, width, height)
 */
export default class Model {
    static GRAVITY     = 40;
    static JUMP_FORCE  = 1400;
    static SPEED       = 200;
    static HEIGHT_TRIG = 315;   // ES : Height to trigger ascension 
    static MAX_GAP = 370;       // ES : Max distance between platforms 
    constructor() {
        this.InitGame('MENU');
    }

    get position() { return this._position; }
    get direction() { return this._direction; }
    set direction(value) { return this._direction = value; }
    
    GetScore() {
        return this._score;
    }

    GetMap() {
        return this._map_objects;
    }

    GetGameState() {
        return this._game_state;
    }

    SetGameState(game_state) {
        this._game_state = game_state;
    }

    BindDisplay(callback) {
        this.b_Display = callback;
    }

   
    Move(fps) {
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
            this._score = Math.floor(this._score - ((this._gravitySpeed / fps)/2));
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
                if((this._position.y+25 <= o.y  && this._position.y >= o.y-50) && (this._position.x >= o.x - 20 && this._position.x <= o.x + 60)) {
                    this._Jump();
                    if(o.type === "falling_tile") o.is_falling = true;
                }
            })
            // ES : Game over condition to handle later
            if (this._position.y > 830) { 
                this._game_state = 'OVER';
            }
        }

        this.b_Display(this._position);
        // ES : Get rid of bottom platforms
        this._map_objects = this._map_objects.filter(o => o.y < 800);

        // if(this._map_objects.length < 10) {
        while(Math.min(...this._map_objects.map(o => o.y)) > -400) {
            this._FillMap();
        }
    }

    InitGame(state) {
        this._game_state = state;
        this._score = 0;
        this._direction = 0;                
        this._gravitySpeed = 0;
        this._position = {x: 170, y:493, last_pos: 'r'};
        this._actual_gap = 40;
        this._map_objects = [                   
            {type: 'basic_tile', x: 160, y: 750, is_sentinel: true}
        ];
        this._FillMap();
    }

    _Jump() {
        this._gravitySpeed = -Model.JUMP_FORCE;
    }

    _FillMap() {
        // while(Math.min(...this._map_objects.map(o => o.y)) > -400) {
            const last_sentinel = this._map_objects.findLast(o => o.is_sentinel === true);
            let new_sentinel = this._GeneratePlatform(last_sentinel);
            this._map_objects.push(new_sentinel);
        // }
    }

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

    _MovePlateform(obj) {
        if(obj.direction === 1 && obj.x > 340) {
            obj.direction = -1;
        } else if(obj.direction === -1 && obj.x < 2) {
            obj.direction = 1;
        }
        obj.x += (obj.direction * obj.speed);
    }

    _DropPlatform(obj) {
        obj.y += obj.speed;
    }

}