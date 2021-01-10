import * as PIXI from 'pixi.js';
import Game from "../Game.js";
import css from  "./style.css";

global.PIXI = PIXI;

let game = new Game();
game.init();
