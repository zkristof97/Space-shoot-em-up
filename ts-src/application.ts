import Star from "./star";

export default class Application{
    public static state: string = '';
    public static stars: Array<Star> = new Array(); 
    public static panel: PIXI.Sprite;
    public static intervalId: number = 0;
    public static panelButtons: PIXI.Sprite[] = new Array();

    public static randomNumber(min, max): number{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}