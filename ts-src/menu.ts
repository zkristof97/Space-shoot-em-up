import Application from './application';
import Animation from './animation';

export default class Menu {

    public static backgroundMusic: HTMLAudioElement;
    public buttons: Array<PIXI.Sprite>;

    public init(app: PIXI.Application): void {
        app.stage.removeChildren();
        this.loadBackground(app);
        this.loadLogo(app);
        this.loadButtons(app);
        Animation.alienSpawn(app);
    }

    private loadLogo(app: PIXI.Application): void {
        let logo = new PIXI.Sprite(PIXI.loader.resources['logo-new'].texture);
        logo.position.set(445,110);
        logo.scale.set(0.45);
        app.stage.addChild(logo);
    }

    private loadButtons(app: PIXI.Application): void {
        this.buttons = new Array();
        for (let i = 0; i < 4; i++) {
            let button: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources['button'].texture);
            button.anchor.set(0.5);
            button.scale.set(0.5);
            button.position.set(app.view.width - button.width * 1.18, app.view.height / 2  + (i * 60))
            this.buttons.push(button);
            button.interactive = true;
            app.stage.addChild(button);
            if(i === 3){
                button.addListener('click', () =>{
                    Application.state = 'exit';
                });
            }else{
                button.addListener('click', () => {
                    Application.state = 'play';
                });
            }
        }
        
        this.addBtnText(app);
    }

    private addBtnText(app: PIXI.Application): void {
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

    private loadBackground(app: PIXI.Application): void {
        /* let background = new PIXI.Sprite(PIXI.loader.resources['starBg'].texture); */
        let background = new PIXI.Sprite(PIXI.loader.resources['cosmos'].texture);
        background.width = 800;
        background.height = 600;
        app.stage.addChild(background);
        Animation.moon(app);
    }
}