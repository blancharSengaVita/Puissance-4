import {Circle} from "../framework-2023/shapes/Circle";
import {Canvas} from "../framework-2023/Canvas";
import {settings} from "../settings";
// @ts-ignore
import {Position} from "../framework-2023/Types/Position";

export class Cell extends Circle {
    public owner: boolean;
    public highlight: boolean;
    private readonly left: number;
    private readonly right: number;
    private readonly bot: number;
    private readonly top: number;
    public winner: boolean;
    readonly row: number;
    readonly col: number;
    constructor(canvas: Canvas, position: Position, row:number, col:number) {
        super({
            canvas: canvas,
            color: undefined,
            position: position,
            radius: settings.cells.radius,
        });
        this.owner = null;
        this.highlight = null;
        this.winner = false;
        this.left = this.position.x - settings.cells.radius - (settings.grid.gap / 2) ;
        this.right = this.position.x + settings.cells.radius + (settings.grid.gap / 2) ;
        this.top = this.position.y  - settings.cells.radius - (settings.grid.gap / 2);
        this.bot = this.position.y  + settings.cells.radius + (settings.grid.gap / 2);
        this.col = col;
        this.row = row;

    }

     mouseOnCell ({x, y}:Position) {
        return x >= this.left && x <= this.right && y >= this.top && y <= this.bot;
    }

    draw() {
        this.color = this.owner == null ? settings.cells.color : this.owner ? settings.player.color : settings.computer.color

        this.ctx.beginPath();
        this.ctx.fillStyle = this.owner === null ? settings.cells.color : this.owner ? settings.player.color : settings.computer.color;
        this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();



        if (this.winner  || this.highlight !== null) {
            this.color = this.winner ? 'orange': this.highlight ? settings.player.color : settings.computer.color;

            this.ctx.lineWidth = settings.cells.radius/1.5 ;
            this.ctx.strokeStyle = this.color
            this.ctx.beginPath();
            this.ctx.arc(this.position.x, this.position.y, settings.cells.radius/ 4, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

}