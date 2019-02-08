import { Sprite } from "pixi.js";

export default class Character extends Sprite{
    constructor(texture: PIXI.Texture) {
        super(texture);
    }
    
    public velocityX: number;
    public velocityY: number;
}