import { Sprite } from "pixi.js";

export class Menu{

    buttons: Array<Sprite>;

    public init(app:PIXI.Application) {
        this.loadBackground(app);
        this.loadLogo(app);
        this.loadButtons(app);
    }

    private loadLogo(app:PIXI.Application) {
        let logo = new PIXI.Sprite(PIXI.loader.resources['logo'].texture);
        logo.position.set(app.view.width - 225, app.view.height / 2 - 125 );
        logo.scale.set(0.5);
        app.stage.addChild(logo);
    }

    private loadButtons(app:PIXI.Application) {
        this.buttons = new Array();
        for (let i = 0; i < 4; i++) {
            let button: Sprite = new Sprite(PIXI.loader.resources['button'].texture);
            button.anchor.set(0.5);
            button.scale.set(0.5);
            button.position.set(app.view.width - button.width + 50, app.view.height / 2 + (i * 60))
            this.buttons.push(button);
            button.interactive = true;
            if (i === 3) {
                button.addListener('click', () => {
                    window.location.replace('https://www.google.com/');
                });
            }
            else {
                /* button.addListener('click', loadStars); */
            }
    
            button.addListener('mouseover', () => {
                console.log('over');
    
            });
            button.addListener('mouseout', () => {
                console.log('out');
    
            });
            app.stage.addChild(button);
        }
        this.btnText(app);
    }

    private btnText(app: PIXI.Application) {
        let i = 0;
        for (i; i < 4; i++) {
            let text: PIXI.Text;
            if (i === 3) {
                text = new PIXI.Text('EXIT');
            }
            else {
                text = new PIXI.Text('GAME' + (i + 1));
            }
            text.anchor.set(0.5);
            text.position.set(this.buttons[i].x, this.buttons[i].y);
            app.stage.addChild(text);
        }
    }

    private loadBackground(app: PIXI.Application) {
        let background = new Sprite(PIXI.loader.resources['starBg'].texture);
        app.stage.addChild(background);
        this.animateMoon(app);
    }

    private animateMoon(app: PIXI.Application) {
        let frames: PIXI.Texture[] = new Array();
        for (let i = 1; i <= 48; i++) {
            let index = i < 10 ? '0' + i : i;
    
            frames.push(PIXI.Texture.fromFrame(index + '.png'));
        }
        let animation = new PIXI.extras.AnimatedSprite(frames);
        animation.scale.set(0.9);
        animation.animationSpeed = 10 / 60;
        animation.play();
        app.stage.addChild(animation);
    }
}