import Character from './Character';
import * as PIXI from 'pixi.js';

export default class Application{
    public gameArea: PIXI.Application;
    public enemies: [Character];
    public player: Character;
    gameIsOver: boolean;
    textureAtlas;
    resourcesPath: string;
    
    constructor(url: string) {
        this.gameArea = new PIXI.Application({
            width: 800,
            height: 600,
            antialias: true,
            transparent: false,
            resolution: 1
        }); 

        /* this.gameArea = PIXI.autoDetectRenderer(800,600); */
        this.resourcesPath = url;
        /* this.initCharacters(); */
    }

    public initCharacters(): void{
        PIXI.loader.add(this.resourcesPath).load(this.setup);      
    }

    private setup(): void{
        this.initPlayer();
        this.initEnemies();
    }

    private initPlayer(): void{
        let foo = new Character(PIXI.loader.resources[this.resourcesPath].textures['player-ship.png']);
        foo.position.set(0, this.randomNumber(0,600));
        foo.scale.set(0.2,0.2);
        foo.anchor.set(0.5, 0.5);
        foo.rotation = 1.58;
        this.gameArea.stage.addChild(foo);
    }

    private initEnemies(): void{
        while (!this.gameIsOver) {
            let newEnemy = new Character(PIXI.loader.resources[this.resourcesPath].textures['alien-enemy.png']);
            newEnemy.position.set(this.randomNumber(0,800), this.randomNumber(0,600));
            this.gameArea.stage.addChild(newEnemy);
        }
    }

    public randomNumber(min, max): number{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}