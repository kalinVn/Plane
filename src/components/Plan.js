import Rocket from "../components/Rocket.js";
import Animator from "./Animator.js";
import Vector2D from "./Vector2D.js";
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
            if(this.sprite.x > GAME_SETTING.MAX_POS_PLANE_LEFT){
                this.sprite.x -= GAME_SETTING.SPEED_PLANE_RIGHT;
            }
        }
        
        else if(evt.charCode == 115){
            let url = "/src/assets/spritesheet/rocket.json";
            let id = "rocket";
            let rocket = new Rocket(url, id, this.game, this);
            await this.game.clearCache()
            await rocket.init(this.app, this.game, this.sprite.x, this.sprite.y, 
                this.sprite.angle, 30 , 50, );
            this.rockets.push(rocket);

        }

        else if(evt.charCode == 97){
            if(this.sprite.x < GAME_SETTING.MAX_POS_PLANE_RIGHT){
                this.sprite.x += GAME_SETTING.SPEED_PLANE_RIGHT;
            }
        }
        else if(evt.charCode == 119){
            if(this.sprite.y > GAME_SETTING.MAX_POS_PLANE_TOP){
                this.sprite.y -= GAME_SETTING.SPEED_PLANE_TOP;
            }
            else {
                this.sprite.y = GAME_SETTING.MAX_POS_PLANE_TOP + 1;
            }
        }
        else if(evt.charCode == 101){
            if(this.sprite.y >= GAME_SETTING.MAX_POS_PLANE_TOP){
                this.sprite.y += GAME_SETTING.SPEED_PLANE_TOP;
            }else{
                this.sprite.y =  GAME_SETTING.MAX_POS_PLANE_TOP + 1;
            }
        }
    }

    drawLaser(position, obj) {
		if(this.laser){
			this.laser.clear();
			this.app.stage.removeChild(this.laser);
		}
		this.laser = new PIXI.Graphics();
		this.laser.lineStyle(1, 0xb8f150d, 0.8);
		let x = obj.x 	;
		let y = obj.y;
		var len = 1;
		var v1 = new Vector2D(x, y);
		var v2 = new Vector2D(position.x, position.y);
		var normalVector = v2.substract(v1);
		var unitNormalVector = normalVector.mult(1 / normalVector.length());
		this.laser.moveTo(x, y);
		this.laser.lineTo(position.x , position.y );
		this.laser.endFill();
        this.app.stage.addChild(this.laser);
    }

    async _isColideBottom() {
        let pos = new Vector2D(this.sprite.x , this.sprite.y);
            let bottomVect = new Vector2D(this.sprite.x, 500);
            let v1 = bottomVect.substract(pos, bottomVect)
            let paddingPosX = 0;
            let paddingPosY = 0;
            if(v1.length() < 25){
                this.game.remove(this);
                return true;
            }
            return false;
    }

    async update() {
        
        this.game.clearCache();
        if(this.sprite){
            let colideBottom = await this._isColideBottom();
            if(colideBottom){
                return;
            }
            if(Math.abs(this.sprite.angle - 90) > 5 ){
                this._planeDirectionUnitVector = this._planeDirectionVector.mult(1 / this._planeDirectionVector.length());
                let rads11 = ( this.sprite.angle - 90) * (Math.PI / 180);
                let unitX =  Math.cos(rads11)
                let unitY =  Math.sin(rads11 );
                this.unitVector =new Vector2D(unitX, unitY);
                if(this._stopMoveWhenRotate){
                    return
                }
                if(this.sprite.y < GAME_SETTING.MAX_POS_PLANE_TOP){
                    this.sprite.y = GAME_SETTING.MAX_POS_PLANE_TOP;
                }
                if(this.sprite.x < GAME_SETTING.MAX_POS_PLANE_RIGHT ){
                    this.sprite.x += unitX * GAME_SETTING.SPEED_ROT_RUDDER;
                    this.sprite.y += unitY * GAME_SETTING.SPEED_ROT_RUDDER;
                }
                this.sprite.loop = true;
                this.sprite.play();
            }
        }
    }


    async init (frames, pilotCabile){
        document.body.onkeypress  = evt => this._onKeyPressEvent(evt);
        document.body.onkeyup  = evt => this._onKeyUpEvent(evt);
        Animator.animate(this)
        this.rudderSprite = this.rudder.sprite;
        pilotCabile.scale.set(0.3 , 0.3 );
        pilotCabile.x = 870
        this.app.stage.addChild(pilotCabile);
        this._createPlaneSprite(frames);
        
    }	

    _createPlaneSprite(frames){
        this._frames = frames;
        this.sprite = new PIXI.AnimatedSprite(this._frames);
        this.sprite.play();
        this.rads = 90 * (Math.PI / 180);
        let angle = this.rads * (180/ Math.PI);
        this.sprite.angle = angle;
        this.sprite.x = GAME_SETTING.PLANE_INIT_POS_X;
        this.sprite.y = GAME_SETTING.PLANE_INIT_POS_Y;
        this.sprite.anchor.set(0.5, 0.5);
        this.app.stage.addChild(this.sprite);
        this.sprite.loop = false;
        this.sprite.gotoAndStop(20);
        this.rudder.setPlane(this.sprite, this.app);
        this.app.stage.addChild(this.rudderSprite);
    }
    

}
export default Plan