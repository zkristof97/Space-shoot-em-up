import Character from "./Character";

export default class Application{
    public static state: string = '';
    public static panel: PIXI.Sprite;
    public static panelButtons: PIXI.Sprite[] = new Array();
    public static shouldPause: boolean = true;
    public static intervalId: number = 0;
    public static missles: Array<PIXI.extras.AnimatedSprite> = new Array();
    public static enemies: Array<PIXI.Sprite> = new Array();
    public static doExplosion: boolean = true;
    public static score: number = 0;
    public static pauseBtn: PIXI.Sprite;
    public static message: PIXI.Text;
    public static isGameOver: boolean = false;
    public static isReplay: boolean = false;
    public static player: Character;
    public static canShoot: boolean = true;
    public static speed: number = 5;
    public static offset: number = 4;
    public static soundMuted: boolean = false;
    
    public static addSoundMuteBtn(){

    }
    
    public static randomNumber(min, max): number{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}