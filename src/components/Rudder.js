

class Rudder {

    constructor(app , url){
        this.url = url;
        this.app = app;
    }
    
    async init (){
        this._isRotated = false;
        this.sprite = await Loader.loadSprite("src/assets/spritesheet/rudder1.png");
        this.sprite.moveWhenInside = true;
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.scale.set(0.8 , 0.8 );
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.x = 1150;
        this.sprite.y = 160;
        this.sprite.on('pointerdown', e => this._rudderOnPointerDown(e));
        this.sprite.on('pointerup', e => this._rudderOnPointerUp(e));
        this.sprite.on('pointerout', e => this._rudderOnPointerOut(e)); 
        this.sprite.on('pointermove', e => {
            if(this._isRotated){
                let position = new Vector2D(
                    e.data.getLocalPosition(this.app.stage).x,
                    e.data.getLocalPosition(this.app.stage).y
                )
                this._rotate(position);
            }
        });
       
    }

    setPlane(planSprite){
        this._planSprite = planSprite;
        
    }

    _rudderOnPointerOut(e){
        this._isRotated = false;
        this._planSprite.loop = true;
        this._planSprite.gotoAndStop(20); 
    }

    _rudderOnPointerDown(e){
        this._isRotated = true;
        
    }

    _rudderOnPointerUp(e){
        this._isRotated = false;
        this._planSprite.loop = true;
        this._planSprite.gotoAndStop(20);
        
        if(this.rotAnggleRudderRight ){
          this.rotAnggleRudderLeft = null
        }
        if(this.rotAnggleRudderLeft ){
            this.rotAnggleRudderRight = null;
        }
    }

   _rotate(mousePosition){
        if(this._planSprite.angle >= 89 && this._planSprite.angle <= 91){
            this.rotAnggleRudderLeft = null;
            this.rotAnggleRudderRight = null
        }
        let planSpriteVector = new Vector2D(this.sprite.x, this.sprite.y);
        let axis = new Vector2D(0, this.sprite.y);
        if(mousePosition.x > this.sprite.x){
            axis = new Vector2D(1260, this.sprite.y);
        }
        let vector1 = planSpriteVector.substract(axis);
        let vector2 = planSpriteVector.substract(mousePosition);
        let crossPr = vector2.cross(vector1);
        let dotPr = vector2.dot(vector1);
        let angle = Math.atan2(crossPr, dotPr) * 180/Math.PI;
        if(mousePosition.x - GAME_SETTING.PADDING_MOUSE_POS_RUDDER > this.sprite.x){
            if(angle > GAME_SETTING.MAX_ROT_RUDDER_TOP || angle < - GAME_SETTING.MAX_ROT_RUDDER_BOTTOM ){
                return;
            }
            this.sprite.angle  = -angle + GAME_SETTING.PADDING_MOUSE_POS_RUDDER ;
            if(!this.rotAnggleRudderLeft){
                this._planSprite.angle = 90 - angle + GAME_SETTING.PADDING_MOUSE_POS_RUDDER;
            }else{
                this._planSprite.angle =  90 + angle - GAME_SETTING.PADDING_MOUSE_POS_RUDDER;
            }
            this.rotAnggleRudderRight = angle;
            
        } else if(mousePosition.x < this.sprite.x - GAME_SETTING.PADDING_MOUSE_POS_RUDDER){
            if(angle > GAME_SETTING.MAX_ROT_RUDDER_BOTTOM || angle < -GAME_SETTING.MAX_ROT_RUDDER_TOP){
                return;
            }
            this.sprite.angle  = -angle  - GAME_SETTING.PADDING_MOUSE_POS_RUDDER;
            if(!this.rotAnggleRudderRight){
                this._planSprite.angle = 90 + angle + GAME_SETTING.PADDING_MOUSE_POS_RUDDER;
            }else{
                this._planSprite.angle = 90 - angle - GAME_SETTING.PADDING_MOUSE_POS_RUDDER;
            }
            this.rotAnggleRudderLeft = angle;
        }		
    }

}
export default Rudder;
