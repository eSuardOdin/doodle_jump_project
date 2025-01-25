export default class View {
    
    constructor(hex, r, l) {
        this._hex_img = hex;
        this._r_img = r;
        this._l_img = l;
        this._canvas = document.getElementById('my_canvas');
        this.ctx     = this._canvas.getContext('2d');
        this._hold_right = false;
        this._hold_left = false;
        // Tiles
        this.t_player_r = {id: 'player',   x: 32, y: 30, w: 92, h: 90};
        this.t_player_l = {id: 'player',   x: 0, y: 29, w: 92, h: 90};
        this.tiles = [
            {id: 'basic_tile',   x: 1, y: 1, w: 57, h: 15},
            {id: 'moving_tile',  x: 1, y: 19, w: 57, h: 15},
            {id: 'falling_tile', x: 1, y: 55, w: 57, h: 15},
        ]
        this.Events();
    }

    GetTile(id) {
        return this.tiles.find(t => t.id == id);
    }

    BindGetScore(callback) {
        this.b_Score = callback;
    }

    BindGetMap(callback) {
        this.b_Map = callback;
    }

    BindGetGameState(callback) {
        this.b_GameState = callback;
    }

    BindSetGameState(callback) {
        this.b_SetGameState = callback;
    }

    BindSetDirection(callback) {
        this.b_SetDirection = callback;
    }

    BindInitGame(callback) {
        this.b_InitGame = callback;
    }

    Events() {
        document.addEventListener('keydown', (evt) => {
            if ((evt.key == 'ArrowLeft' || evt.key == 'ArrowRight') && this.b_GameState() === 'GAME') {
                switch (evt.key) {
                    case 'ArrowLeft': // Move left.
                        this._hold_left = true;
                        this.b_SetDirection(-1);
                        break;
                    case 'ArrowRight': // Move right.
                        this._hold_right = true;
                        this.b_SetDirection(1);
                        break;
                }
            } else if(evt.key === ' ' && (this.b_GameState() === 'MENU' || this.b_GameState() === 'OVER')) {
                console.log(`Game state was ${this.b_GameState()}`);
                this.b_InitGame('GAME')
                console.log(`Game state is ${this.b_GameState()}`);
            }
        });

        document.addEventListener('keyup', (evt) => {
            if ((evt.key == 'ArrowLeft' || evt.key == 'ArrowRight') && this.b_GameState() === 'GAME') {
                switch (evt.key) {
                    case 'ArrowLeft': // Move left.
                        if (!this._hold_right) {
                            this.b_SetDirection(0);
                        }
                        this._hold_left = false;
                        break;
                    case 'ArrowRight': // Move right.
                        if (!this._hold_left) {
                            this.b_SetDirection(0);
                        }
                        this._hold_right = false;
                        break;
                }
            }
        });
    }

    Display(position) {
        if(this.b_GameState() === 'GAME') {

            let x = position.x;
            let y = position.y;
            // let last_pos = position.last_pos;
            if(this._hold_left) {
                position.last_pos = 'l';
            } else if(this._hold_right) {
                position.last_pos = 'r';
            }
            this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this.b_Map().forEach(obj => {
                const tile = this.GetTile(obj.type);
                this.ctx.drawImage(this._hex_img, tile.x, tile.y, tile.w, tile.h, obj.x, obj.y, tile.w, tile.h);
            });
            if(position.last_pos === 'l') {
                this.ctx.drawImage(this._l_img, this.t_player_l.x, this.t_player_l.y, this.t_player_l.w, this.t_player_l.h, x, y, this.t_player_l.w/2, this.t_player_l.h/2);
            }
            else{
                this.ctx.drawImage(this._r_img, this.t_player_r.x, this.t_player_r.y, this.t_player_r.w, this.t_player_r.h, x, y, this.t_player_r.w/2, this.t_player_r.h/2);
            }
        }
        else if(this.b_GameState() === 'MENU') {
            this.ctx.font = 'italic 50px DejaVu Sans Mono';
            this.ctx.fillText('Doodle Jump', 8, 250);
            this.ctx.font = 'italic 20px DejaVu Sans Mono';
            this.ctx.fillText('By TEMU', 15, 280);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Press space to get started', 30, 600);
        }
        else if(this.b_GameState() === 'OVER') {
            this.ctx.font = 'italic 50px DejaVu Sans Mono';
            this.ctx.fillText('Game Over', 8, 250);
            this.ctx.font = 'italic 20px DejaVu Sans Mono';
            this.ctx.fillText(`Your score : ${this.b_Score()}` , 15, 280);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Press space to get started', 30, 600);
        }
    }

}

