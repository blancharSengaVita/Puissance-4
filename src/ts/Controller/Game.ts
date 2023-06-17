import {Canvas} from "../framework-2023/Canvas";
import {settings} from "../settings";
import {Grid} from "../models/Grid";
import {Animate} from "../framework-2023/Animate";
import {GameStatus} from "../framework-2023/Types/GameStatus";

export class Game {
    private readonly canvas: Canvas;

    private readonly grid: Grid;
    private readonly animation: Animate;
    private readonly gameStatus: GameStatus;
    private readonly player: {turn:boolean};
    protected gameTied: {status : boolean};
    private readonly resetButton : HTMLElement;
    private readonly resetForm : HTMLElement;



    constructor() {
        this.resetButton = document.querySelector(settings.resetGame.button.selector);
        this.resetForm = document.querySelector(settings.resetGame.form.selector);
        this.gameStatus = {start: false};
        this.player = {turn: false};
        this.gameTied = {status : false};
        this.canvas = new Canvas(document.querySelector(settings.canvas.selector) as HTMLCanvasElement, {
            width: settings.dimensions.width,
            height: settings.dimensions.height
        });

        this.resetForm.insertAdjacentHTML('afterbegin', `<p class="reset__text">${settings.startGame.text}</p>`);
        this.resetButton.textContent = settings.startGame.button.text;

        this.grid = new Grid(this.canvas, this.gameStatus, this.player, this.gameTied, this.resetForm, this.resetButton);
        this.grid.draw();

        this.animation = new Animate(this.gameStatus);
        this.animation.registerForAnimation(this.grid);

        this.addEventListener();
    }

    private addEventListener() {
        this.player.turn = Math.random() > 0.5;

        this.resetForm.addEventListener('submit', (e)=>{
            e.preventDefault()
            this.grid.reset();
            this.resetForm.classList.add('hidden');
            this.gameStatus.start = true;
            this.grid.addEventListener();
            this.animation.start();
        });
    }
}