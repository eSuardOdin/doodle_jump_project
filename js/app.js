import View from "./view.js";
import Model from "./model.js";
import Controller from "./controller.js";


        const HEXTILES_IMAGE = new Image();
        HEXTILES_IMAGE.src = '../assets/game-tiles.png';
        const DOODLE_R = new Image();
        DOODLE_R.src = '../assets/lik-right.png';
        const DOODLE_L = new Image();
        DOODLE_L.src = '../assets/lik-left.png';
        Promise.all([
            new Promise( (resolve) => {HEXTILES_IMAGE.addEventListener('load', () => { resolve();}); })
        ])
        .then(() => {
            const app = new Controller(new Model(), new View(HEXTILES_IMAGE, DOODLE_R, DOODLE_L));
            app.Update();
        });
