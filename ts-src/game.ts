import Application from './application';
import Character from './Character';
import { Sprite } from 'pixi.js';

/* class Game{
    startGame(){
      debugger;
      let app: Application = new Application('resources/images/player-enemy-atlas.json');
      document.getElementById('display').innerHTML = null;
      document.getElementById('display').appendChild(app.gameArea.view);
    }
}
*/
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

	/* PIXI.loader.add('resources/images/craft.png').load(setup); */

	PIXI.loader.add('images', 'resources/images/sprites.json').load(setup);

	function setup() {

		window.addEventListener('keydown', keyDownHandler);
		window.addEventListener('keyup', keyUpHandler);
		window.addEventListener('keypress', (e) => {
			if (e.keyCode === 32) {
				/* setTimeout(() => {
					shoot();
				}, 500); */
				shoot();
			}
		});

		/* foo = new Character(PIXI.loader.resources[app.resourcesPath].textures['player-ship.png']); */
		foo = new Character(PIXI.loader.resources['images'].textures['spaceship.png']);
		/* foo = new Character(PIXI.loader.resources['resources/images/craft.png'].texture); */
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

/* newGame.startGame(); */


/* var app: PIXI.Application;
let TextureCache = PIXI.utils.TextureCache;

  $('#start-button').on('click', () =>{
    /* $('#menu').html('<div style="font-size: 50px; color: black">Loading...38%</div>'); */

/*     $(document.body).html(app.view);
    PIXI.loader.add('player-enemy-atlas','resources/images/player-enemy-atlas.json').load(setup);
  })

let player: PIXI.Sprite;

function setup(){
    player = new PIXI.Sprite(PIXI.loader.resources['player-enemy-atlas'].textures['player-ship.png']);
    player.position.set(100,window.innerHeight/2);
    player.scale.set(0.2,0.2);
    player.anchor.set(0.5, 0.5);
    player.rotation = 1.58;
    app.stage.addChild(player);

    console.log(player.calculateVertices());


    let enemy = new PIXI.Sprite(PIXI.loader.resources['player-enemy-atlas'].textures['alien-enemy.png']);
    enemy.position.set(app.view.width - 110, app.view.height / 2);
    app.stage.addChild(enemy);

    app.ticker.add( () => {
      collisionCheck(player,enemy);
    })
    document.onkeydown = keyDownHandler;
}

function keyDownHandler(e: any): void{
  switch (e.keyCode) {
      case 37:
          if((player.x - 10) >= 0){
              player.x -= 10;
          }
          break;
      case 38:
          if((player.y - 10) >= 0){
            player.y -= 10;
          }
          break;
      case 39:
          if((player.x + 10) <= 800){
          player.x += 10;
          }
          break;
      case 40:
          if((player.y + 10) <= 600){
            player.y += 10;
          }
          break;
  }
}

function collisionCheck(object1: any, object2: any) {
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  hit = false;

  object1.centerX = object1.x + object1.width / 2;
  object1.centerY = object1.y + object1.height / 2;
  object2.centerX = object2.x + object2.width / 2;
  object2.centerY = object2.y + object2.height / 2;

  object1.halfWidth = object1.width / 2;
  object1.halfHeight = object1.height / 2;
  object2.halfWidth = object2.width / 2;
  object2.halfHeight = object2.height / 2;

  vx = object1.centerX - object2.centerX;
  vy = object1.centerY - object2.centerY;

  combinedHalfWidths = object1.halfWidth + object2.halfWidth;
  combinedHalfHeights = object1.halfHeight + object2.halfHeight;

  if (Math.abs(vx) < combinedHalfWidths) {
    if (Math.abs(vy) < combinedHalfHeights) {
      hit = true;
    } else {
      hit = false;
    }
  } else {
    hit = false;
  }

  if(hit === true){
    console.log('hit');
  }

  return hit;
};

/* class Application{
  startGame(): void{


  }  /* app:PIXI.Application;


  constructor() {
    let app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      transparent: false,
      resolution: 1
    });

    this.loadPlayer(app);
  }

  private loadPlayer(app:PIXI.Application): void{
    PIXI.loader.add("cat","resources/images/cat.png").load(this.setup());
  }

  setup(app:PIXI.Application): void{
    let cat = new PIXI.Sprite(PIXI.loader.resources["cat"].texture);
    if(this.app !== null){
      this.app.stage.addChild(cat);
      this.app.renderer.render(this.app.stage);
    }
  }

}
 */