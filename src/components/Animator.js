import * as PIXI from 'pixi.js';
class Animator {

    

	static animateBack(tiling, app){
        this.app = app;
        this.bagroundPosX = 0;
        this.bagroundXSpeed = 1.5;
        this.app.ticker.add(() => {
            this._updateBg(tiling);
        });
        
    }
    

    static animate(obj){
        this.app.ticker.add(obj.update, obj);
    }

    static remove(obj){
        this.app.ticker.remove(obj.update, obj);
    }
    static resetTicker(plane, rocket){
        this.app.ticker.remove();
    }

    static createTanks(game, plan){
        this.app.ticker.add(() => {
            game.addNewTank(plan);
        }, 5000);
    }
    

    static _updateBg(tiling){
        this.bagroundPosX = (this.bagroundPosX + this.bagroundXSpeed);
        tiling.tilePosition.x = (-1) * this.bagroundPosX;
    }
    

}
export default  Animator;
