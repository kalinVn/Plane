import Animator from "./Animator.js";
import Explosion from "../components/Explosion.js";
import  Plan from "./Plan.js";
import  Tank from "./Tank.js";
import Vector2D from "./Vector2D.js";

class Rock {
	constructor(url, game) {
		this.url = url;
		this.angle = 0;
		this.game = game;
		this.app = game.app;	
	}
	
	async init() {
        this.sprite = await Loader.loadSprite(this.url);
        this.maxTop = 100;
        this.maxBottom = 250
        this.sprite.x = 1200;
        this.sprite.y = Math.floor( Math.random() * (this.maxBottom - this.maxTop) + this.maxTop);
        if(this.sprite.y < 240){
            this.sprite.x  = 850
        }
        this.sprite.anchor.set(0.5, 0.5);
        this.app.stage.addChild(this.sprite);
        Animator.animate(this);
        this.game.rocks.push(this);
	}
	
	update(){
        this.angle++;
        this.sprite.x -= 0.5;
        let tankPos = new Vector2D(this.game.plan.sprite.x, this.game.plan.sprite.y);
        let posRock = new Vector2D(this.sprite.x, this.sprite.y);
        if(tankPos.distFrom(posRock) < 130){
            Animator.remove(this);
            this.app.stage.removeChild(this.sprite);
            this.game.remove(this.game.plan);
        }
    }
	
		

}
export default Rock;