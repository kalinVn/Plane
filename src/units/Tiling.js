
class Tiling {
	constructor(id, url, game) {
		this.id = id;
		this.url = url;
		this.game = game;
		this.posX= 0;
	}
	
	async init() {
        this.sprite = await this.game.load(this);
	}
	
	
		

}
export default Tiling;