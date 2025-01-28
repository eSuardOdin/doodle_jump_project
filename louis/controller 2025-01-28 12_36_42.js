export default class Controller {
    constructor(model, view) {
        this._model = model;
        this._view = view;
        
        this._startTime     = Date.now();
        this._lag           = 0;
        this._fps           = 60; // Frame rate.
        this._frameDuration = 1000 / this._fps; // Avec 60 frame par seconde, la frame va durer 16.7ms.

        this._model.BindDisplay(this.Display.bind(this));
        this._view.BindSetDirection(this.SetDirection.bind(this));
        this._view.BindGetMap(this.GetMap.bind(this));
        this._view.BindGetNearest(this.GetNearest.bind(this));
        this._view.BindGetGameState(this.GetGameState.bind(this));
        this._view.BindSetGameState(this.SetGameState.bind(this));
        this._view.BindGetScore(this.GetScore.bind(this));
        this._view.BindInitGame(this.InitGame.bind(this));
    }

    InitGame(state) {
        this._model.InitGame(state);
    }

    GetScore() {
        return this._model.GetScore();
    }
    GetMap() {
        return this._model.GetMap();
    }

    GetNearest(){
        return this._model.GetNearest();
    }

    GetGameState() {
        return this._model.GetGameState();
    }

    SetGameState(game_state) {
        this._model.SetGameState(game_state);
    }

    Display(position) {
        this._view.Display(position);
    }

    SetDirection(newDirection) {
        this._model.direction = newDirection;
    }
    
    Update() {
        /* Calcul du deltaTime */
        let currentTime = Date.now();
        let deltaTime   = currentTime - this._startTime; // La durée entre deux appels (entre 2 frames).
        
        this._lag += deltaTime;
        this._startTime = currentTime;

        /* Mettre à jour la logique si la variable _lag est supérieure ou égale à la durée d'une frame */
        while (this._lag >= this._frameDuration) {
            /* Mise à jour de la logique */
            this._model.Move(this._fps);
            /* Réduire la variable _lag par la durée d'une frame */
            this._lag -= this._frameDuration;
        }
        
        requestAnimationFrame(this.Update.bind(this)); // La fonction de rappel est généralement appelée 60 fois par seconde.
    }
}


