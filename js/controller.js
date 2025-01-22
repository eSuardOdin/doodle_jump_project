export default class Controller {
    constructor(view, model) {
        this.view = view;
        this.model = model;

        console.log('Controller constructed');
    }

    sayHello() {
        console.log('Hello from controller');
    }
}