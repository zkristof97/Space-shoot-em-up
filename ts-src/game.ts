import Application from './application';
import Character from './Character';
import { Sprite } from 'pixi.js';

let score: number = 0;
let missles: Character[] = new Array();
let enemies: Character[] = new Array();
let player: Character;
let app: Application = new Application('resources/images/player-enemy-atlas.json');

document.getElementById('display').appendChild(app.gameArea.view);

/* PIXI.loader.add('resources/images/circle.png').load(setup2); */

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

PIXI.loader.add('logo','resources/images/logo.png').load(loaded);

function moveLogo(){
	if(logo.y - 18 >= app.gameArea.view.height/2){
		logo.y -= 18;
	}
	else{
		console.log(logo.alpha);
		if(logo.worldAlpha - 0.01 >= 0){
			logo.alpha -= 0.01;
		}
		else{
			app.gameArea.ticker.remove(moveLogo);
			animateMoon();
		}
	}
}

function animateMoon(){
	PIXI.loader.add('moon', 'resources/images/moon-animation.json').load(added);

	function added(){
		let frames: PIXI.Texture[] = new Array();
		for (let i = 1; i <= 48; i++) {
			let index = i < 10 ? '0' + i : i;

			frames.push(PIXI.Texture.fromFrame(index + '.png'));
		}

		let animation = new PIXI.extras.AnimatedSprite(frames);
		animation.animationSpeed = 0.2;
		animation.play();
		app.gameArea.stage.addChild(animation);		
	}
}


let logo: PIXI.Sprite

function loaded(){
	logo = new Sprite(PIXI.loader.resources['logo'].texture);
	logo.anchor.set(0.5);
	logo.position.set(app.gameArea.view.width/2, app.gameArea.view.height + logo.height/2);
	logo.scale.set(0.3);

	app.gameArea.stage.addChild(logo);
	app.gameArea.ticker.add(moveLogo);	
}

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
	

	message.position.set(10, 10);
	app.gameArea.stage.addChild(message);

	PIXI.loader.add('images', 'resources/images/sprites.json').load(setup);

	

	function setup() {
		

		window.addEventListener('keydown', keyDownHandler);
		window.addEventListener('keyup', keyUpHandler);
		window.addEventListener('keypress', (e) => {
			if (e.keyCode === 32) {
				shoot();
			}
		});

		player = new Character(PIXI.loader.resources['images'].textures['spaceship.png']);
		player.position.set(75, app.gameArea.view.height / 2);
		player.velocityX = 0;
		player.velocityY = 0;
		app.gameArea.stage.addChild(player);

		setInterval(() => {
			addEnemy();
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
				let currentMissle: Character = missles[i];
				currentMissle.x += 10;
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

function addEnemy() {
	let enemy = new Character(PIXI.loader.resources['images'].textures['alien.png']);
	enemy.scale.set(0.15, 0.15);
	enemy.position.set(app.gameArea.view.width, app.randomNumber(enemy.height, 600 - enemy.height));
	enemies.push(enemy);
	app.gameArea.stage.addChild(enemy);
}


function detectCollision(player: any, enemy: any): void {
	if (isCollision(player.getBounds(), enemy.getBounds())) {
		console.log('collision');
		/* window.removeEventListener('keydown', keyDownHandler); */
		/* app.gameArea.ticker.stop(); */
		/* obj1.scale.set(0.15, 0.15); */
		/* for (let i = 0; i < obj1.width; i++) {

			for(let j = 0; j < obj1.height; i++)	{
				let particle = new PIXI.Sprite(PIXI.loader.resources['resources/images/circle.png'].texture);
				particle.scale.set(0.002);
				particle.tint = 0xFFFF00;
				particle.position.set(obj1.) 
			}
		} */
		/* obj1 = PIXI.Texture.fromImage('resources/images/circle.png');
		obj2.texture = PIXI.Texture.fromImage('resources/images/circle.png'); */
		/* 	debugger;
		console.log(obj1);  */
		/* drawParticles(); */
	}
}

function checkTargetHit(missle: Character, enemy: Character) {
	if (isCollide(missle.getBounds(), enemy.getBounds())){
		enemies = enemies.filter(e => e !== enemy);
		app.gameArea.stage.removeChild(enemy);

		missles = missles.filter(m => m !== missle);
		app.gameArea.stage.removeChild(missle);
	
		score++;
		message.text = 'Score: ' + score;
	}
}


function isCollision(r1, r2) {
	let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

	hit = false;

	r1.centerX = r1.x + r1.width / 2;
	r1.centerY = r1.y + r1.height / 4;
	r2.centerX = r2.x + r2.width / 2;
	r2.centerY = r2.y + r2.height / 2;

	r1.halfWidth = r1.width / 2;
	r1.halfHeight = r1.height / 4;
	r2.halfWidth = r2.width / 2;
	r2.halfHeight = r2.height / 2;

	vx = r1.centerX - r2.centerX;
	vy = r1.centerY - r2.centerY;

	combinedHalfWidths = r1.halfWidth + r2.halfWidth;
	combinedHalfHeights = r1.halfHeight + r2.halfHeight;

	if (Math.abs(vx) < combinedHalfWidths) {
		if (Math.abs(vy) < combinedHalfHeights) {
		hit = true;
		} else {
			hit = false;
		}
	} else {
		hit = false;
	}
	return hit;
};


function isCollide(a, b) {
	if (a !== null && a !== undefined && b !== null && b !== undefined) {
		return a.x + a.width/2 >= b.x && a.x <= b.x + b.width && a.y + a.height >= b.y && a.y <= b.y + b.height;
	}
}

function shoot() {
	let missle = new Character(PIXI.loader.resources['images'].textures['missle.png']);
	missle.position.set(player.x + player.x/2, player.y + player.height/2);
	app.gameArea.stage.addChild(missle);
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

function drawParticles() {

	let particleContainer = new PIXI.particles.ParticleContainer(40, {
		scale: true,
		position: true,
		rotation: true,
		uvs: true,
		alpha: true
	});

	particleContainer.pivot.set(0.5, 0.5);
	particleContainer.position.set(app.gameArea.view.width / 2, app.gameArea.view.height / 2);

	app.gameArea.stage.addChild(particleContainer);

	let circle = new PIXI.Graphics().beginFill(0x928374).drawCircle(0, 0, 2).endFill();
	let texture: PIXI.Texture = circle.generateCanvasTexture();
	let prevPos = 0;

	for (let i = 0; i < 8; i++) {
		let particle: Sprite;
		switch (i) {
			case 0:
				particle = new Sprite(texture);
				particle.position.set(0, i);
				particleContainer.addChild(particle);
				break;
			case 1:
				prevPos = -i;
				for (let j = -i; j <= i; j++) {
					let particle = new Sprite(texture);
					particle.position.set(j, i + 5);
					particleContainer.addChild(particle);
					prevPos = j;
				}
				break;
			case 2:
				for (let j = -i; j <= i; j++) {
					let particle = new Sprite(texture);
					particle.position.set(j, i + 5);
					particleContainer.addChild(particle);
				}
				break;
			case 3:
				for (let j = -i; j <= i; j++) {
					let particle = new Sprite(texture);
					particle.position.set(j, i + 5);
					particleContainer.addChild(particle);
				}
				break;
			case 4:
				for (let j = -i + 2; j <= i - 2; j++) {
					let particle = new Sprite(texture);
					particle.position.set(j, i + 5);
					particleContainer.addChild(particle);
				}
				break;
			case 5:
				for (let j = -i + 4; j <= i - 4; j++) {
					let particle = new Sprite(texture);
					particle.position.set(j, i + 5);
					particleContainer.addChild(particle);
				}
				break;
			case 6:
				particle = new Sprite(texture);
				particle.position.set(0, i + 5);
				particleContainer.addChild(particle);
				break;
		}

		for (let j = 300; j >= 0; j--) {
			if (j % 10 === 0) {
				let particle = new Sprite(texture);
				particle.position.set(j, i * 5);
				particleContainer.addChild(particle);
			}
		}
	}
}

/* function addParticles(){
	let particle = new Sprite(texture);
				particle.position.set(j, i * 5);
				particleContainer.addChild(particle);
} */