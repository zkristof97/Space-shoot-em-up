import Application from './application';
import Character from './Character';

let score: number = 0;
let missles: Character[] = new Array();
let enemies: Character[] = new Array();
let foo: Character;
let missle: Character;
let app: Application = new Application('resources/images/player-enemy-atlas.json');


let a: HTMLCollectionOf<Element> = document.getElementsByClassName('start-button');

let message = new PIXI.Text('Score: 0');
message.style = new PIXI.TextStyle({
	fill: 0xFFFFFF
});
message.position.set(10,10);
app.gameArea.stage.addChild(message);

for (let i = 0; i < a.length; i++) {
	a[i].addEventListener('click', test);
}

function test() {
	document.getElementById('display').innerHTML = null;
	document.getElementById('display').appendChild(app.gameArea.view);

	PIXI.loader.add('images', 'resources/images/sprites.json').load(setup);

	function setup() {

		window.addEventListener('keydown', keyDownHandler);
		window.addEventListener('keyup', keyUpHandler);
		window.addEventListener('keypress', (e) => {
			if (e.keyCode === 32) {
				shoot();
			}
		});

		foo = new Character(PIXI.loader.resources['images'].textures['spaceship.png']);
		foo.position.set(75, app.gameArea.view.height/2);

		foo.anchor.set(0.5);
		foo.hitArea = new PIXI.Rectangle(foo.x, foo.y, 75, 75);
		foo.velocityX = 0;
		foo.velocityY = 0;
		app.gameArea.stage.addChild(foo);

		setInterval(() => {
			addEnemies();
		}, 2000);

		app.gameArea.ticker.add(() => {
			foo.x += foo.velocityX;
			foo.y += foo.velocityY;

			for (let i = enemies.length - 1; i >= 0; i--) {
				enemies[i].x -= 4;
				enemies[i].y += app.randomNumber(-2,2);

				detectCollision(foo, enemies[i]);
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


function detectCollision(rect1, rect2) {
	if (isCollide(rect1, rect2)) {
		console.log('collision');
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
	missle.position.set(foo.x, foo.y);
	missles.push(missle);
}


function keyDownHandler(e: any): void {
	switch (e.keyCode) {
		case 37:
			foo.velocityX = -5;
			break;
		case 38:
			foo.velocityY = -5;
			break;
		case 39:
			foo.velocityX = 5;
			break;
		case 40:
			foo.velocityY = 5;
			break;
	}
}

function keyUpHandler(e: any): void {
	switch (e.keyCode) {
		case 37:
			foo.velocityX = 0;
			break;
		case 38:
			foo.velocityY = 0;
			break;
		case 39:
			foo.velocityX = 0;
			break;
		case 40:
			foo.velocityY = 0;
			break;
	}
}