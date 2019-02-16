import Application from './application';

export default class Sounds{
    private static gameOverSound: HTMLAudioElement;
    private static menuSound: HTMLAudioElement;
    private static missleSound: HTMLAudioElement;
    private static explosionSound: HTMLAudioElement;
    private static backgroundSound: HTMLAudioElement;
    private static engineSound: HTMLAudioElement;

    public static playEngineSound(){
        this.engineSound = new Audio('resources/sounds/engine_sound.mp3');
        this.engineSound.volume = 0.05;
        this.engineSound.play();
    }

    public static playMissleSound(){
        this.missleSound = new Audio('resources/sounds/missle_shoot.mp3');
        this.missleSound.volume = 0.2;
        this.missleSound.play();
    }

    public static playExplosionSound(volumeLevel: number){
        this.explosionSound = new Audio('resources/sounds/explosion.mp3');
        this.explosionSound.volume = volumeLevel;
        this.explosionSound.play();
    }

    public static playSounds(){
        switch (Application.state) {
            case 'menu':
                this.menuSound = new Audio('resources/sounds/menu_background.mp3');;
                this.menuSound.play();

                this.menuSound.onended = () =>{
                    this.menuSound.play();
                }
                break;
            case 'play': 
                this.backgroundSound = new Audio('resources/sounds/background-music.mp3');
                this.backgroundSound.volume = 0.2;
                this.backgroundSound.play();

                this.backgroundSound.onended = () =>{
                    this.backgroundSound.play();
                }
                break;
            case 'gameOver':
                this.gameOverSound = new Audio('resources/sounds/game_over.mp3');
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