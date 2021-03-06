import * as PIXI from 'pixi.js';
import Player from "./Character";

export default class Application {

    public static state: string = '';

    public static pauseBtn: PIXI.Sprite;
    public static panel: PIXI.Sprite;
    public static panelButtons: PIXI.Sprite[] = new Array();
    public static shouldPause: boolean = true;

    public static intervalId: number = 0;

    public static missles: Array<PIXI.extras.AnimatedSprite>;
    public static enemies: Array<PIXI.Sprite>;

    public static score: number = 0;

    public static message: PIXI.Text;

    public static isGameOver: boolean = false;
    public static isReplay: boolean = false;

    public static player: Player;

    public static canShoot: boolean = true;
    public static movementOn: boolean = false;

    public static randomNumber(min, max): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}