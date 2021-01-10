import { utils} from "pixi.js";
class Loader {

    constructor(){
        this.loader = new PIXI.Loader();
    }
    
    async load(id, url, obj) {
        
        if(obj){
            if( obj){
                if(id == "plan"){
                   let frames =  await this._createPlan(id, url);
                   
                  return frames;
                }else if(id == "rocket"){
                    let frames = await this._createRocket(id, url);
                        return frames;
                }else  if( id = "explos"){
                    let frames = await this._createExplosion(id, url);
                    return frames;
                }
            }
         }
        if(id == "back"){
            let tiling = await this._createBg(id, url);
            return tiling;
        }
    }

    clearCache(){
		utils.clearTextureCache();
		this.loader.reset();
    }
    
    reset(){
        this.loader.reset();
    }
    
    _createRocket(id, url){
        return new Promise( (resolve, reject) => {
            let resp = this.loader.add(id, url);
            
            resp.load ( () => {
                
                const frames = [];
                for (let i = 0; i < 4; i++) {
                    const val =  `0${i}`;
                    frames.push(PIXI.Texture.from(`rocket${val}.png`));
                }
                resolve(frames);
            });
        });
    }

    _createExplosion(id, url){
        return new Promise( (resolve, reject) => {
            this.loader.add(id, url).load ( () => {
                const frames = [];
                for (let i = 0; i < 26; i++) {
                    const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
                    frames.push(texture);
                }
                
                resolve(frames);
            });
        });
    }

    _createPlan(id, url){
        return new Promise(  (resolve, reject) => {
           // var resp = new PIXI.loaders.Loader();
            let resp = this.loader.add(id, url);
            resp.once('complete', () => {
                const frames = [];
                for (let i = 0; i < 30; i++) {
                    const val = i < 10 ? `0${i}` : i;
                    frames.push(PIXI.Texture.from(`rollSequence00${val}.png`));
                }
                
                resolve(frames);
            });
            resp.load();
            
            // resp.load( (res) => {

            //     const frames = [];
            //     for (let i = 0; i < 30; i++) {
            //         const val = i < 10 ? `0${i}` : i;
            //         frames.push(PIXI.Texture.from(`rollSequence00${val}.png`));
            //     }
                
            //     resolve(frames);
            // });
            
        });
    }

    

    _createBg(id, url){
        return new Promise( (resolve, reject) => {
            this.loader.add(id, url).load ( () => {
                let texture = this.loader.resources['back'].texture
                let tiling = new PIXI.TilingSprite(texture, 1260, 570);
                tiling.position.set(0, 0);
                resolve(tiling);
            });
        });
    }

    loadSprite(url){
        return new Promise( (resolve, reject) => {
            let rudder = PIXI.Sprite.from(url);
            resolve(rudder);
        });
    }

}
export default  Loader;
