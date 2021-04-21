import Vector2D from "../lib/Vector2D.js";
import Rocket from "../units/Rocket.js";
import {MAX_POS_PLANE_TOP} from "../Config.js";
import {SPEED_PLANE_TOP} from "../Config.js";
import {MAX_POS_PLANE_LEFT} from "../Config.js";
import {SPEED_PLANE_RIGHT} from "../Config.js";
import {MAX_POS_PLANE_RIGHT} from "../Config.js";
import {SPEED_ROT_RUDDER} from "../Config.js";
import {PLANE_INIT_POS_X} from "../Config.js";
import {PLANE_INIT_POS_Y} from "../Config.js";
import {AnimatedSprite} from "pixi.js";
class Plan {

	constructor(game ,rudder){
        
        this.game = game;
        this.app = game.app;
        this._frames;
        this.rockets = [];
        this.rudder = rudder;
        this._planeDirectionVector =new Vector2D(0,0);
        this.unitVector =new Vector2D(0, 0);
        this.bottomVect = new Vector2D(this.app.stage.height - 30, this.app.stage.width);
        this._stopMoveWhenRotate = true;
    }

    

    _onKeyUpEvent(evt){
        this.sprite.loop = false;
        this.sprite.gotoAndStop(20);
    }

    async _onKeyPressEvent(evt){
        this.game.clearCache();
        console.log(evt.charCode);
        let colideBottom = await this._isColideBottom();
        if(colideBottom){
            return;
        }
        else if(evt.charCode == 100){
            if(!this._stopMoveWhenRotate)
                this._stopMoveWhenRotate = true;
            else
                this._stopMoveWhenRotate = false;
        }
        if(evt.charCode != 115){
            this.sprite.loop = true;
            this.sprite.play();
        }
        if(evt.charCode == 113){
            if(this.sprite.x > MAX_POS_PLANE_LEFT){
                this.sprite.x -= SPEED_PLANE_RIGHT;
            }
        }
        
        else if(evt.charCode == 115){
            let url = "/src/assets/spritesheet/rocket.json";
            let id = "rocket";
            let rocket = new Rocket(url, id, this.game, this);
            this.game.rockets.push(rocket);
            await rocket.init(this.app, this.game, this.sprite.x, this.sprite.y, 
            this.sprite.angle, 30 , 50, );
        }

        else if(evt.charCode == 97){
            if(this.sprite.x < MAX_POS_PLANE_RIGHT){
                this.sprite.x += SPEED_PLANE_RIGHT;
            }
        }
        else if(evt.charCode == 119){
            if(this.sprite.y > MAX_POS_PLANE_TOP){
                this.sprite.y -= SPEED_PLANE_TOP;
            }
            else {
                this.sprite.y = MAX_POS_PLANE_TOP + 1;
            }
        }
        else if(evt.charCode == 101){
            if(this.sprite.y >= MAX_POS_PLANE_TOP){
                this.sprite.y += SPEED_PLANE_TOP;
            }else{
                this.sprite.y =  MAX_POS_PLANE_TOP + 1;
            }
        }
    }

    _isColideBottom() {
        let pos = new Vector2D(this.sprite.x , this.sprite.y);
            let bottomVect = new Vector2D(this.sprite.x, 500);
            let v1 = bottomVect.substract(pos, bottomVect)
            let paddingPosX = 0;
            let paddingPosY = 0;
            if(v1.length() < 25){
                return true;
            }
            return false;
    }

    update() {
        if(this.sprite){
            let colideBottom =  this._isColideBottom();
            if(colideBottom){
                return;
            }
            
            if(Math.abs(this.sprite.angle - 90) > 5 ){
                this._planeDirectionUnitVector = this._planeDirectionVector.mult(1 / this._planeDirectionVector.length());
                
                let rads = ( this.sprite.angle - 90) * (Math.PI / 180);
                let unitX =  Math.cos(rads)
                let unitY =  Math.sin(rads );
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
            }
        }
    }


    async init (frames, pilotCabile){
        document.body.onkeypress  = evt => this._onKeyPressEvent(evt);
        document.body.onkeyup  = evt => this._onKeyUpEvent(evt);
        this.rudderSprite = this.rudder.sprite;
        pilotCabile.scale.set(0.3 , 0.3 );
        pilotCabile.x = 870
        this.app.stage.addChild(pilotCabile);
        this._createPlaneSprite(frames);
        
    }	

    _createPlaneSprite(frames) {
        this._frames = frames;
        
        this.sprite =  new AnimatedSprite(frames);
        this.sprite.play();
        this.rads = 90 * (Math.PI / 180);
        let angle = this.rads * (180/ Math.PI);
        this.sprite.angle = angle;
        this.sprite.x = PLANE_INIT_POS_X;
        this.sprite.y = PLANE_INIT_POS_Y;
        this.sprite.anchor.set(0.5, 0.5);
        this.app.stage.addChild(this.sprite);
        this.sprite.loop = false;
        this.sprite.gotoAndStop(20);
        this.rudder.setPlane(this.sprite, this.app);
        this.app.stage.addChild(this.rudderSprite);
        
        
    }
    

}
export default Plan