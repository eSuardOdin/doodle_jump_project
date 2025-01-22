import View from "./view.js";
import Model from "./model.js";
import Controller from "./controller.js";

/* -- INITIALISATION DE L'APPLICATION -- */

// /**
//  * Déclaration d'une fonction auto-exécutée (s'exécute lorsque la page est chargée).
//  */
// (function() {
//     let canvas = document.getElementById('my_canvas'); // Récupération d'une balise HTML par son ID.
//     canvas.width  = _nbColumns * _cellSize;
//     canvas.height = _nbLines * _cellSize;
//     let ctx = canvas.getContext('2d'); // Récupération de la surface de dessin.

//     let button = document.getElementById('my_button');
//     /* Exécuter une action lors d'un évènement de changement de valeur */
//     button.addEventListener('click', function(event) {
//         /* Effet de closure pour la récupération du contexte de dessin */
//         ctx.clearRect(0, 0, canvas.width, canvas.height); // Réinitialise en totalité (ou en partie) le canvas (ici en totalité).
        
//         /* -------------------------------------------------------------------------------------------------------------------------------------------------- */
//         /*    ColoredShapeFunction est une variable qui fait référence à une fonction.                                                                        */
//         /*    Cette fonction est issue du return de la fonction DrawColoredShape.                                                                             */
//         /*    Grâce au phénomène de closure, cette fonction peut accéder aux éléments de sa fonction externe (DrawColoredShape) tel que le context de dessin. */
//         /* -------------------------------------------------------------------------------------------------------------------------------------------------- */

//         Display(); 
//     });
//     button.click(); // Trigger l'évènement de click du bouton.
// })();
const HEXTILES_IMAGE = new Image();
HEXTILES_IMAGE.src = '../assets/game-tiles.png';
Promise.all([
    new Promise( (resolve) => {HEXTILES_IMAGE.addEventListener('load', () => { resolve();}); })
])
.then(() => {
    console.log('Tilemap loaded');
    const app = new Controller(new View(), new Model());
    app.sayHello();
    //app.view.testCanvas();
    console.log(app.model.getTile('basic_tile'));
    
    
    // ES : test basic canvas layout
    // Background
    for (let x = 1; x < 352; x += 46) {
        for (let y = 1; y < 530; y += 64) {
            app.view.displayTile(HEXTILES_IMAGE, app.model.getTile('bg'), x, y);
        }
    }
    // Map elements
    app.model.map_array.forEach(e => {
        const tile = app.model.getTile(e.type);
        app.view.displayTile(
            HEXTILES_IMAGE,
            tile,
            e.x,
            e.y
        );
    });


    // app.view.displayTile(HEXTILES_IMAGE, app.model.getTile('bg'), 1, 1);
    // app.view.displayTile(HEXTILES_IMAGE, app.model.getTile('bg'), 58, 16);
    // app.view.displayTile(HEXTILES_IMAGE, app.model.getTile('bg'), 10, 20);
    // app.view.displayTile(HEXTILES_IMAGE, app.model.getTile('bg'), 10, 20);
    // app.view.displayTile(HEXTILES_IMAGE, app.model.getTile('bg'), 10, 20);
    // app.view.displayTile(HEXTILES_IMAGE, app.model.getTile('bg'), 10, 20);

    // app.view.displayTile(HEXTILES_IMAGE, app.model.getTile('basic_tile'), 10, 20);
    // app.view.displayTile(HEXTILES_IMAGE, app.model.getTile('moving_tile'), 120, 120);
    // app.view.displayTile(HEXTILES_IMAGE, app.model.getTile('falling_tile'), 45, 99);
});
