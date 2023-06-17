import {Cell} from "./Cell";
import {Canvas} from "../framework-2023/Canvas";
import {Animatable} from "../framework-2023/Types/Animatable";
import {settings} from "../settings";
import {GameStatus} from "../framework-2023/Types/GameStatus";
// @ts-ignore
import {Position} from "../framework-2023/Types/Position";

export class Grid implements Animatable {
    private grid: Cell[][];
    private readonly canvas: Canvas;
    private readonly player: { turn: boolean };
    private readonly gameStatus: GameStatus;
    private readonly gameTied: { status: boolean };
    private readonly resetForm: HTMLElement;
    private readonly resetButton: HTMLElement;

    constructor(canvas: Canvas, gameStatus: GameStatus, player: { turn: boolean }, gameTied: { status: boolean }, resetForm: HTMLElement, resetButton: HTMLElement) {
        this.canvas = canvas;
        this.gameStatus = gameStatus;
        this.resetForm = resetForm;
        this.resetButton = resetButton;
        this.grid = [];
        this.player = player;
        this.gameTied = gameTied;

        this.createGrid();
    }

    clear(): void {

    }

    draw(): void {
        this.grid.forEach((row) => {
            row.forEach((cell) => {
                cell.draw();
            });
        });
    }

    update(): void {

    }

    createGrid(){
        for (let i = 0; i < settings.grid.numberOfRow; i++) {
            const row: Cell[] = [];
            this.grid.push(row)
            for (let j = 0; j < settings.grid.numberOfItemPerRow; j++) {
                row.push(new Cell(this.canvas, {
                    x: settings.grid.margin + settings.cells.radius + (settings.cells.radius * 2 * j) + (settings.grid.gap * j),
                    y: settings.grid.margin + settings.cells.radius + (settings.cells.radius * 2 * i) + (settings.grid.gap * i),
                }, i, j));
            }
        }
    }


    addEventListener() {
        //gere le hover d'une cellule
        // @ts-ignore
        document.querySelector(settings.canvas.selector).addEventListener('mousemove', (e: MouseEvent) => {
            this.highlightCell({x: e.offsetX, y: e.offsetY});
        });

        //gere le clic d'une cellule
        document.querySelector(settings.canvas.selector).addEventListener('click', () => {
            if (this.gameStatus.start === false) {
                return;
            }
            this.selectCell();
        });
    }

    private highlightCell({x, y}: Position) {
        let col: number;
        this.grid.forEach((row) => {
            row.forEach((cell) => {
                cell.highlight = null;
                if (cell.mouseOnCell({x, y})) {
                    col = cell.col;
                }
            });
        });

        for (let i = settings.grid.numberOfRow - 1; i >= 0; i--) {
            if (this.grid[i][col].owner === null) {
                this.grid[i][col].highlight = this.player.turn;
                return this.grid[i][col];
            }
        }
    }

    private selectCell() {
        let highlighting = false
        this.grid.forEach((row) => {
            row.forEach((cell) => {
                if (cell.highlight !== null) {
                    highlighting = true;
                    cell.highlight = null
                    cell.owner = this.player.turn;
                    if (this.checkWin(cell.row, cell.col)) {
                        this.gameStatus.start = false;
                    }
                    return;
                }
            });
        });

        if (this.gameStatus.start === true) {
            this.gameTied.status = true;
            OUTER : for (const row of this.grid) {
                for (const cell of row) {
                    if (cell.owner === null) {
                        this.gameTied.status = false;
                        break OUTER;
                    }
                }
            }

            if (this.gameTied.status) {
                this.gameStatus.start = false;
                document.querySelector(`${settings.resetGame.form.selector} p`).textContent = settings.gameTied.text;
                this.resetButton.textContent = settings.resetGame.button.text;
                this.resetForm.classList.remove('hidden');
            }
        }

        if (!highlighting) {
            return
        }

        if (this.gameStatus.start) {
            this.player.turn = !this.player.turn
        }
    }

    private checkWin(row: number, col: number) {
        let diagL = [], diagR = [], horiz = [], vert = [];

        for (let i = 0; i < settings.grid.numberOfRow; i++) {
            for (let j = 0; j < settings.grid.numberOfItemPerRow; j++) {
                //horizontal cells
                if (i == row) {
                    horiz.push(this.grid[i][j]);
                }
                //vertical cells
                if (j == col) {
                    vert.push(this.grid[i][j]);
                }
                //top left to bottom right
                if (i - j == row - col) {
                    diagL.push(this.grid[i][j]);
                }
                //top right to bottom right
                if (i + j == row + col) {
                    diagR.push(this.grid[i][j]);
                }
            }
        }
        return this.connect4(diagL) || this.connect4(diagR) || this.connect4(horiz) || this.connect4(vert);
    }

    connect4(cells: Cell[]) {
        let count = 0;
        let lastOwner = null;
        let winningCell: Cell[] = [];
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].owner === null) {
                count = 0;
                winningCell = [];
            } else if (cells[i].owner === lastOwner) {
                count++
                winningCell.push(cells[i]);
            } else {
                count = 1;
                winningCell = [];
                winningCell.push(cells[i]);
                lastOwner = cells[i].owner;
            }

            if (count === 4) {
                for (const cell of winningCell) {
                    cell.winner = true;
                    this.gameStatus.start = !this.gameStatus.start;
                    cell.draw();
                }

                document.querySelector(`${settings.resetGame.form.selector} p`).textContent = this.player.turn ? settings.player.text.win : settings.computer.text.win;
                this.resetButton.textContent = settings.resetGame.button.text;
                this.resetForm.classList.remove('hidden');
                return true
            }
        }
        return false;
    }

    reset() {
        this.grid = [];
        this.createGrid()
    }
}