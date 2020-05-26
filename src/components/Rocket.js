import Animator from "./Animator.js";
import Explosion from "../components/Explosion.js";
import  Plan from "./Plan.js";
import  Tank from "./Tank.js";
import Vector2D from "./Vector2D.js";
class Rocket {
	constructor(url, id, game, machine) {
		this.url = url;
		this.id = id;
		this.machine = machine
		this.angle = 0;
		this.game = game;
		this.app = game.app;
		
	}
	
	async init(app, game, x, y, angle, posX, posY) {
		this.app = app;
		await game.clearCache();
		this.rocketFrames = await Loader.load(this.id, this.url, this);
		this.sprite = new PIXI.AnimatedSprite(this.rocketFrames);
		this.sprite.x = x + posX;
		this.sprite.y = y + posY;
		this.sprite.anchor.set(0.5, 0.5);
		this.sprite.angle = angle;
		this.app.stage.addChild(this.sprite);
		Animator.animate(this, this.sprite)
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
	
	update(){
		if(this.machine instanceof Tank){
			let planPos = new Vector2D(this.game.plan.sprite.x, this.game.plan.sprite.y);
			let posRocket = new Vector2D(this.sprite.x, this.sprite.y);
			if(planPos.distFrom(posRocket) < 60){
				this.app.stage.removeChild(this.sprite);
				this.game.remove(this.game.plan);
			} 
		}else if(this.machine instanceof Plan){
			this.game.tanks.forEach( async (tank, index) => {
				let tankPos = new Vector2D(tank.sprite.x, tank.sprite.y);
				let posRocket = new Vector2D(this.sprite.x, this.sprite.y);
				if(tankPos.distFrom(posRocket) < 80){
					Animator.remove(tank);
					Animator.remove(this);
					this.game.changeScore();
					tank.tankRockets.forEach( async (rocket, index) => {
						Animator.remove(rocket);
						this.app.stage.removeChild(rocket.sprite);
					});
					this.game.tanks.splice(index, 1);
					this.app.stage.removeChild(tank.sprite);
					this.app.stage.removeChild(this.sprite);
					this.game.remove(tank);
					return;
				} 
			});
			this.game.rocks.forEach(  (rock, index) => {
				let rockPos = new Vector2D(rock.sprite.x, rock.sprite.y);
				let posRocket = new Vector2D(this.sprite.x, this.sprite.y);
				if(rockPos.distFrom(posRocket) < 100){
					Animator.remove(this);
					Animator.remove(rock);
					this.game.rocks.splice(index, 1);
					this.app.stage.removeChild(rock.sprite);
					this.app.stage.removeChild(this.sprite);
					this.game.remove(rock);
					
				} 
			});
		}

		if(this.sprite.x > GAME_SETTING.MAX_POS_PLANE_RIGHT  + 70|| 
			this.sprite.y < 60){
			this._clear();
			return;
		}

		if(this.sprite.angle >= 87 && this.sprite.angle <= 92){
            this.sprite.x += GAME_SETTING.ROCKET_SPEED;
		}
		
        else{
			if(!this._unitVector ){
				this._unitVector = new Vector2D(this.machine.unitVector.x, this.machine.unitVector.y);
			}
			if(this.machine instanceof Tank){
				this.sprite.x += this._unitVector.x * (GAME_SETTING.ROCKET_SPEED - 7);
				this.sprite.y += this._unitVector.y *(GAME_SETTING.ROCKET_SPEED - 7);
			}else{
				if(this.sprite.y > 560){
					this._clear();
					return;
				}
				this.sprite.x += this._unitVector.x * GAME_SETTING.ROCKET_SPEED;
				this.sprite.y += this._unitVector.y * GAME_SETTING.ROCKET_SPEED;
			}
			
		}
	
	}
	
	_clear(){
		this.app.stage.removeChild(this.sprite);
		Animator.remove(this);
	}
	
		

}
export default  Rocket;