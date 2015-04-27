enum PlayingState {
    NONE,
    PLAYING,
    PAUSE,
    FINISH,
    STOP
}

class PlayingScreen implements IScreen {
    private puzzle: Puzzle;
    private state: PlayingState = PlayingState.NONE;
    private countMoves: number;
    private startTime: number;
    private finishTime: number;
    private timer: Timer;
    private boardDisplay: BoardDisplay;

    private btnNewGameClickListener: (event: any) => any;
    private btnPauseClickListener: (event: any) => any;
    private btnMenuClickListener: (event: any) => any;
    private overlayClickListener: (event: any) => any;

    private elementGamePlaying: HTMLElement;
    private elementButtonNewGame: HTMLElement;
    private elementButtonPause: HTMLElement;
    private elementButtonMenu: HTMLElement;
    private elementOverlayPause: HTMLElement;
    private elementElapsedTimeValue: HTMLElement;
    private elementCountMovesValue: HTMLElement;

    constructor(private game: Game) {
        this.initElements();
        this.initListeners();
    }

    private initElements() {
        this.elementGamePlaying = document.getElementById('game-playing');
        this.elementButtonNewGame = <HTMLElement>this.elementGamePlaying.querySelector('.btn-new-game');
        this.elementButtonPause = <HTMLElement>this.elementGamePlaying.querySelector('.btn-pause');
        this.elementButtonMenu = <HTMLElement>this.elementGamePlaying.querySelector('.btn-menu');
        this.elementOverlayPause = document.getElementById('overlay-pause');
        this.elementElapsedTimeValue = <HTMLElement>this.elementGamePlaying.querySelector('.elapsed-time span');
        this.elementCountMovesValue = <HTMLElement>this.elementGamePlaying.querySelector('.count-moves span');

        this.timer = new Timer(100);
        this.puzzle = new Puzzle(this.game.boardSize);
        this.boardDisplay = new BoardDisplay(this.puzzle);
    }

    private initListeners() {
        var self = this;

        this.btnNewGameClickListener = btnNewGameClickListener;
        this.btnPauseClickListener = btnPauseClickListener;
        this.btnMenuClickListener = btnMenuClickListener;
        this.overlayClickListener = overlayClickListener;
        this.timer.onTimer = timerListener;
        this.puzzle.onMove = moveListener;

        function btnNewGameClickListener() {
            self.newGame();
        }

        function btnPauseClickListener() {
            self.setState(PlayingState.PAUSE);
        }

        function btnMenuClickListener() {
            self.setState(PlayingState.STOP);
        }

        function overlayClickListener() {
            self.setState(PlayingState.PLAYING);
        }

        function timerListener() {
            self.elementElapsedTimeValue.innerHTML = timeToStr(new Date().getTime() - self.startTime);
        }

        function moveListener() {
            self.countMoves++;
            self.update();
            if (self.puzzle.checkWin()) {
                self.finishGame();
            }
        }
    }

    private setState(state: PlayingState) {
        if (this.state === state) return;

        this.state = state;
        this.changeState();
    }

    private changeState() {
        switch (this.state) {
            case PlayingState.PLAYING:
                this.playingState();
                break;
            case PlayingState.PAUSE:
                this.pauseState();
                break;
            case PlayingState.FINISH:
                this.finishState();
                break;
            case PlayingState.STOP:
                this.stopState();
                break;
        }
    }

    private playingState() {
        this.elementOverlayPause.style.display = 'none';
        this.elementOverlayPause.removeEventListener('click', this.overlayClickListener);
        this.startTime += this.timer.start();
        this.activateListeners();
    }

    private pauseState() {
        this.elementOverlayPause.style.display = 'block';
        this.elementOverlayPause.addEventListener('click', this.overlayClickListener);
        this.timer.stop();
        this.deactivateListeners();
    }

    private finishState() {
        this.finishTime = new Date().getTime();
        this.timer.stop();
        this.deactivateListeners();
        this.game.countMoves = this.countMoves;
        this.game.runningTime = this.finishTime - this.startTime;
        this.game.setScreen(this.game.screens.wins);
    }

    private stopState() {
        this.timer.stop();
        this.deactivateListeners();
        this.game.setScreen(this.game.screens.menu);
    }

    private activateListeners() {
        this.boardDisplay.activateListeners();
        this.elementButtonNewGame.addEventListener('click', this.btnNewGameClickListener);
        this.elementButtonPause.addEventListener('click', this.btnPauseClickListener);
        this.elementButtonMenu.addEventListener('click', this.btnMenuClickListener);
    }

    private deactivateListeners() {
        this.boardDisplay.deactivateListeners();
        this.elementButtonNewGame.removeEventListener('click', this.btnNewGameClickListener);
        this.elementButtonPause.removeEventListener('click', this.btnPauseClickListener);
        this.elementButtonMenu.removeEventListener('click', this.btnMenuClickListener);
    }

    activate() {
        this.elementGamePlaying.style.display = 'block';
        this.puzzle.setBoardSize(this.game.boardSize);
        this.boardDisplay.fillBoard();
        this.boardDisplay.update();
        setTimeout(() => this.newGame(), 400);
    }

    deactivate() {
        this.timer.stop();
        this.deactivateListeners();
        this.boardDisplay.clearBoard();
        this.elementGamePlaying.style.display = 'none';
    }

    private newGame() {
        this.puzzle.shuffle();
        if (this.puzzle.checkWin()) this.puzzle.shuffle();

        this.startTime = new Date().getTime();
        this.countMoves = 0;

        this.timer.onTimer();
        this.update();
        this.setState(PlayingState.PLAYING);
    }

    private finishGame() {
        this.setState(PlayingState.FINISH);
    }

    private update() {
        this.boardDisplay.update();
        this.elementCountMovesValue.innerHTML = this.countMoves.toString();
    }
}