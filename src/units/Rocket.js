import Animator from "../lib/Animator.js";
import Loader from "../lib/Loader.js";
import Vector2D from "../lib/Vector2D.js";
import  Plan from "../units/Plan.js";
import  Tank from "../units/Tank.js";
import {MAX_POS_PLANE_RIGHT} from "../Config.js";
import {ROCKET_SPEED} from "../Config.js";
import {MAX_POS_PLANE_TOP} from "../Config.js";
import {SPEED_ROT_RUDDER} from "../Config.js";

class Rocket {

	constructor(url, id, game, machine) {
		this.url = url;
		this.id = id;
		this.machine = machine
		this.angle = 0;
		this.game = game;
		this.app = game.app;
		this.loader = new Loader();	
		this.animator = new Animator(this.game.app);
		this._planeDirectionVector =new Vector2D(0,0);
		
	}
	
	async init(app, game, x, y, angle, posX, posY) {
		this.app = app;
		game.clearCache();
		this.rocketFrames = await this.loader.load(this.id, this.url, this);
		
		this.sprite = new PIXI.AnimatedSprite(this.rocketFrames);

		this.sprite.x = x + posX;
		this.sprite.y = y + posY;
		this.sprite.anchor.set(0.2, 0.3);
		this.sprite.angle = angle;
		if(!this.sprite){
			return;
		}
		
		this.app.stage.addChild(this.sprite);
		
		//this.animator.animate(this, this.sprite);
		
	}

	update(){
		

		if(!this.sprite){
			return
		}
	
		
		if(Math.abs(this.sprite.angle - 90) > 5 ){
			this._planeDirectionUnitVector = this._planeDirectionVector.mult(1 / this._planeDirectionVector.length());
			let rads11 = ( this.sprite.angle - 90) * (Math.PI / 180);
			let unitX =  Math.cos(rads11)
			let unitY =  Math.sin(rads11 );
			this.unitVector =new Vector2D(unitX, unitY);
			if(this.sprite.y < MAX_POS_PLANE_TOP){
				this.sprite.y = MAX_POS_PLANE_TOP;
			}
			if(this.sprite.x < MAX_POS_PLANE_RIGHT ){
				this.sprite.x += unitX * SPEED_ROT_RUDDER;
				this.sprite.y += unitY * SPEED_ROT_RUDDER;
			}
			this.sprite.loop = true;
			this.sprite.play();
			//return;
		}
		if(this.sprite.x > MAX_POS_PLANE_RIGHT  + 70|| 
			this.sprite.y < 60){
			this._clear();
			//return;
		}

		if(this.sprite.angle >= 87 && this.sprite.angle <= 92){
            this.sprite.x += ROCKET_SPEED;
		}
		
        else{
			if(!this._unitVector ){
				this._unitVector = new Vector2D(this.machine.unitVector.x, this.machine.unitVector.y);
			}
			if(this.machine instanceof Tank){
				this.sprite.x += this._unitVector.x * (ROCKET_SPEED);
				this.sprite.y += this._unitVector.y *(ROCKET_SPEED );
				
			}else{
				
				if(Math.abs(this.sprite.angle - 90) > 5 ){
					this._planeDirectionUnitVector = this._planeDirectionVector.mult(1 / this._planeDirectionVector.length());
					let rads11 = ( this.sprite.angle - 90) * (Math.PI / 180);
					let unitX =  Math.cos(rads11)
					let unitY =  Math.sin(rads11 );
					this.unitVector =new Vector2D(unitX, unitY);
					
					if(this.sprite.y < MAX_POS_PLANE_TOP){
						this.sprite.y = MAX_POS_PLANE_TOP;
					}
					if(this.sprite.x < MAX_POS_PLANE_RIGHT ){
						this.sprite.x += unitX * SPEED_ROT_RUDDER;
						this.sprite.y += unitY * SPEED_ROT_RUDDER;
					}
					this.sprite.loop = true;
					this.sprite.x += this._unitVector.x * ROCKET_SPEED;
					this.sprite.y += this._unitVector.y * ROCKET_SPEED;
					return;
					
				}
				this.sprite.x += 0.5;
				//this.sprite.y += this._unitVector.y * ROCKET_SPEED;
				
			}
			
		}
	
	}
	
	_clear(){
		this.app.stage.removeChild(this.sprite);
		this.animator.remove(this);
	}
	
		

}
export default  Rocket;