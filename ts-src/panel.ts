import { Sprite } from "pixi.js";

export default class Panel {

    private shouldPause: boolean = true;
    private panel: Sprite;
    private panelButtons: Array<Sprite>;

    public addPauseBtn(app: PIXI.Application): void {
        let pauseBtn = new Sprite(PIXI.loader.resources['pauseBtn'].texture);
        pauseBtn.anchor.set(1, 1);
        pauseBtn.scale.set(0.1);
        pauseBtn.tint = 0xFFFFFF;
        pauseBtn.position.set(app.view.width - 15, app.view.height - 15);
        pauseBtn.interactive = true;
        pauseBtn.addListener('click', ()=>{
            this.pauseOnClick(app)
        });
        app.stage.addChild(pauseBtn);
    }

    private pauseOnClick(app: PIXI.Application): void {
        if(this.shouldPause === true){
			this.shouldPause = false;
			/* app.ticker.remove(movement); */
			this.showPanel(true, app);
		}
		else{
			/* resumeGame(); */
		}
    }
 

private showPanel(shouldShow: boolean, app: PIXI.Application){
    this.panelButtons = new Array();
	if(shouldShow === true){
		this.panel = new Sprite(PIXI.loader.resources['panel'].texture);
		this.panel.anchor.set(0.5);
		this.panel.position.set(app.view.width/2,app.view.height/2);
		app.stage.addChild(this.panel);
		this.addPanelBtns(app);
	}
	else{
		this.shouldPause = true;
		app.stage.removeChild(this.panel);

		for(let i = 0; i < this.panelButtons.length; i++){
			let currentButton = this.panelButtons[i];
			this.panelButtons = this.panelButtons.filter(p => p !== currentButton);
			app.stage.removeChild(currentButton);
		}

		if(this.panelButtons.length === 1){
			app.stage.removeChild(this.panelButtons[0]);
			this.panelButtons.pop();
		}

	}
}

    private addPanelBtns(app: PIXI.Application){
        let stopBtn = new Sprite(PIXI.loader.resources['stopBtn'].texture);
        stopBtn.scale.set(0.8);	
        stopBtn.setParent(this.panel);
        stopBtn.position.set(stopBtn.parent.x - stopBtn.parent.width /2 + 100, stopBtn.parent.y);
        stopBtn.anchor.set(0.5);
        stopBtn.interactive = true;
        /* stopBtn.addListener('click', backToMenu); */
    
        let playBtn = new Sprite(PIXI.loader.resources['playBtn'].texture);
        playBtn.scale.set(0.4);	
        playBtn.setParent(this.panel);
        playBtn.position.set(playBtn.parent.x, playBtn.parent.y);
        playBtn.anchor.set(0.5);
        playBtn.interactive = true;
        /* playBtn.addListener('click', resumeGame); */
    
        let replayBtn = new Sprite(PIXI.loader.resources['replayBtn'].texture);
        replayBtn.scale.set(0.32);	
        replayBtn.setParent(this.panel);
        replayBtn.position.set(replayBtn.parent.x + replayBtn.width * 1.5, replayBtn.parent.y);
        replayBtn.anchor.set(0.5);
        replayBtn.interactive = true;
        replayBtn.addListener('click', () =>{
            console.log('click');
            
        });
        
        this.panelButtons.push(replayBtn, playBtn, stopBtn);
        app.stage.addChild(replayBtn, playBtn, stopBtn);
    }

    private pauseGame(): void{

    }
}