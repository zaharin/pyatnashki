module GamePuzzle.Screen {
    import Screen = GamePuzzle.Screen;

    interface IBoardSizeDataset extends DOMStringMap {
        boardSize: string;
    }

    export class SettingsScreen extends Screen.Screen {
        private elementButtonClose: HTMLElement;
        private elementButtonsBoardSize: NodeList;
        private elementButtonSave: HTMLElement;

        private btnCloseClickListener: (event:any) => any;
        private btnSaveClickListener: (event:any) => any;
        private btnBoardSizeClickListener: (event:any) => any;

        boardSize: number;

        constructor() {
            super('game-settings');
            this.initElements();
            this.initListeners();
        }

        initElements() {
            this.elementButtonClose = <HTMLElement>this.element.querySelector('.btn-close');
            this.elementButtonSave = <HTMLElement>this.element.querySelector('.btn-save');
            this.elementButtonsBoardSize = this.element.querySelectorAll('.btn-board-size');
        }

        initListeners() {
            var self = this;

            this.btnCloseClickListener = btnCloseClickListener;
            this.btnSaveClickListener = btnSaveClickListener;
            this.btnBoardSizeClickListener = btnBoardSizeClickListener;

            function btnCloseClickListener() {
                self.hide(Screen.Status.STATUS_HIDE);
            }

            function btnSaveClickListener() {
                self.hide(Screen.Status.STATUS_APPLY);
            }

            function btnBoardSizeClickListener(event:Event) {
                var target = <HTMLElement>event.target;
                self.boardSize = parseInt((<IBoardSizeDataset>target.dataset).boardSize, 10);
                Array.prototype.forEach.call(self.elementButtonsBoardSize, function (element:HTMLElement) {
                    element.classList.remove('active');
                });
                target.classList.add('active');
            }
        }

        activateListeners() {
            this.elementButtonClose.addEventListener('click', this.btnCloseClickListener);
            this.elementButtonSave.addEventListener('click', this.btnSaveClickListener);
            Array.prototype.forEach.call(this.elementButtonsBoardSize, (element:HTMLElement) => {
                var dataBoardSize = parseInt((<IBoardSizeDataset>element.dataset).boardSize, 10);
                if (dataBoardSize === this.boardSize) {
                    element.classList.add('active');
                } else {
                    element.classList.remove('active');
                }

                element.addEventListener('click', this.btnBoardSizeClickListener);
            });
        }

        deactivateListeners() {
            this.elementButtonClose.removeEventListener('click', this.btnCloseClickListener);
            this.elementButtonSave.removeEventListener('click', this.btnSaveClickListener);
            Array.prototype.forEach.call(this.elementButtonsBoardSize, (element:HTMLElement) => {
                element.removeEventListener('click', this.btnBoardSizeClickListener);
            });
        }

        show() {
            super.show();
            this.activateListeners();
        }

        hide(status: Screen.Status) {
            super.hide(status);
            this.deactivateListeners();
        }
    }
}