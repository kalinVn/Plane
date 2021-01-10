import Vector2D from "../lib/Vector2D.js";
import Explosion from "../units/fx/Explosion.js";
import Plan from '../units/Plan.js';
import Tank from '../units/Tank.js';
import Loader from "../lib/Loader.js";
import Animator from "../lib/Animator.js";


class Rock {
	constructor(url, game) {
		this.url = url;
		this.angle = 0;
		this.game = game;
        this.app = game.app;
        this.loader = new Loader();	
       	
	}
	
	async init() {
        this.sprite = await this.loader.loadSprite(this.url);
        this.maxTop = 100;
        this.maxBottom = 250
        this.sprite.x = 1200;
        this.sprite.y = Math.floor( Math.random() * (this.maxBottom - this.maxTop) + this.maxTop);
        if(this.sprite.y < 240){
            this.sprite.x  = 850
        }
        this.sprite.anchor.set(0.5, 0.5);
        this.app.stage.addChild(this.sprite);
        this.game.rocks.push(this);
	}
	update(){
        this.sprite.x -= 0.5;
    }
		

}
export default Rock;