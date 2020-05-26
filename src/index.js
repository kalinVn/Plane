global.GAME_SETTING = require('./config/Constants.js'); 
import * as PIXI from 'pixi.js';
import Loader from "./components/Loader.js";
import Game from "./components/Game.js";
import css from  "./styles/style.css";
import Vector2D from "./components/Vector2D.js";

global.Loader = Loader;
global.PIXI = PIXI;
global.Vector2D = Vector2D;
//let game = new Game();
Game.init();
