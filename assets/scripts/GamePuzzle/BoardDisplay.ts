module GamePuzzle.BoardDisplay {
    import Utils = GamePuzzle.Utils;
    import Puzzle = GamePuzzle.Puzzle.Puzzle;

    export class BoardDisplay {
        private _spacing:number = -1;
        private _sidePiece:number = -1;

        private elementBoardInner:HTMLElement;
        private elementsPiece:HTMLElement[] = [];

        private clickListener:(event:any) => any;
        private keydownListener:(event:any) => any;

        constructor(private puzzle: Puzzle) {
            this.initElements();
            this.initListeners();
        }

        private initElements() {
            this.elementBoardInner = document.getElementById('board-inner');
        }

        private initListeners() {
            var self = this;

            this.keydownListener = keydownListener;
            this.clickListener = clickListener;

            function keydownListener(event:KeyboardEvent) {
                var key = event.keyCode;
                if (key < Keyboard.Key.KEY_LEFT || key > Keyboard.Key.KEY_DOWN) return;

                var newEmptyPos = self.puzzle.getEmptyPosition();
                switch (key) {
                    case Keyboard.Key.KEY_UP:
                        newEmptyPos[1] += 1;
                        break;
                    case Keyboard.Key.KEY_DOWN:
                        newEmptyPos[1] += -1;
                        break;
                    case Keyboard.Key.KEY_RIGHT:
                        newEmptyPos[0] += -1;
                        break;
                    case Keyboard.Key.KEY_LEFT:
                        newEmptyPos[0] += 1;
                        break;
                }

                self.puzzle.move(newEmptyPos);
            }

            function clickListener(event:MouseEvent) {
                var clientRect = this.getBoundingClientRect();
                var cursorX = event.clientX - clientRect.left;
                var cursorY = event.clientY - clientRect.top;

                var sidePiece = self.getSidePiece();
                var spacing = self.getSpacing();

                var posX = Math.floor((cursorX - Math.floor(cursorX / sidePiece) * spacing + spacing) / sidePiece);
                var posY = Math.floor((cursorY - Math.floor(cursorY / sidePiece) * spacing + spacing) / sidePiece);

                self.puzzle.move(<IPosition>[posX, posY]);
            }
        }

        activateListeners() {
            document.addEventListener('keydown', this.keydownListener);
            this.elementBoardInner.addEventListener('click', this.clickListener);
        }

        deactivateListeners() {
            document.removeEventListener('keydown', this.keydownListener);
            this.elementBoardInner.removeEventListener('click', this.clickListener);
        }

        getSidePiece():number {
            return (this.elementBoardInner.clientWidth - this.getSpacing() * (this.puzzle.getBoardSize() + 1)) / this.puzzle.getBoardSize();
        }

        getSpacing():number {
            if (this._spacing === -1) this._spacing = Utils.getSpacing();
            return this._spacing;
        }

        fillBoard() {
            this.clearBoard();

            var sidePiece = this.getSidePiece();
            var length = this.puzzle.getBoardSize() * this.puzzle.getBoardSize();
            for (var i = 0; i < length; i++) {
                var elementPiece = Utils.createPiece(sidePiece);
                elementPiece.id = 'piece-' + i;
                (<HTMLElement>elementPiece.childNodes.item(0)).innerHTML = i.toString();
                this.elementBoardInner.appendChild(elementPiece);
                this.elementsPiece.push(elementPiece);
            }
        }

        clearBoard() {
            if (!this.elementsPiece.length) return;

            this._sidePiece = -1;
            this._spacing = -1;
            this.elementsPiece.forEach((value) => this.elementBoardInner.removeChild(value));
            this.elementsPiece = [];
        }

        update() {
            var sidePiece = this.getSidePiece();
            var spacing = this.getSpacing();

            this.puzzle.board.forEach((piece, index) => {
                var position = this.puzzle.getPosition(index);
                var elementPiece = this.elementsPiece[piece];
                elementPiece.style.left = (sidePiece + spacing) * position[0] + spacing + 'px';
                elementPiece.style.top = (sidePiece + spacing) * position[1] + spacing + 'px';
            });
        }
    }
}