import {gsap, TimelineMax} from "gsap";
import Vector2D from "./lib/Vector2D.js";
import Helper from "./ui/Helper.js";
import  Rock from "./units/Rock.js";
import  Tiling from "./units/Tiling.js";
import Animator from "./lib/Animator.js";
import Plan from './units/Plan.js';
import Rudder from "./units/Rudder.js";
import Tank  from "./units/Tank.js";
import Explosion from "./units/fx/Explosion.js";
import Loader from "./lib/Loader.js";
import {Application, TilingSprite, utils} from "pixi.js";
import {TILING_PROP} from "./Config.js";
import {PROP_START_WINDOW} from './Config.js';


export default class Game{	

	constructor() {
		this.rockets = [];
		this.planRockets = [];
		this.tanks = [];
		this.rocks = [];
	}

	async gameOverWindow(){
		
		this.propText = {
			label : 'Score : ' + this.score,
			fontFamily : 'Arial',
			fontSize : 27,
			fill : "black",
			x : 50,
			y : 20
		};
		this.textScore = await this.helper.score(this.propText);
		this._startWindow =   await this.helper.createWindow(PROP_START_WINDOW.FORM);
			this.helper.gameDescr(this._startWindow);
			this.app.stage.addChild(this._startWindow);
			let button = await this.helper.createBtn(PROP_START_WINDOW.BUTTON);
			this._startWindow.addChild(button);
			//let rudder = new Rudder(this.app);
			button.on('pointerdown',async () => {
				
				await this.onStartWindowPointerDown(this._startWindow);
				this._onStartGame();
				//await this.animator.animate(this);
				
			});
	}

	async init(){
		this.helper = new Helper();
		this.appLoader = new Loader();
		this.score = 0;
		gsap.registerPlugin(TimelineMax);
		this.app;
		this._startWindow;
		
		this.app = new Application( {width : 1260, height : 550,backgroundColor: 0x252729});
		this.app.stage.interactive = false;
		this.animator = new Animator(this.app);
		document.body.appendChild(this.app.view);
		
		this.gameOverWindow();
		let url = "src/assets/back.png";
		let id = "back";
		this.tiling = new Tiling(id, url, this);
		await this.tiling.init();
		await this._onTilingLoaded();
	}
	
	async load(obj) {
		let object = await this.appLoader.load(obj.id, obj.url);
		return object;
	}

	reset(){
		clearInterval(this.newTankInterval);
		
		this.gameOver = true;
		
		this.app.stage.removeChild(this.plan.sprite);
		
		this.tanks.forEach( (tank) => {
			tank.clear(this);
			this.app.stage.removeChild(tank.sprite);
			
		});
		this.rockets.forEach( (rocket) => {
			
			this.app.stage.removeChild(rocket.sprite);
			
		});
		this.rockets = [];
		
		this.rocks.forEach( (rock) => {
			
			this.app.stage.removeChild(rock.sprite);
			
		});
		this.rocks = [];
		
		
		this.tanks = [];
		this.planRockets = [];
		this.app.stage.children.forEach( (child) => {
			if( !(child instanceof TilingSprite)){
				this.app.stage.removeChild(child);
			}
			
		});
		this.app.stage.removeChild(this.plan.sprite);
		this.app.stage.removeChild(this.plan.rudder.sprite);
		this.app.stage.removeChild(this.textScore);
		
		this.gameOverWindow()
	}

	async explode(obj){
		
		let explosionUrl = "/src/assets/spritesheet/mc.json";
			let explosionId = "explos"  ;
			
			this.app.loader.reset();
			let explosion = this.app.loader
			.add(explosionId, explosionUrl);
			
			explosion.load( (resp) => {
				this.app.stage.removeChild(obj.sprite);
				
				let paddingX = 1;
				let paddingY = 1;
				let explosionTextures = [];
				var counter = 0;
				let len = 25;
				let padding = 0;
				let lenExplosions = 4;
				let explosions = [];
				for( let i = 0; i < len; i++){
					const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
					explosionTextures.push(texture);
				}
				for(let j = 0; j < lenExplosions; j++){

					if( j%2 == 1){
						paddingX *= -1;
					}
					let explosion = new PIXI.AnimatedSprite(explosionTextures);
					explosion.x = obj.sprite.x + paddingX;
					explosion.y = obj.sprite.y ;
					explosion.anchor.set(0.5, 0.5);
					explosions.push(explosion);
					this.app.stage.addChild(explosion);
					//this.gameOver = true;
					setTimeout( () => {
						explosion.loop = false;
						explosion.onComplete = () => {
							if(j == lenExplosions - 1){
								explosions.forEach( (expl) => {
									this.app.stage.removeChild(expl);
									
								});
								this.app.stage.removeChild(obj.sprite);
								if(obj instanceof Plan){
									setTimeout( () => {
										this.reset();
									}, 1000);
								}
							}
							
						};
					},400);
					explosion.play();
					paddingX =	 ((-1) *(paddingX/paddingX))*(paddingX + j * 67);	
				}
			});

	}

	

	clearCache(){
		this.appLoader.clearCache();
	}
	
	update(){
		
		if(this.gameOver || !this.plan.sprite){
			return;
		}
		this.plan.update();
		this.tiling.posX = (this.tiling.posX + TILING_PROP.SPEED);
		this.tiling.sprite.tilePosition.x = (-1) * this.tiling.posX;
		let planePos = new Vector2D(this.plan.sprite.x, this.plan.sprite.y);
		this.rockets.forEach(  (rocket, index) => {
			if(rocket.sprite){
				rocket.update();
				let rocketPos = new Vector2D(rocket.sprite.x, rocket.sprite.y);
				this.rocks.forEach(  (rock, index) => {
					
					let posRock = new Vector2D(rock.sprite.x, rock.sprite.y);
					if(rocketPos.distFrom(posRock) < 80 && rocket.machine instanceof Plan){
						this.explode(rock);
						this.rocks.splice(index, 1);
						this.app.stage.removeChild(rocket.sprite);
					}
				
				});
				this.tanks.forEach(  (tank, index) => {	
					let posTank = new Vector2D(tank.sprite.x, tank.sprite.y);
					if(rocketPos.distFrom(posTank) < 80 && rocket.machine instanceof Plan){
						this.explode(tank);
						this.tanks.splice(index, 1);
						this.app.stage.removeChild(rocket.sprite);
						
					}
					
				});
				if(planePos.distFrom(rocketPos) < 60 && rocket.machine instanceof Tank) {
					this.app.stage.removeChild(rocket.sprite);
					this.explode(this.plan);
					this.gameOver = true;
					return;
				} 
				
			}
		});
		
		
		this.rocks.forEach(  (rock) => {
			let posRock = new Vector2D(rock.sprite.x, rock.sprite.y);
			rock.update();
			if(planePos.distFrom(posRock) < 120) {
				this.app.stage.removeChild(rock.sprite);
				this.explode(this.plan);
				this.gameOver = true;
				return;
			} 
		});
		
		this.tanks.forEach( async (tank)  =>  {
			tank.sprite.x -= 0.5;
			let stepDistPerShoot = tank.getStepDistPerShoot();
			let distPerShoot = tank.getDistPerShoot();
			if(tank.sprite.x < 1200 - stepDistPerShoot * distPerShoot
			&& tank.sprite.x > 0 ){
				tank.shoot();
			}
		});		
		
	}
	

	_onTilingLoaded(tiling){
		return new Promise( async (resolve, reject ) => {
			this.app.stage.addChild(this.tiling.sprite);
			this._startWindow =   await this.helper.createWindow(PROP_START_WINDOW.FORM);
			this.helper.gameDescr(this._startWindow);
			this.app.stage.addChild(this._startWindow);
			let button = await this.helper.createBtn(PROP_START_WINDOW.BUTTON);
			this._startWindow.addChild(button);
			//let rudder = new Rudder(this.app);
			button.on('pointerdown',async () => {
				await this.onStartWindowPointerDown(this._startWindow);
				await this._onStartGame();
				await this.animator.animate(this);
			});
		});

	}
	
	addNewTank(plan) {
		let tankUrl = "src/assets/tank1.png";
		let tank = new Tank(tankUrl, this, plan );
		let rockUrl = "src/assets/asteroid.png";
		let rock = new Rock(rockUrl, this );
		rock.init();
		this.tanks.push(tank);
		tank.init();
	}

	async changeScore() {
		this.score += 10;
		this.app.stage.removeChild(this.textScore);
		this.propText.label = "Score : " + this.score;
		this.textScore = await this.helper.score(this.propText);
		this.app.stage.addChild(this.textScore);
	}

	onStartWindowPointerDown(startWindow){
		let tl = new TimelineMax();
		tl
		.to(startWindow, 0.3, {y : startWindow.y + 50})
		.to(startWindow, 0.3, {y : -(startWindow.height) });
		return tl;
	}
	
	async _onStartGame(){
		
		this.app.stage.addChild(this.textScore);
		let urlPlan = "src/assets/spritesheet/fighter.json";
		let urlId = "plan";
		let rudder = new Rudder(this.app);
		this.plan = new Plan(this, rudder);
		let planFrames =  this.appLoader.load(urlId, urlPlan, this.plan);
		planFrames.then( async(frames) => {
			
			let urlPilotCabine = "src/assets/spritesheet/pilotCabine.jpg";
			let pilotCabine = await this.appLoader.loadSprite(urlPilotCabine);
			
			await rudder.init();
			await this.plan.init(frames, pilotCabine);
			
			await this.addNewTank(this.plan);
			this.gameOver = false;
			
		});
		
		
		this.newTankInterval = setInterval( () => {
			this.addNewTank(this.plan);
		}, 10000);
		
	}
}