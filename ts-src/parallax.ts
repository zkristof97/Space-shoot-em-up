import * as PIXI from 'pixi.js';

export default class Parallax extends PIXI.extras.TilingSprite{
    
    constructor(texture: PIXI.Texture, width: number, height: number) {
        super(texture, width, height);
        
    }

    public velocity: number = 0;
}