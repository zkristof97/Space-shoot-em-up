import Application from './application';
import Character from './Character';
import { Sprite } from 'pixi.js';

let score: number = 0;
let missles: Character[] = new Array();
let enemies: Character[] = new Array();
let player: Character;
let app: Application = new Application('resources/images/player-enemy-atlas.json');
let doExplosion:boolean = true;
let message = new PIXI.Text('Score: 0');

document.getElementById('display').appendChild(app.gameArea.view);

PIXI.loader.add('splash-screen', 'resources/images/splash-screen.png')
	.add('explosion', 'resources/images/explosion.json')
	.add('moon', 'resources/images/moon-animation.json')
	.add('logo', 'resources/images/logo.png')
	.add('button', 'resources/images/button.png')
	.add('starBg', 'resources/images/stars.png')
	.add('images', 'resources/images/sprites.json')
	.add('game-over', 'resources/images/game-over.png')
	.add('resources/images/circle.png')
	.load(splashReady);

function splashReady() {
	let splashScreen = new Sprite(PIXI.loader.resources['splash-screen'].texture);

	splashScreen.alpha = 0.2;
	app.gameArea.stage.addChild(splashScreen);
	app.gameArea.ticker.add(() => {
		if (splashScreen.alpha + 0.1 <= 1) {
			splashScreen.alpha += 0.1;
		}
	});

	setTimeout(() => {
		app.gameArea.stage.removeChild(splashScreen);
		initMenu();
	}, 2000);
}

function loadLogo() {
	let logo = new Sprite(PIXI.loader.resources['logo'].texture);
	logo.position.set(app.gameArea.view.width - 160, app.gameArea.view.height / 2 - 150);
	logo.scale.set(0.2);
	app.gameArea.stage.addChild(logo);

}

let buttons: Sprite[] = new Array();

function loadButtons() {
	for (let i = 0; i < 4; i++) {
		let button: Sprite = new Sprite(PIXI.loader.resources['button'].texture);
		button.anchor.set(0.5);
		button.scale.set(0.5);
		button.position.set(app.gameArea.view.width - button.width + 50, app.gameArea.view.height / 2 + (i * 60))
		buttons.push(button);
		button.interactive = true;
		if (i === 3) {
			button.addListener('click', () => {
				window.location.replace('https://www.google.com/');
			});
		}
		else {
			button.addListener('click', loadStars);
		}

		button.addListener('mouseover', () => {
			console.log('over');

		});
		button.addListener('mouseout', () => {
			console.log('out');

		});
		app.gameArea.stage.addChild(button);
	}
	addText();
}

function addText() {
	let i = 0;
	for (i; i < 4; i++) {
		let text: PIXI.Text;
		if (i === 3) {
			text = new PIXI.Text('EXIT');
		}
		else {
			text = new PIXI.Text('GAME' + (i + 1));
		}

		text.anchor.set(0.5);
		text.position.set(buttons[i].x, buttons[i].y);
		app.gameArea.stage.addChild(text);
	}
}

function initMenu() {
	loadBackground();
	animateMoon();
	loadLogo();
	loadButtons();
}


function loadBackground() {
	let background = new Sprite(PIXI.loader.resources['starBg'].texture);
	app.gameArea.stage.addChild(background);
}

function loadStars() {
	app.gameArea.stage.removeChildren();
	for (var i = 0; i < 430; i++) {
		let star2;
		if (i % 2 === 0) {
			star2 = new Star(PIXI.loader.resources['resources/images/circle.png'].texture, 3);
		}
		else {
			star2 = new Star(PIXI.loader.resources['resources/images/circle.png'].texture, 20);
		}
		star2.position.set(app.randomNumber(1, 800), app.randomNumber(1, 600));
		star2.scale.set(0.01);
		app.gameArea.stage.addChild(star2);
		stars.push(star2);
	}
	run();
}

function animateMoon() {
	let frames: PIXI.Texture[] = new Array();
	for (let i = 1; i <= 48; i++) {
		let index = i < 10 ? '0' + i : i;

		frames.push(PIXI.Texture.fromFrame(index + '.png'));
	}
	let animation = new PIXI.extras.AnimatedSprite(frames);
	animation.scale.set(0.9);
	animation.animationSpeed = 48/60;
	animation.play();
	app.gameArea.stage.addChild(animation);
}

let stars: Star[] = new Array();

class Star extends PIXI.Sprite {
	constructor(texture, givenSpeed) {
		super(texture)
		this.speed = givenSpeed;
	}

	public speed: number;
}

let intervalId;

function run() {
	message.style = new PIXI.TextStyle({
	fill: 0xFFFFFF
	});
	message.position.set(10, 10);
	app.gameArea.stage.addChild(message);

	window.addEventListener('keydown', keyDownHandler);
	window.addEventListener('keyup', keyUpHandler);
	window.addEventListener('keypress', (e) => {
		if (e.keyCode === 32) {
			shoot();
		}
	});

	intervalId = setInterval(addEnemy, 2000);

	player = new Character(PIXI.loader.resources['images'].textures['spaceship.png']);
	player.position.set(75, app.gameArea.view.height / 2);
	player.velocityX = 0;
	player.velocityY = 0;
	app.gameArea.stage.addChild(player);

	app.gameArea.ticker.add(movement);
}

function movement(){
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
}

function addEnemy() {
	let enemy = new Character(PIXI.loader.resources['images'].textures['alien.png']);
	enemy.scale.set(0.15, 0.15);
	enemy.position.set(app.gameArea.view.width, app.randomNumber(enemy.height, 600 - enemy.height));
	enemies.push(enemy);
	app.gameArea.stage.addChild(enemy);
}

function detectCollision(player: Character, enemy: any): void {
	if (isCollision(player.getBounds(), enemy.getBounds())) {
		console.log('collision');
		console.log(doExplosion);
		
		if(doExplosion === true){
			explode(player, enemy, false); 
		}
	}
}

function displayGameOver() {
	let gameOver = new Sprite(PIXI.loader.resources['game-over'].texture);
	gameOver.anchor.set(0.5);
	gameOver.x = app.gameArea.view.width/2;
	gameOver.y = app.gameArea.view.height /2;
	app.gameArea.stage.addChild(gameOver);
	addBackToMenuBtn(gameOver);
}

function addBackToMenuBtn(gameOverSign: Sprite){
	let button = new Sprite(PIXI.loader.resources['button'].texture);
	button.anchor.set(0.5);
	button.scale.set(0.5);
	button.position.set(app.gameArea.view.width /2 , app.gameArea.view.height/2 + gameOverSign.height/2 + button.height);
	button.interactive = true;
	button.addListener('click', () =>{
		clearInterval(intervalId);
		missles = new Array();
		enemies = new Array();
		doExplosion = true;
		app.gameArea.stage.removeChildren();
		score = 0;
		message.text = 'Score: ' + score;
		initMenu();
	});
	let text = new PIXI.Text('Back');
	text.anchor.set(0.5);
	text.position.set(button.x, button.y);

	app.gameArea.stage.addChild(button,text);
}

function explode(object, enemy, isMissle: boolean) {
	if(isMissle === false){
		doExplosion = false;
	}
	let frames: PIXI.Texture[] = new Array();
	
	for (let i = 1; i <= 11; i++) {
		let index = i < 10 ? '0' + i : i;
		frames.push(PIXI.Texture.fromFrame('boom' + index + '.png'));
	}

	app.gameArea.stage.removeChild(object);
	app.gameArea.stage.removeChild(enemy);
	let anim = new PIXI.extras.AnimatedSprite(frames)
	anim.loop = false;
	anim.anchor.set(0.5);
	anim.animationSpeed = 11/60;
	anim.position.set(object.x + 100, object.y);
	anim.play();
	app.gameArea.stage.addChild(anim);
	
	if(isMissle === true){
		anim.onComplete = () => {
			app.gameArea.stage.removeChild(anim);
			drawParticles(enemy);
		}
	}
	else{
		anim.onComplete = () => {
			app.gameArea.stage.removeChild(anim);
			app.gameArea.ticker.remove(movement);
			displayGameOver();
		};
	}
}

function checkTargetHit(missle: Character, enemy: Character) {
	if (isCollide(missle.getBounds(), enemy.getBounds())) {
		explode(missle,enemy, true);
		
		enemies = enemies.filter(e => e !== enemy);
		app.gameArea.stage.removeChild(enemy);

		missles = missles.filter(m => m !== missle);
		app.gameArea.stage.removeChild(missle);

		score++;
		message.text = 'Score: ' + score;
	}
}

let particles: Sprite[] = new Array();

function drawParticles(object: Character) {
	let container = new PIXI.Container();

	for (let i = 0; i < object.height; i += 5) {
		for (let j = 0; j < object.width; j += 5) {
			let particle = new Sprite(PIXI.loader.resources['resources/images/circle.png'].texture);
			particle.position.set(j, i);
			particle.tint = 0xff0000;
			particle.scale.set(0.01);
			particles.push(particle);
			container.addChild(particle);
		}
	}

	/* let limit = 5;
	for(let i = 0; i < 9; i++){
		if(i < 2 || i > 5){
			limit = 2;
		}
		else{
			limit = 5;
		}
		for(let j = 0; j < limit; j--){
			let particle = new Sprite(PIXI.loader.resources['resources/images/circle.png'].texture);
			particle.position.set(i + 5, j - 5);
			particle.tint = 0xff0000;
			particle.scale.set(0.01);
			particles.push(particle);
			container.addChild(particle);
		}
	} */

	app.gameArea.stage.addChild(container);
	container.position.set(object.x, object.y);

	setTimeout(() => {
		for (let i = 1; i >= 0; i -= 0.1) {
			for (let j = 0; j < particles.length; j++) {
				particles[j].alpha = i;
			}
		}
		for (let i = 0; i < particles.length; i++) {

			particles = particles.filter(e => e !== particles[i]);
		}
		app.gameArea.stage.removeChild(container);
	}, 1200);
}

function animateParticles() {
	for (let i = 0; i < particles.length; i++) {
		let currentParticle: Sprite = particles[i];
		if (currentParticle.y > player.height / 2) {
			currentParticle.y += 3;

		} else {
			currentParticle.y -= 3;
		}
		currentParticle.alpha -= 0.1;
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
		return a.x + a.width / 2 >= b.x && a.x <= b.x + b.width && a.y + a.height >= b.y && a.y <= b.y + b.height;
	}
}

function shoot() {
	let missle = new Character(PIXI.loader.resources['images'].textures['missle.png']);
	missle.position.set(player.x + player.x / 2, player.y + player.height / 2);
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