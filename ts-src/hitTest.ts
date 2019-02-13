import Character from "./Character";
import { Sprite } from "pixi.js";

export default class HitTest{
    public static betweenPlayerAndEnemy(player: any, enemy: any){
        player = player.getBounds();
        enemy = enemy.getBounds();
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

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
    }

    public static betweenMissleAndEnemy(missle: any, enemy: any){
        missle = missle.getBounds();
        enemy = enemy.getBounds();

        return missle.x + missle.width / 2 >= enemy.x && 
        missle.x <= enemy.x + enemy.width && missle.y + missle.height >= enemy.y 
        && missle.y <= enemy.y + enemy.height;
    }
}