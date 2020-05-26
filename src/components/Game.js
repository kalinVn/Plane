import {gsap, TimelineMax} from "gsap/all";
import Helper from "../ui/Helper.js";
import  Rock from "../components/Rock.js";
import Animator from "../components/Animator.js";
import Plan from './Plan.js';
import Rudder from "../components/Rudder.js";
import Tank  from "../components/Tank.js";
import Explosion from "../components/Explosion.js";

class Game{	

	static async init(){
		this.score = 0;
		gsap.registerPlugin(TimelineMax);
		this.app;
		this._startWindow;
		this.planRockets = [];
		this.tanks = [];
		this.rocks = [];
		this.app = new PIXI.Application( {width : 1260, height : 550,backgroundColor: 0x252729});
		this.app.stage.interactive = false;
		document.body.appendChild(this.app.view);
		this.propText = {
			label : 'Score : ' + this.score,
			fontFamily : 'Arial',
			fontSize : 27,
			fill : "black",
			x : 50,
			y : 20
		};
		this.textScore = await Helper.score(this.propText);
		
	
		let url = "src/assets/back.png";
		let id = "back";
		let tiling = await Loader.load(id, url);
		await this._onTilingLoaded(tiling);

		
	}

	static async reset(){
		clearInterval(this.newTankInterval);
		this.app.ticker.stop()
		while(this.app.stage.children.length > 0){   
			var child = this.app.stage.getChildAt(0);
			this.app.stage.removeChild(child);
		}
		this.clearCache();
		this.app.destroy(true);
    	this.app = null;
		this.init();
	}

	static async remove(obj ){
		if(!this.isExplode) {
			let explosionUrl = "/src/assets/spritesheet/mc.json";
			let explosionId = "explos"  ;
			let explosion = new Explosion(explosionUrl, explosionId, obj.sprite);
			await this.clearCache()
			let loaderExplosion =   explosion.init(this.app, obj.sprite.x, 
				obj.sprite.y);
			loaderExplosion.then( () => {
				
				this.isExplode = false;
				if(obj instanceof Plan){
					this.app.ticker.stop();
					this.reset();
				}else{
					this.app.stage.removeChild(obj.sprite);
				}
				
			});
			this.isExplode = true;
		}
	}

	static async clearCache(){
		PIXI.utils.clearTextureCache();
		let loader = new PIXI.Loader();
		loader.reset();
	}

	static _onTilingLoaded(tiling){
		return new Promise( async (resolve, reject ) => {
			this.app.stage.addChild(tiling);
			let propStartWindow = {
				regX : 0,
				regY : 0,
				width : 1060,
				height : 470,
				x : 100,
				y : 20,
				radius : 10,
				color : 0x224144,
				lineStyle : {
					size : 4,
					color : 0x333638
				}	
			};
			this._startWindow =   await Helper.createWindow(propStartWindow);
			let width = 320;
			let x = propStartWindow.width/ 2  - width/2;
			let propBtn = {
				text : {
					label : 'Start Game',
					fontFamily : 'Arial',
					fontSize : 27,
					fill : "blue"	
				},
				
				propContainer : {
					regX : 0,
					regY : 0,
					width : width,
					height : 60,
					x : x,
					y : 370,
					radius : 0,
					color : 0xffffff
				}
			
			};
			Helper.gameDescr(this._startWindow);
			this.app.stage.addChild(this._startWindow);
			let button = await Helper.createBtn(propBtn);
			this._startWindow.addChild(button);
			button.on('pointerdown',async () => {
				await this.onStartWindowPointerDown(this._startWindow);
				await this._onStartGame( tiling);
			});
		});

	}
	
	static async addNewTank(plan) {
		let tankUrl = "src/assets/tank1.png";
		let tank = new Tank(tankUrl, this, plan );
		let rockUrl = "src/assets/asteroid.png";
		let rock = new Rock(rockUrl, this );
		rock.init();
		this.tanks.push(tank);
		tank.init();
	}

	static async changeScore() {
		this.score += 10;
		this.app.stage.removeChild(this.textScore);
		this.propText.label = "Score : " + this.score;
		this.textScore = await Helper.score(this.propText);
		this.app.stage.addChild(this.textScore);
	}

	static async onStartWindowPointerDown(startWindow){
		let tl = new TimelineMax();
		tl
		.to(startWindow, 0.3, {y : startWindow.y + 50})
		.to(startWindow, 0.3, {y : -(startWindow.height) });
		return tl;
	}
	
	static async _onStartGame(tiling){
		this.app.stage.addChild(this.textScore);
		let urlPlan = "src/assets/spritesheet/fighter.json";
		let urlId = "plan";
		let urlRudder = "src/assets/spritesheet/rudder1.png";
		let ruddr = new Rudder(this.app, urlRudder);
		let plan = new Plan(this, ruddr);
		this.plan = plan;
		let planFrames = await Loader.load(urlId, urlPlan, plan);
		Animator.animateBack(tiling, this.app);
		let urlPilotCabine = "src/assets/spritesheet/pilotCabine.jpg";
		let pilotCabine = await Loader.loadSprite(urlPilotCabine);
		await ruddr.init();
		plan.init(planFrames, pilotCabine);
		this.newTankInterval = setInterval( () => {
			this.addNewTank(plan);
		}, 10000);
	}
}
export default  Game;