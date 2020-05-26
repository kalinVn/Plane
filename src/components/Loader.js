class Loader {

    
    static async load(id, url, obj) {
        this.loader = new PIXI.Loader();
        if(obj){
            if( obj){
                if(id == "plan"){
                   let frames = await this._createPlan(id, url);
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

    reset(){
        this.loader.reset();
    }
    
    static _createRocket(id, url){
        return new Promise( (resolve, reject) => {
            this.loader.add(id, url).load ( () => {
                const frames = [];
                for (let i = 0; i < 4; i++) {
                    const val =  `0${i}`;
                    frames.push(PIXI.Texture.from(`rocket${val}.png`));
                }
                resolve(frames);
            });
        });
    }

    static _createExplosion(id, url){
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

    static _createPlan(id, url){
        return new Promise( (resolve, reject) => {
            this.loader.add(id, url).load ( () => {
                const frames = [];
                for (let i = 0; i < 30; i++) {
                    const val = i < 10 ? `0${i}` : i;
                    frames.push(PIXI.Texture.from(`rollSequence00${val}.png`));
                }

                resolve(frames);
            });
        });
    }

    

    static _createBg(id, url){
        return new Promise( (resolve, reject) => {
            this.loader.add(id, url).load ( () => {
                let texture = this.loader.resources['back'].texture
                let tiling = new PIXI.TilingSprite(texture, 1260, 570);
                tiling.position.set(0, 0);
                resolve(tiling);
            });
        });
    }

    static loadSprite(url){
        return new Promise( (resolve, reject) => {
            let rudder = PIXI.Sprite.from(url);
            resolve(rudder);
        });
    }

}
export default  Loader;
