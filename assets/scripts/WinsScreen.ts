class WinsScreen implements IScreen {
    private elementGameWins: HTMLElement;
    private elementButtonPlay: HTMLElement;
    private elementButtonMenu: HTMLElement;
    private elementCountMovesValue: HTMLElement;
    private elementRunningTimeValue: HTMLElement;

    private btnPlayClickListener: (event: any) => any;
    private btnMenuClickListener: (event: any) => any;

    constructor(private game: Game) {
        this.initElements();
        this.initListeners();
    }

    private initElements() {
        this.elementGameWins = document.getElementById('game-wins');
        this.elementButtonPlay = <HTMLElement>this.elementGameWins.querySelector('.btn-play');
        this.elementButtonMenu = <HTMLElement>this.elementGameWins.querySelector('.btn-menu');
        this.elementCountMovesValue = <HTMLElement>this.elementGameWins.querySelector('.count-moves span.value');
        this.elementRunningTimeValue = <HTMLElement>this.elementGameWins.querySelector('.running-time span.value');
    }

    private initListeners() {
        var self = this;

        this.btnPlayClickListener = btnPlayClickListener;
        this.btnMenuClickListener = btnMenuClickListener;

        function btnPlayClickListener() {
            self.game.setScreen(self.game.screens.playing);
        }

        function btnMenuClickListener() {
            self.game.setScreen(self.game.screens.menu);
        }
    }

    activate() {
        this.elementGameWins.style.display = 'block';
        this.elementButtonPlay.addEventListener('click', this.btnPlayClickListener);
        this.elementButtonMenu.addEventListener('click', this.btnMenuClickListener);

        this.elementCountMovesValue.innerHTML = this.game.countMoves.toString();
        this.elementRunningTimeValue.innerHTML = timeToStr(this.game.runningTime);
    }

    deactivate() {
        this.elementButtonPlay.removeEventListener('click', this.btnPlayClickListener);
        this.elementButtonMenu.removeEventListener('click', this.btnMenuClickListener);
        this.elementGameWins.style.display = 'none';
    }
}
