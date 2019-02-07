import { Sprite } from "pixi.js";

export default class Character extends Sprite{
    constructor(texture: PIXI.Texture) {
        super(texture);
    }
    
    public velocityX: number;
    public velocityY: number;

/*     private initCharacter(url: string): void{
        PIXI.loader.add(url).load(this.setup);
    }

    private setup(url: string): void{
        this.newCharacter = new Sprite(PIXI.loader.resources[url].texture);
    } */
}