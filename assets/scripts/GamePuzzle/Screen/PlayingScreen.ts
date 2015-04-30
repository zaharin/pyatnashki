module GamePuzzle.Screen {
    import Screen = GamePuzzle.Screen;
    import Puzzle = GamePuzzle.Puzzle.Puzzle;
    import Timer = GamePuzzle.Timer.Timer;
    import BoardDisplay = GamePuzzle.BoardDisplay.BoardDisplay;
    import Utils = GamePuzzle.Utils;

    enum PlayingState {
        RUNNING,
        FINISH,
        BREAK
    }

    export class PlayingScreen extends Screen.Screen {
        countMoves: number = 0;

        private puzzle: Puzzle;
        private timer: Timer;
        private boardDisplay: BoardDisplay;
        private refill: boolean = true;
        private state: PlayingState;

        private btnNewGameClickListener: (event: any) => any;
        private btnPauseClickListener: (event: any) => any;
        private btnMenuClickListener: (event: any) => any;

        private elementButtonNewGame: HTMLElement;
        private elementButtonPause: HTMLElement;
        private elementButtonMenu: HTMLElement;
        private elementElapsedTimeValue: HTMLElement;
        private elementCountMovesValue: HTMLElement;

        constructor() {
            super('game-playing');
            this.initElements();
            this.initListeners();
        }

        initElements() {
            this.elementButtonNewGame = <HTMLElement>this.element.querySelector('.btn-new-game');
            this.elementButtonPause = <HTMLElement>this.element.querySelector('.btn-pause');
            this.elementButtonMenu = <HTMLElement>this.element.querySelector('.btn-menu');
            this.elementElapsedTimeValue = <HTMLElement>this.element.querySelector('.elapsed-time span');
            this.elementCountMovesValue = <HTMLElement>this.element.querySelector('.count-moves span');

            this.timer = new Timer(100);
            this.puzzle = new Puzzle();
            this.boardDisplay = new BoardDisplay(this.puzzle);
        }

        initListeners() {
            var self = this;

            this.btnNewGameClickListener = btnNewGameClickListener;
            this.btnPauseClickListener = btnPauseClickListener;
            this.btnMenuClickListener = btnMenuClickListener;
            this.timer.onTimer = timerListener;
            this.puzzle.onMove = moveListener;

            function btnNewGameClickListener() {
                self.newGame();
            }

            function btnPauseClickListener() {
                self.hide(Screen.Status.STATUS_PAUSE);
            }

            function btnMenuClickListener() {
                self.breakGame();
                self.hide(Screen.Status.STATUS_HIDE);
            }

            function timerListener() {
                var time = self.state !== PlayingState.RUNNING ? 0 : self.timer.runningTime();
                self.elementElapsedTimeValue.innerHTML = Utils.timeToStr(time);
            }

            function moveListener() {
                self.countMoves++;
                self.update();
                self.puzzle.checkWin() && self.finishGame();
            }
        }

        activateListeners() {
            this.boardDisplay.activateListeners();
            this.elementButtonNewGame.addEventListener('click', this.btnNewGameClickListener);
            this.elementButtonPause.addEventListener('click', this.btnPauseClickListener);
            this.elementButtonMenu.addEventListener('click', this.btnMenuClickListener);
        }

        deactivateListeners() {
            this.boardDisplay.deactivateListeners();
            this.elementButtonNewGame.removeEventListener('click', this.btnNewGameClickListener);
            this.elementButtonPause.removeEventListener('click', this.btnPauseClickListener);
            this.elementButtonMenu.removeEventListener('click', this.btnMenuClickListener);
        }

        show() {
            super.show();
            this.refill && this.boardDisplay.fillBoard();
            this.refill = false;
        }

        hide(status: Screen.Status) {
            super.hide(status);
            this.deactivateListeners();
        }

        setBoardSize(value: number) {
            if (this.puzzle.getBoardSize() === value) return;

            this.puzzle.setBoardSize(value);
            this.refill = true;
        }

        newGame() {
            this.puzzle.shuffle();
            this.puzzle.checkWin() && this.puzzle.shuffle();

            this.countMoves = 0;
            this.timer.start();
            this.state = PlayingState.RUNNING;

            this.update(true);
        }

        finishGame() {
            this.state = PlayingState.FINISH;
            this.timer.stop();
            this.update(true);
            this.hide(Screen.Status.STATUS_FINISH_GAME);
        }

        breakGame() {
            this.state = PlayingState.BREAK;
            this.timer.stop();
            this.update(true);
        }

        resume() {
            this.timer.resume();
        }

        pause() {
            this.timer.suspend();
        }

        runningTime(): number {
            return this.timer.runningTime();
        }

        update(updateTimer: boolean = false) {
            updateTimer && this.timer.onTimer();
            var countMoves = this.state === PlayingState.RUNNING ? this.countMoves : 0;
            this.boardDisplay.update();
            this.elementCountMovesValue.innerHTML = countMoves.toString();
        }
    }
}