import Application from './application';
import Character from './Character';
import { Sprite } from 'pixi.js';

let score: number = 0;
let missles: Character[] = new Array();
let enemies: Character[] = new Array();
let player: Character;
let app: Application = new Application('resources/images/player-enemy-atlas.json');

let startButtons: HTMLCollectionOf<Element> = document.getElementsByClassName('start-button');

let message = new PIXI.Text('Score: 0');
message.style = new PIXI.TextStyle({
	fill: 0xFFFFFF
});

let stars: Star[] = new Array();

for (let i = 0; i < startButtons.length; i++) {
	startButtons[i].addEventListener('click', test);
}

class Star extends PIXI.Sprite {
	constructor(texture, givenSpeed) {
		super(texture)
		this.speed = givenSpeed;
	}

	public speed: number;
}

function test() {
	document.getElementById('display').innerHTML = null;
	document.getElementById('display').appendChild(app.gameArea.view);

	message.position.set(10, 10);
	app.gameArea.stage.addChild(message);

	PIXI.loader.add('images', 'resources/images/sprites.json').load(setup);

	function setup2() {
		for (var i = 0; i < 430; i++) {
			let star2;
			if (i % 2 === 0) {
				star2 = new Star(PIXI.loader.resources['resources/images/circle.png'].texture, 1);
			}
			else {
				star2 = new Star(PIXI.loader.resources['resources/images/circle.png'].texture, 10);
			}
			star2.position.set(app.randomNumber(1, 800), app.randomNumber(1, 600));
			star2.scale.set(0.01);
			app.gameArea.stage.addChild(star2);
			stars.push(star2);
		}
	}

	function setup() {
		PIXI.loader.add('resources/images/circle.png').load(setup2);

		window.addEventListener('keydown', keyDownHandler);
		window.addEventListener('keyup', keyUpHandler);
		window.addEventListener('keypress', (e) => {
			if (e.keyCode === 32) {
				shoot();
			}
		});

		player = new Character(PIXI.loader.resources['images'].textures['spaceship.png']);
		player.position.set(75, app.gameArea.view.height / 2);

		player.anchor.set(0.5);
		player.hitArea = new PIXI.Rectangle(player.x, player.y, 75, 75);
		player.velocityX = 0;
		player.velocityY = 0;

		app.gameArea.stage.addChild(player);

		setInterval(() => {
			addEnemies();
		}, 2000);
		
		app.gameArea.ticker.add(() => {
			player.x += player.velocityX;
			player.y += player.velocityY;

			for (let i = enemies.length - 1; i >= 0; i--) {
				enemies[i].x -= 4;
				enemies[i].y += app.randomNumber(-2, 2);

				detectCollision(player, enemies[i]);
			}

			for (let i = missles.length - 1; i >= 0; i--) {
				missles[i].x += 10;
			}

			for (let j = 0; j < missles.length; j++) {
				missles[j]
				for (let k = 0; k < enemies.length; k++) {
					checkTargetHit(missles[j], enemies[k]);
				}
			}

			for (let i = 0; i < stars.length; i++) {
				let currentStar: Star = stars[i];
				currentStar.x -= 1;

				if (currentStar.x < 0) {
					currentStar.x *= -currentStar.speed;
					currentStar.x += app.gameArea.view.width;
					currentStar.y = app.randomNumber(1, 600);
				}
			}
		});
	}
}

function addEnemies() {
	let enemy = new Character(PIXI.loader.resources['images'].textures['alien.png']);
	enemy.scale.set(0.15, 0.15);
	enemy.anchor.set(0.5);
	enemy.hitArea = new PIXI.Rectangle(enemy.x, enemy.y, 69.6, 75.89999);
	enemy.position.set(app.gameArea.view.width, app.randomNumber(enemy.height, 600 - enemy.height));

	app.gameArea.stage.addChild(enemy);
	enemies.push(enemy);
}


function detectCollision(obj1: Character, obj2: Character) {
	if (isCollide(obj1, obj2)) {
		window.removeEventListener('keydown', keyDownHandler);
		app.gameArea.ticker.stop();
		obj1.scale.set(0.15, 0.15);
		/* for (let i = 0; i < obj1.width; i++) {

			for(let j = 0; j < obj1.height; i++)	{
				let particle = new PIXI.Sprite(PIXI.loader.resources['resources/images/circle.png'].texture);
				particle.scale.set(0.002);
				particle.tint = 0xFFFF00;
				particle.position.set(obj1.) 
			}
		} */
		/* obj1.texture = PIXI.Texture.fromImage('resources/images/circle.png');
		obj2.texture = PIXI.Texture.fromImage('resources/images/circle.png');
		debugger;
		console.log(obj1); */

		drawParticles();
		
	}
}

function checkTargetHit(missle: Character, enemy: Character) {
	if (isCollide(missle, enemy)) {
		enemies = enemies.filter(e => e !== enemy);
		app.gameArea.stage.removeChild(enemy);

		missles = missles.filter(m => m !== missle);
		app.gameArea.stage.removeChild(missle);
		score++;
		message.text = 'Score: ' + score;
	}
}

function isCollide(a, b) {
	if (a !== null && a !== undefined && b !== null && b !== undefined) {
		return !(
			((a.y + a.height) < (b.y)) ||
			(a.y > (b.y + b.height)) ||
			((a.x + a.width) < b.x) ||
			(a.x > (b.x + b.width))
		);
	}
}

function shoot() {
	let missle = new Character(PIXI.loader.resources['images'].textures['missle.png']);
	missle.position.set(50, app.gameArea.stage.height / 2);
	app.gameArea.stage.addChild(missle);
	missle.position.set(player.x, player.y);
	missles.push(missle);
}

function keyDownHandler(e: any): void {
	switch (e.keyCode) {
		case 37:
			player.velocityX = -5;
			break;
		case 38:
			player.velocityY = -5;
			break;
		case 39:
			player.velocityX = 5;
			break;
		case 40:
			player.velocityY = 5;
			break;
	}
}

function keyUpHandler(e: any): void {
	switch (e.keyCode) {
		case 37:
			player.velocityX = 0;
			break;
		case 38:
			player.velocityY = 0;
			break;
		case 39:
			player.velocityX = 0;
			break;
		case 40:
			player.velocityY = 0;
			break;
	}
}

function drawParticles(){

	let particleContainer = new PIXI.particles.ParticleContainer(40, {
		scale: true,
		position: true,
		rotation: true,
		uvs: true,
		alpha: true
	});

	particleContainer.pivot.set(0.5,0.5);
	particleContainer.position.set(app.gameArea.view.width / 2, app.gameArea.view.height / 2);

	app.gameArea.stage.addChild(particleContainer);

	let circle = new PIXI.Graphics().beginFill(0x928374).drawCircle(0,0,20).endFill();
	let texture: PIXI.Texture = circle.generateCanvasTexture();

	for(let i = 0; i < 8; i++){
		for(let j = 300; j >= 0; j--){
			if(j % 10 === 0){
				let particle = new Sprite(texture);
				particle.position.set(j, i + 5);
				particleContainer.addChild(particle);
			}
		}
	}

	

}