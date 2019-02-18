import * as PIXI from 'pixi.js';
import Application from "./application";
import Animation from './animation';

export default class Control {

    //enable keyboard control
    public static enable(app: PIXI.Application): void {
        window.onkeydown = (e: KeyboardEvent) => {
            Control.keyDownHandler(e, app);
        };

        window.onkeyup = (e: KeyboardEvent) => {
            Control.keyUpHandler(e);
        };
    }

    //disable keyboard control
    public static disable(): void {
        window.onkeydown = null;
        window.onkeyup = null;
    }

    private static keyUpHandler(e: KeyboardEvent): void {
        switch (e.key) {
            case ' ':
                Application.canShoot = true;
                break;
            case 'ArrowLeft':
                Application.player.velocityX = 0;
                break;
            case 'ArrowUp':
                Application.player.velocityY = 0;
                break;
            case 'ArrowRight':
                Application.player.velocityX = 0;
                break;
            case 'ArrowDown':
                Application.player.velocityY = 0;
                break;
        }
    }

    private static keyDownHandler(e: KeyboardEvent, app: PIXI.Application): void {
        let speed = 5;
        switch (e.key) {
            case ' ':
                //we use a flag to prevent user from shooting a lot of missles while holding down the spacebar
                if (Application.canShoot === true) {
                    Animation.missle(app);
                    Application.canShoot = false;
                }
                break;
            case 'ArrowLeft':
                Application.player.velocityX = -speed;
                break;
            case 'ArrowUp':
                Application.player.velocityY = -speed;
                break;
            case 'ArrowRight':
                Application.player.velocityX = speed;
                break;
            case 'ArrowDown':
                Application.player.velocityY = speed;
                break;
        }
    }
}