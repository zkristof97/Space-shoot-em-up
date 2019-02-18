import * as PIXI from 'pixi.js';

export default class Player extends PIXI.Sprite {

    constructor(texture: PIXI.Texture) {
        super(texture);
    }

    public velocityX: number = 0;
    public velocityY: number = 0;
}