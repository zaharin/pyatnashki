class Puzzle {
    private _boardSize: number;
    private _winSequence: IBoard;

    board: IBoard;
    onMove: () => void;

    constructor(boardSize = 4) {
        this.setBoardSize(boardSize);
    }

    getBoardSize(): number {
        return this._boardSize;
    }

    setBoardSize(value: number) {
        this._boardSize = value;
        this._winSequence = this.genWinSequence();
        this.board = <IBoard>this._winSequence.slice(0);
    }

    genWinSequence(): IBoard {
        var lastIndex = this._boardSize * this._boardSize - 1;
        var result = new Array(lastIndex + 1);

        for (var index = 0; index < lastIndex; index++) {
            result[index] = index + 1;
        }

        result[lastIndex] = 0;
        return <IBoard>result;
    }

    shuffle(stepCount = 500) {
        this.board = <IBoard>this._winSequence.slice(0);

        for (var i = 0; i < stepCount; i++) {
            var newEmptyPos = this.getEmptyPosition();
            var randomDir = random(4);

            switch (randomDir) {
                case 0: //up
                    newEmptyPos[1] += -1;
                    break;
                case 1: //down
                    newEmptyPos[1] += 1;
                    break;
                case 2: //right
                    newEmptyPos[0] += -1;
                    break;
                case 3: //left
                    newEmptyPos[0] += 1;
                    break;
            }

            this._move(newEmptyPos);
        }
    }

    validMove(position: IPosition): boolean {
        var posX = position[0];
        var posY = position[1];

        if ((posX < 0 || posX >= this._boardSize) || (posY < 0 || posY >= this._boardSize)) return false;

        var emptyPos = this.getEmptyPosition();
        var diffX = emptyPos[0] - posX;
        var diffY = emptyPos[1] - posY;

        return (diffX !== 0 && diffY === 0) || (diffX === 0 && diffY !== 0);
    }

    private _move(position: IPosition): boolean {
        if (!this.validMove(position)) return false;

        var emptyPos = this.getEmptyPosition();

        var diffX = position[0] - emptyPos[0];
        var diffY = position[1] - emptyPos[1];

        if (diffX > 0 && diffY === 0) {
            // right
            stepIncX = 1;
            stepIncY = 0;
        } else if (diffX < 0 && diffY === 0) {
            // left
            stepIncX = -1;
            stepIncY = 0;

        } else if (diffX === 0 && diffY < 0) {
            // up
            stepIncX = 0;
            stepIncY = -1;
        } else if (diffX === 0 && diffY > 0) {
            // down
            stepIncX = 0;
            stepIncY = 1;
        }

        var stepIncX;
        var stepIncY;
        var countSteps = Math.max(Math.abs(diffX), Math.abs(diffY));
        var stepPos = <IPosition>[emptyPos[0], emptyPos[1]];

        for (var step = 0; step < countSteps; step++) {
            stepPos[0] += stepIncX;
            stepPos[1] += stepIncY;
            this.swap(this.getIndex(emptyPos), this.getIndex(stepPos));
            emptyPos[0] = stepPos[0];
            emptyPos[1] = stepPos[1];
        }

        return true;
    }

    move(position: IPosition): boolean {
        if (!this._move(position)) return false;

        this.doMove();

        return true;
    }

    doMove() {
        if (this.onMove) this.onMove();
    }

    checkWin(): boolean {
        return this.board.every((value, index) => value === this._winSequence[index] );
    }

    getEmptyIndex(): number {
        return this.board.indexOf(0);
    }

    getEmptyPosition(): IPosition {
        return this.getPosition(this.getEmptyIndex());
    }

    getPosition(index: number): IPosition {
        return <IPosition>[index % this._boardSize, Math.floor(index / this._boardSize)];
    }

    getIndex(position: IPosition) {
        return position[1] * this._boardSize + position[0];
    }

    swap(indexA, indexB) {
        var array = this.board;
        var valueA = array[indexA];
        array[indexA] = array[indexB];
        array[indexB] = valueA;
    }
}