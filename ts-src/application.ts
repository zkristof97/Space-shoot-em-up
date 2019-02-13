export default class Application{
    public static randomNumber(min, max): number{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static state: string = '';
    public static doExplode: boolean = false;
}