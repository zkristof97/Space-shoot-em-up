import Star from "./star";
import Application from "./application";
import Movement from "./movement";

export class Game {
    

    public start(app: PIXI.Application): void {
        app.stage.removeChildren();
        this.loadBackground(app);
        this.displayScore(app);
    }

    
}