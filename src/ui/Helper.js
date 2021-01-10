import Loader from "../lib/Loader.js";
import {Text, Container, Graphics} from 'pixi.js';
class Helper {
	constructor(){
		this.loader = new Loader();
	}
	async score(prop){
		let label = prop.label;
		let fontFamily = prop.fontFamily;
		let fontSize = prop.fontSize;
		let fill = prop.fill;
		let x = prop.x;
		let y = prop.y;
		let text = new Text(label,{fontFamily : fontFamily, fontSize: fontSize, fill : fill});
		text.x = x;
		text.y = y;
		return text;
		
	}

	async createBtn(prop){
		var propText = prop.text;
		var propContainer = prop.propContainer;
		var label = propText.label;
		var fontFamily = propText.fontFamily;
		var fontSize = propText.fontSize;
		var fill = propText.fill;
		var fill = propText.fill;
		var x = propText.x;
		var y = propText.y;
		let text = new Text(label,{fontFamily : fontFamily, fontSize: fontSize, fill : fill});
		text.anchor.set(0.5, 0.5);
		var container = await this.createWindow(propContainer)
		text.x = container.width/2;
		text.y = container.height/2;
		container.addChild(text);
		container.buttonMode = true;
		container.interactive = true;
		return container;
	}
	
	async createWindow(prop){ 
			var regX = prop.regX;
			var regY = prop.regY;
			var width = prop.width;
			var height = prop.height;
			var x = prop.x;
			var y = prop.y;
			var color = prop.color;
			if(prop.radius){
				var radius = prop.radius;
			}else{
				var radius = 0;
			}
			if(prop.lineStyle){
				var size = prop.lineStyle.size;
				var colorLineStyle = prop.lineStyle.color
			}
			
			let container = new Container();
			var overlay = new Graphics();
			if(prop.lineStyle){
				overlay.lineStyle(size, colorLineStyle, 1);
			}
			overlay.beginFill(color, 1);
			if(prop.radius && prop.radius != 0 ){
				overlay.drawRoundedRect(regX, regY, width , height, radius);
			}else{
				overlay.drawRect(regX, regY, width , height);
			}
			overlay.endFill();
			container.x = x;
			container.y = prop.y;
			container.addChild(overlay);
			return container;
			
	}

	async gameDescr(container){
		let fontFamily = "Arial";
		let fontSize = 12;
		let color = "white";
		let x  = 30; 
		let desr = [
			"Press q :  Move back",
			"Press w :  Move top",
			"Press a :  Move left",
			"Press e :  Move bottom",
			"Press s :  Shoot ",
			"Press d :  Start plan to move angle velocity direction ",
			"Rotaton"

		];
		let descrText;
		let padddingBottomY = 0;
		for (let i = 0; i < desr.length; i++){
			descrText = new Text(
				desr[i]
				,{
					fontFamily : fontFamily, 
					fontSize: fontSize, 
					fill : color
				}
			); 
			descrText.x = 270;
			descrText.y = 70 + padddingBottomY;
			padddingBottomY += 40;
			if(i == desr.length -1 ){
				descrText.x = 630;
				descrText.y = 70 ;
			}
			container.addChild(descrText);
		}
		this.sprite = await this.loader.loadSprite("src/assets/spritesheet/rudder1.png");
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.x = 650;
		this.sprite.y = 160;
		container.addChild(this.sprite);
	}

}
export default  Helper;