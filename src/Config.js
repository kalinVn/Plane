
export  const MAX_POS_PLANE_TOP =  60;
export  const MAX_POS_PLANE_LEFT = 120;
export  const MAX_POS_PLANE_RIGHT = 1440;
export  const  SPEED_ROT_RUDDER = 0.5;
export  const  MAX_ROT_RUDDER_TOP = 70;
export  const MAX_ROT_RUDDER_BOTTOM = 10;
export  const PADDING_MOUSE_POS_RUDDER  = 20;
export  const SPEED_PLANE_RIGHT = 8;
export  const SPEED_PLANE_TOP = 8;
export  const PLANE_INIT_POS_X = 200;
export  const PLANE_INIT_POS_Y = 100;
export  const ROCKET_SPEED = 10;
export  const APP_WIDTH = 1260;
export  const WINDOW_WIDTH = 1060;
export  const  BUTTON_WIDTH = 320;
export  const  BUTTON_X = WINDOW_WIDTH / 2 - BUTTON_WIDTH / 2

export  const  TILING_PROP = {
	POS_X  : 0 ,
	SPEED : 1.5
}

export  const  PROP_START_WINDOW = {
	
	FORM : {
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
	}, 
	
	BUTTON : {
		text : {
					label : 'Start Game',
					fontFamily : 'Arial',
					fontSize : 27,
					fill : "blue"	
				},
				
				propContainer : {
					regX : 0,
					regY : 0,
					width : BUTTON_WIDTH,
					height : 60,
					x : BUTTON_X,
					y : 370,
					radius : 0,
					color : 0xffffff
				}
			
		
	}
	
	
}