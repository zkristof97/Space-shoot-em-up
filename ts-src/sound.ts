import Application from './application';

export default class Sounds{
    private static gameOverSound: HTMLAudioElement;
    private static menuSound: HTMLAudioElement;
    private static missleSound: HTMLAudioElement;
    private static explosionSound: HTMLAudioElement;
    private static backgroundSound: HTMLAudioElement;
    private static engineSound: HTMLAudioElement;

    public static playEngineSound(){
        if(Application.state !== 'pause'){
            this.engineSound = new Audio(PIXI.loader.resources['engineSound'].url);
            this.engineSound.volume = 0.05;
            this.engineSound.play();
        }
    }

    public static playMissleSound(){
        if(Application.state !== 'pause'){
            this.missleSound = new Audio(PIXI.loader.resources['missleSound'].url);
            this.missleSound.volume = 0.2;
            this.missleSound.play();
        }   
    }

    public static playExplosionSound(volumeLevel: number){
        this.explosionSound = new Audio(PIXI.loader.resources['explosionSound'].url);
        this.explosionSound.volume = volumeLevel;
        this.explosionSound.play();
    }

    public static playSounds(){
        switch (Application.state) {
            case 'menu':
                this.menuSound = new Audio(PIXI.loader.resources['menuSound'].url);
                this.menuSound.volume = 0.5;
                this.menuSound.play();

                this.menuSound.onended = () =>{
                    this.menuSound.play();
                }
                break;
            case 'play': 
                this.backgroundSound = new Audio(PIXI.loader.resources['backgroundSound'].url);
                this.backgroundSound.volume = 0.2;
                this.backgroundSound.play();

                this.backgroundSound.onended = () =>{
                    this.backgroundSound.play();
                }
                break;
            case 'gameOver':
                this.gameOverSound = new Audio(PIXI.loader.resources['gameOverSound'].url);
                this.gameOverSound.volume = 0.2;
                this.gameOverSound.play();
                break;
        }
    }

    public static stopSounds(){
        switch (Application.state) {
            case 'menu':
                if(this.backgroundSound !== undefined && this.backgroundSound !== null){
                    this.backgroundSound.pause();
                }
                if(this.gameOverSound !== undefined && this.gameOverSound !== null){
                    this.gameOverSound.pause();
                }
                break;
            case 'play':
                if(this.menuSound !== undefined && this.menuSound !== null){
                    this.menuSound.pause();
                }
                if(this.gameOverSound !== undefined && this.gameOverSound !== null){
                    this.gameOverSound.pause();
                }
            break;
            case 'stop':
                if(this.backgroundSound !== undefined && this.backgroundSound !== null){
                    this.backgroundSound.pause();
                }
        }
    }
}