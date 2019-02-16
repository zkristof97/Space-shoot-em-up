

import GamePlay from "./gamePlay";
import Application from "./application";
import HitTest from "./hitTest";

export default class Movement{

    public static start(app: PIXI.Application){
        this.playerMovement();
        this.enemyMovement(app);
        this.missleMovement(app);
    }

    private static playerMovement() {
        Application.player.x += Application.player.velocityX;
        Application.player.y += Application.player.velocityY;
    }

    private static enemyMovement(app: PIXI.Application) {
        for (let i = Application.enemies.length - 1; i >= 0; i--) {
            let currentEnemy = Application.enemies[i];
            currentEnemy.x -= 4;
    
            HitTest.detectCollision(Application.player, currentEnemy, app);
    
            if (currentEnemy.x <= 0 - currentEnemy.width / 2) {
                Application.enemies = Application.enemies.filter(e => e !== currentEnemy);
                app.stage.removeChild(currentEnemy);
            }
        }
    }

    private static missleMovement(app: PIXI.Application) {
        for (let i = Application.missles.length - 1; i >= 0; i--) {
            let currentMissle: PIXI.Sprite = Application.missles[i];
            currentMissle.x += 10;
    
            if (currentMissle.x > app.view.width) {
                Application.missles = Application.missles.filter(m => m !== currentMissle);
            }
        }
    
        for (let j = 0; j < Application.missles.length; j++) {
            for (let k = 0; k < Application.enemies.length; k++) {
                if (Application.missles[j] !== null && Application.missles[j] !== undefined && Application.enemies[k] !== null && Application.enemies[k] !== undefined) {
                    GamePlay.checkTargetHit(Application.missles[j], Application.enemies[k], app);
                }
            }
        }
    }
}