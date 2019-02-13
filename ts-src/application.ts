import * as PIXI from 'pixi.js';

export class Application{
    constructor() {
    }

    public randomNumber(min, max): number{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}