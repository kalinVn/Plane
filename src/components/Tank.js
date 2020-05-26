import Animator from "./Animator.js";
import Vector2D from "./Vector2D.js";
import Rocket from "../components/Rocket.js";

class Tank  {
	constructor(url, game, plan) {
        this.url = url;
        this.game = game;
        this.app = game.app;
        this.sprite;
        this.plan  = plan;
        this.angle = 1;
        this.tankRockets = [];
	}
	
	async init() {
        this.sprite = await Loader.loadSprite(this.url);
        this.sprite.x = 1300;
        this.sprite.y = 505;
        this.sprite.anchor.set(0.2, 0.5);
        this.app.stage.addChild(this.sprite);
        Animator.animate(this);
        this._stepDistPerShoot = 1
        this._distPerShoot = 120;
        
		
	}

    drawWeapon(position, obj) {
		if(this.laser){
			this.laser.clear();
			this.app.stage.removeChild(this.laser);
		}
		this.laser = new PIXI.Graphics();
		this.laser.lineStyle(5, 0x000000, 0.9);
		let x = obj.x 	;
		let y = obj.y ;
		var v1 = new Vector2D(x, y);
		var v2 = new Vector2D(position.x, position.y);
		var normalVector = v2.substract(v1);
		var unitNormalVector = normalVector.mult(1 / normalVector.length());
		this.laser.moveTo(x, y - 22);
		this.laser.lineTo(position.x - 35 , position.y - 22);
        this.laser.endFill();
        this.app.stage.addChild(this.laser);
    }

	async update(){
        this.sprite.x -= 0.5;
        let planPos = new Vector2D(this.plan.sprite.x, this.plan.sprite.y);
        let tankPos = new Vector2D(this.sprite.x , this.sprite.y) ;
        let frontVector = planPos.substract(tankPos);
        this.unitVector = frontVector.mult(1 / frontVector.length());
        frontVector = new Vector2D(tankPos.x +  this.unitVector.x * 70,tankPos.y + this.unitVector.y * 70);
        if(this.sprite.x < 1200 - this._stepDistPerShoot * this._distPerShoot
            && this.sprite.x > 0 && !this.rocket){
            this._stepDistPerShoot++;
            let planSpriteVector = new Vector2D(this.sprite.x, this.sprite.y);
            let axis = new Vector2D(0, this.sprite.y); 
            let vector1 = planSpriteVector.substract(axis);
            let vector2 = planSpriteVector.substract(planPos);
            let crossPr = vector2.cross(vector1);
            let dotPr = vector2.dot(vector1);
            let angle = Math.atan2(crossPr, dotPr) * 180/Math.PI;
            let url = "/src/assets/spritesheet/rocket.json";
            let id = "rocket";
            let rocket = new Rocket(url, id, this.game, this);
            this.tankRockets.push(rocket);
            await this.game.clearCache()
            await rocket.init(this.app, this.game, tankPos.x, tankPos.y, 270 - angle, -30, -50);
        }
    }

}
export default Tank;