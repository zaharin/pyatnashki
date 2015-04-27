interface IBoardSizeDataset extends DOMStringMap {
    boardSize: string;
}

class SettingsScreen implements IScreen {
    private elementGameSettings: HTMLElement;
    private elementButtonClose: HTMLElement;
    private elementButtonsBoardSize: NodeList;
    private elementButtonSave: HTMLElement;

    private btnCloseClickListener: (event: any) => any;
    private btnSaveClickListener: (event: any) => any;
    private btnBoardSizeClickListener: (event: any) => any;

    private boardSize: number;

    constructor(private game: Game) {
        this.boardSize = game.boardSize;
        this.initElements();
        this.initListeners();
    }

    private initElements() {
        this.elementGameSettings = document.getElementById('game-settings');
        this.elementButtonClose = <HTMLElement>this.elementGameSettings.querySelector('.btn-close');
        this.elementButtonSave = <HTMLElement>this.elementGameSettings.querySelector('.btn-save');
        this.elementButtonsBoardSize = this.elementGameSettings.querySelectorAll('.btn-board-size');
    }

    private initListeners() {
        var self = this;

        this.btnCloseClickListener = btnCloseClickListener;
        this.btnSaveClickListener = btnSaveClickListener;
        this.btnBoardSizeClickListener = btnBoardSizeClickListener;

        function btnCloseClickListener() {
            self.game.setScreen(self.game.screens.menu);
        }

        function btnSaveClickListener() {
            self.game.boardSize = self.boardSize;
            self.game.setScreen(self.game.screens.menu);
        }

        function btnBoardSizeClickListener(event: Event) {
            var target = <HTMLElement>event.target;
            self.boardSize = parseInt((<IBoardSizeDataset>target.dataset).boardSize, 10);
            Array.prototype.forEach.call(self.elementButtonsBoardSize, function(element: HTMLElement) {
                element.classList.remove('active');
            });
            target.classList.add('active');
        }
    }

    activate() {
        this.elementGameSettings.style.display = 'block';
        this.elementButtonClose.addEventListener('click', this.btnCloseClickListener);
        this.elementButtonSave.addEventListener('click', this.btnSaveClickListener);
        Array.prototype.forEach.call(this.elementButtonsBoardSize, (element: HTMLElement) => {
            var dataBoardSize = parseInt((<IBoardSizeDataset>element.dataset).boardSize, 10);
            if (dataBoardSize === this.boardSize) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }

            element.addEventListener('click', this.btnBoardSizeClickListener);
        });
    }

    deactivate() {
        this.elementGameSettings.style.display = 'none';
        this.elementButtonClose.removeEventListener('click', this.btnCloseClickListener);
        this.elementButtonSave.removeEventListener('click', this.btnSaveClickListener);
        Array.prototype.forEach.call(this.elementButtonsBoardSize, (element: HTMLElement) => {
            element.removeEventListener('click', this.btnBoardSizeClickListener);
        });
    }
}