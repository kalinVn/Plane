import Loader from "../../lib/Loader.js";
class Explosion {

	constructor(url, id, machine){
		this.url = url;
		this.id = id;
		this.machine = machine;
		this.loader = new Loader();

	}
	
	
	init(app, x, y ){
		return new Promise( async (resolve, reject) => {
			this.app = app;
			let loaded = false;
			this.explosionFrames = await this.loader.load(this.id, this.url, this);
			let paddingTop = 0;
			let paddingBottom = 0;
			let explosionSprites = [];
			var counter = 0;
			let len = 25
			for( var i = 0; i < len; i++){
				let  explosionSprite = new PIXI.AnimatedSprite(this.explosionFrames);
				let expl = this.addExpl(explosionSprite, x, y, paddingTop, paddingBottom);
				paddingTop++;
				paddingBottom++;
				expl.then( (resp) => {
					counter++;
					//this.app.stage.removeChild(resp);
					//this.app.stage.removeChild(this.machine.sprite);
					resp.loop = false;
					loaded = true;
					if(counter == len){
						resolve(loaded);
					}
				})
			}
		});
		
	}
	
	async addExpl (explosionSprite, x, y, paddingTpp, paddingBottom){
		return new Promise( (resolve, reject) => {
			explosionSprite.x = x + paddingTpp;
			explosionSprite.y = y  + paddingBottom;
			explosionSprite.anchor.set(0.5, 0.5)
			explosionSprite.play();
			this.app.stage.addChild(explosionSprite);
			setTimeout( () => {
				resolve( explosionSprite);
			}, 600);
			
		});
	}
	
	

}
export default  Explosion;