import Character from './Character';
import * as PIXI from 'pixi.js';

export default class Application extends PIXI.Application{
    constructor(options: PIXI.ApplicationOptions) {
        super(options)
    }

    public randomNumber(min, max): number{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}