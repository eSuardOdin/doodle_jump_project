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

    displayTile(t) {

    }


    screenInit() {
        console.log('View constructed');
        this.root = this.getElement("#root");

        this.canvas = this.createElement('canvas');
        this.canvas.id = 'play_screen';
        this.canvas.width = 300;
        this.canvas.height = 512;
        this.canvas.border = "solid black 2px";
        this.root.append(this.canvas);
        this.ctx = this.canvas.getContext("2d");
    }
}