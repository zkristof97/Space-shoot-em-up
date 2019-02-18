import * as PIXI from 'pixi.js';
import Application from './application';
import GamePlay from './gamePlay';
import HitTest from './hitTest';

export default class Movement{

    public static start(app: PIXI.Application){
        if(Application.movementOn === true){
            this.backgroundMovement();
            this.playerMovement(app);
            this.enemyMovement(app);
            this.missleMovement(app);
        }
    }

    private static backgroundMovement(): void {
        //parallax scrolling
        for (let i = 0; i < GamePlay.parallaxImgs.length; i++) {
            GamePlay.parallaxImgs[i].tilePosition.x -= GamePlay.parallaxImgs[i].velocity;
        }
    }
    
    private static  playerMovement(app: PIXI.Application): void {
        Application.player.x += Application.player.velocityX;
        Application.player.y += Application.player.velocityY;
    
        //we check if the player is inside the bounds, e.g. did not leave the screen
        GamePlay.checkPosition(5, 4, app);
    }
    
    private static  enemyMovement(app: PIXI.Application): void {
        for (let i = Application.enemies.length - 1; i >= 0; i--) {
            let currentEnemy: PIXI.Sprite = Application.enemies[i];
    
            currentEnemy.x -= 4;
    
            //we check if the enemy has left the screen, if so remove it
            if (currentEnemy.x <= 0 - currentEnemy.width / 2) {
                Application.enemies = Application.enemies.filter(e => e !== currentEnemy);
                app.stage.removeChild(currentEnemy);
            }
            
            HitTest.detectCollision(Application.player, currentEnemy, app);
        }
    }
    
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