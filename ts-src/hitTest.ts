import * as PIXI from 'pixi.js';
import Character from "./Character";
import Animation from "./animation";

export default class HitTest{

    private static isCollision(player: any, enemy: any): boolean {

        let hit: boolean, combinedHalfWidths: number, combinedHalfHeights: number, vx: number, vy: number;
    
        hit = false;
    
        player.centerX = player.x + player.width / 2;
        player.centerY = player.y + player.height / 4;

        enemy.centerX = enemy.x + enemy.width / 2;
        enemy.centerY = enemy.y + enemy.height / 2;
    
        player.halfWidth = player.width / 2;
        player.halfHeight = player.height / 4;

        enemy.halfWidth = enemy.width / 2;
        enemy.halfHeight = enemy.height / 2;
    
        vx = player.centerX - enemy.centerX;
        vy = player.centerY - enemy.centerY;
    
        combinedHalfWidths = player.halfWidth + enemy.halfWidth;
        combinedHalfHeights = player.halfHeight + enemy.halfHeight;
    
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

    public static isCollide(missle: PIXI.Rectangle, enemy: PIXI.Rectangle): boolean {
        return missle.x + missle.width / 6 >= enemy.x && missle.x <= enemy.x + enemy.width && missle.y + missle.height >= enemy.y && missle.y <= enemy.y + enemy.height;
    }

    public static detectCollision(player: Character, enemy: PIXI.Sprite, app:PIXI.Application): void {
        if (this.isCollision(player.getBounds(), enemy.getBounds())) {

            app.stage.removeChild(player);
            app.stage.removeChild(enemy);

            Animation.explode(player, app);
        }
    }
}