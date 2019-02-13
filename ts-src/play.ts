import Star from "./star";
import Application from "./application";
import Character from "./Character";
import { Sprite } from "pixi.js";

export default class Play{
    private stars: Array<Star>;
    private score: number = 0;
    public intervalId: number;
    private enemies: Array<Character>;
    private missles: Array<Sprite>;
    public player: Character;

    constructor(app:PIXI.Application) {
        this.drawBackground(app);
        this.displayScore(app);
        this.spawnEnemies(app);
        this.spawnPlayer(app);        
    }

    private drawBackground(app: PIXI.Application): void {
        this.stars = new Array();
        for (var i = 0; i < 430; i++) {
            let star;
            if (i % 2 === 0) {
                star = new Star(PIXI.loader.resources['resources/images/circle.png'].texture, 3);
            }
            else {
                star = new Star(PIXI.loader.resources['resources/images/circle.png'].texture, 20);
            }
            star.position.set(Application.randomNumber(1, 800), Application.randomNumber(1, 600));
            star.scale.set(0.01);
            app.stage.addChild(star);
            this.stars.push(star);
        }
    }

    private displayScore(app: PIXI.Application): void{
        let message: PIXI.Text = 
            new PIXI.Text('Score: ' + this.score, { fill: 0xFFFFFF });
        message.position.set(10, 10);
        app.stage.addChild(message);
    }

    private spawnPlayer(app: PIXI.Application): void{
        let player = new Character(PIXI.loader.resources['images'].textures['spaceship.png']);
        player.position.set(75, app.view.height / 2);
        player.velocityX = 0;
        player.velocityY = 0;
        app.stage.addChild(player);
        this.player = player;
    }

    private spawnEnemies(app: PIXI.Application){
        this.enemies = new Array();
        this.intervalId = setInterval(() =>{
            let enemy = new Character(PIXI.loader.resources['images'].textures['alien.png']);
            enemy.scale.set(0.15, 0.15);
            enemy.position.set(app.view.width, Application.randomNumber(enemy.height, 600 - enemy.height));
            this.enemies.push(enemy);
            app.stage.addChild(enemy);
        }, 2000);
    }

    /* private moveObjects(player: Character, velocityX: number, velocityY: number, app: PIXI.Application){
        player.x += player.velocityX;
	player.y += player.velocityY;

	for (let i = this.enemies.length - 1; i >= 0; i--) {
		let currentEnemy = this.enemies[i];
		currentEnemy.x -= 4;
		/* currentEnemy.y += app.randomNumber(-2, 2);   //SHOULD I LEAVE IT IN OR NOT? DECIDE LATER

		/* detectCollision(player, currentEnemy); 
		if (currentEnemy.x <= 0 - currentEnemy.width / 2) {
			this.enemies = this.enemies.filter(e => e !== currentEnemy);
			app.stage.removeChild(currentEnemy);
		}
	}
	
	for (let i = missles.length - 1; i >= 0; i--) {
		let currentMissle: Character = missles[i];
		currentMissle.x += 10;
		if (currentMissle.x > app.view.width) {
			missles = missles.filter(m => m !== currentMissle);
		}
	}

	for (let j = 0; j < missles.length; j++) {
		for (let k = 0; k < enemies.length; k++) {
			if (missles[j] !== null && missles[j] !== undefined && enemies[k] !== null && enemies[k] !== undefined) {
			checkTargetHit(missles[j], enemies[k]);
			}
		}
	}

	for (let i = 0; i < stars.length; i++) {
		let currentStar: Star = stars[i];
		currentStar.x -= 1;

		if (currentStar.x < 0) {
			currentStar.x *= -currentStar.speed;
			currentStar.x += app.view.width;
			currentStar.y = Application.randomNumber(1, 600);
		}
	}
    } */
    
}