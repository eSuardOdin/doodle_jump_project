export default class View {
    
    constructor()
    {
        this.screenInit();
    }


    // ES : Create an html element with optionnal CSS class
    createElement(tag, className) {
        const element = document.createElement(tag);
        if(className) {
            element.classList.add(className);
        }
        return element;
    }

    // ES : Retrieve element from the DOM
    getElement(selector) {
        const element = document.querySelector(selector);
        return element;
    }


    testCanvas() {
        this.ctx.fillStyle = "rgb(200 0 0)";
        this.ctx.fillRect(10, 10, 50, 50);
    }


    /**
     * @param {HTMLImageElement} image The tilemap to pick from
     * @param {Object} tile Represents tile on tilemap like `{id: 'basic_tile', x: 1, y: 1, w: 57, h: 15}`
     * @param {*} x Where you want to place the tile on map x-axis
     * @param {*} y Where you want to place the tile on map y-axis
     */
    displayTile(image, tile, x, y) {
        if(!image.complete) {
            console.log('Error, image not loaded');
            return;
        }
        console.log(this.ctx);
        console.log("Image:", image, "Width:", image.width, "Height:", image.height);
        // ES : Beware, called tile.width and tile.height, properties do not exists but javascript was ok with it. FUCK JS
        this.ctx.drawImage(image, tile.x, tile.y, tile.w, tile.h, x, y, tile.w, tile.h);
    }


    screenInit() {
        console.log('View constructed');
        this.root = this.getElement("#root");

        this.canvas = this.createElement('canvas');
        this.canvas.id = 'play_screen';
        this.canvas.width = 352;
        this.canvas.height = 530;
        this.canvas.border = "solid black 2px";
        this.root.append(this.canvas);
        this.ctx = this.canvas.getContext("2d");
    }
}