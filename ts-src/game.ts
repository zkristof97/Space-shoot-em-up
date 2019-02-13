import Star from "./star";
import Application from "./application";
import Movement from "./movement";

export class Game {
    private stars: Array<Star>;
    private score: number = 0;

    public start(app: PIXI.Application): void {
        app.stage.removeChildren();
        this.loadBackground(app);
        this.displayScore(app);
    }

    private loadBackground(app: PIXI.Application): void {
        this.stars = new Array();
        for (var i = 0; i < 430; i++) {
            let star;
            if (i % 2 === 0) {
                star = new Star(PIXI.loader.resources['resources/images/circle.png'].texture, 3);
            }
            else {
                star = new Star(PIXI.loader.resources['resources/images/circle.png'].texture, 20);
            }
            star.position.set(Application.randomNumber(1, 800), Application.randomNumber(1, 600));
            star.scale.set(0.01);
            app.stage.addChild(star);
            this.stars.push(star);
        }
    }

    private displayScore(app: PIXI.Application): void{
        let message: PIXI.Text = 
            new PIXI.Text('Score: ' + this.score, { fill: 0xFFFFFF });
        message.position.set(10, 10);
        app.stage.addChild(message);
    }
}