import * as PIXI from 'pixi.js';
import Application from './application';
import GamePlay from './gamePlay';
import HitTest from './hitTest';

export default class Movement{

    public static enemySpeed: number = 0;
    public static doIncreaseSpeed: boolean = true;

    //stars every movement that exist in game
    public static start(app: PIXI.Application): void{
        if(Application.movementOn === true){

            this.backgroundMovement();
            this.playerMovement(app);
            this.enemyMovement(app);
            this.missleMovement(app);
            
        }
    }

    //parallax scrolling movement
    private static backgroundMovement(): void {
        for (let i = 0; i < GamePlay.parallaxImgs.length; i++) {

            GamePlay.parallaxImgs[i].tilePosition.x -= GamePlay.parallaxImgs[i].velocity;

        }
    }
    
    //moves the player according to the current velocities, that are given by key events
    private static  playerMovement(app: PIXI.Application): void {
        Application.player.x += Application.player.velocityX;
        Application.player.y += Application.player.velocityY;
    
        GamePlay.checkPosition(5, 4, app);
    }

    //displays the 'Speed up' message that appears when a certain amount of aliens have died
    private static displaySpeedUp(app: PIXI.Application): void {
        let text: PIXI.Text = new PIXI.Text('Speed up', {
            fontFamily: 'Arial',
            fontStyle: 'italic',
            fontSize: 40,
            dropShadow: true,	
            dropShadowColor: '#000000',	
            dropShadowAngle: 1,
            stroke: '#dd2222',	
            strokeThickness : 3,	
        });

        text.position.set(app.view.width/2, app.view.height/2);

        text.anchor.set(0.5);

        app.stage.addChild(text);

        setTimeout(() =>{
            app.ticker.add(function fadeOut(){
                text.alpha -= 0.03;
                if(text.alpha <= 0){
                    app.ticker.remove(fadeOut);
                    app.stage.removeChild(text);
                }
            });
        }, 500);
    }

    //moving the enemy by 4 initially, then for every 10 alien kill, the speed is increased by 150%
    private static  enemyMovement(app: PIXI.Application): void {
        if(Application.score % 10 === 0 && Application.score !== 0 && this.doIncreaseSpeed === true){
            
            this.displaySpeedUp(app);    
            
            this.enemySpeed = this.enemySpeed * 1.5;

            //flag is needed because otherwise due to the many calls coming from the ticker,
            //the game freezez 
            this.doIncreaseSpeed = false;
        }

        for (let i = Application.enemies.length - 1; i >= 0; i--) {
            let currentEnemy: PIXI.Sprite = Application.enemies[i];
    
            currentEnemy.x -= this.enemySpeed;
    
            //we check if the enemy has left the screen, if so remove it
            if (currentEnemy.x <= 0 - currentEnemy.width / 2) {
                Application.enemies = Application.enemies.filter(e => e !== currentEnemy);
                app.stage.removeChild(currentEnemy);
            }
            
            HitTest.detectCollision(Application.player, currentEnemy, app);
        }
    }
    
    //moves the missles
    private static  missleMovement(app: PIXI.Application): void {
        for (let i = Application.missles.length - 1; i >= 0; i--) {
            let currentMissle: PIXI.Sprite = Application.missles[i];
    
            currentMissle.x += 7;
    
            //If missle has left the screen, remove it
            if (currentMissle.x > app.view.width) {
                Application.missles = Application.missles.filter(m => m !== currentMissle);
                app.stage.removeChild(currentMissle);
            }
    
            //check to see if missle hit any of the enemies 
            for (let j = 0; j < Application.enemies.length; j++) {
                let currentEnemy: PIXI.Sprite = Application.enemies[j];
    
                if (currentMissle !== null && currentMissle !== undefined && currentEnemy !== null && currentEnemy !== undefined) {
                    GamePlay.checkTargetHit(currentMissle, currentEnemy, app);
                }
            }
        }
    }
}