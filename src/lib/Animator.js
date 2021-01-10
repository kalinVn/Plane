class Animator {

    constructor(app){
        this.app = app;
    }
    

    animate(obj){
        this.app.ticker.add(obj.update, obj);
    }

    remove(obj){
        this.app.ticker.remove(obj.update, obj);
    }
    static resetTicker(plane, rocket){
        this.app.ticker.remove();
    }

    

}
export default  Animator;
