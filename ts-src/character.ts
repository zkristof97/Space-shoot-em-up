import * as PIXI from 'pixi.js';

export default class Character extends PIXI.Sprite{
    
    constructor(texture: PIXI.Texture) {
        super(texture);
    }
    
    public velocityX: number;
    public velocityY: number;
}