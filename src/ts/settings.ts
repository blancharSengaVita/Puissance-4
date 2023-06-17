export const settings = {
    cells: {
        color: 'mintcream',
        radius: 40,
    },
    grid: {
        numberOfRow: 6,
        numberOfItemPerRow: 7,
        gap: 20,
        margin: 10,
    },
    canvas: {
        selector: "#canvas",
    },
    dimensions: {
        height: 600,
        width: 700,
    },
    player: {
        color: 'yellow',
        text: {
            win: 'Jaune a gagné',
        }
    },
    computer: {
        color: 'red',
        text: {
            win: 'Rouge a gagné'
        }
    },
    gameTied: {
        text: 'Match nul',
    },
    startGame: {
        text: 'Appuyer sur start pour commencer',
        button: {
            text: 'Start',
        }
    },
    resetGame: {
        form: {
            selector: ".game__container--reset",
        },
        button: {
            selector: '.actions-container__reset-button',
            text: 'Reset',
        },
        paragraph : {
            selector : '.reset__text',
        }
    },
}