class RulesScreen implements IScreen {
    private elementGameRules: HTMLElement;
    private elementButtonClose: HTMLElement;

    private btnCloseClickListener: (event: any) => any;

    constructor(private game: Game) {
        this.initElements();
        this.initListeners();
    }

    private initElements() {
        this.elementGameRules = document.getElementById('game-rules');
        this.elementButtonClose = <HTMLElement>this.elementGameRules.querySelector('.btn-close');
    }

    private initListeners() {
        var self = this;

        this.btnCloseClickListener = btnPlayClickListener;

        function btnPlayClickListener() {
            self.game.setScreen(self.game.screens.menu);
        }
    }

    activate() {
        this.elementGameRules.style.display = 'block';
        this.elementButtonClose.addEventListener('click', this.btnCloseClickListener);
    }

    deactivate() {
        this.elementGameRules.style.display = 'none';
        this.elementButtonClose.removeEventListener('click', this.btnCloseClickListener);
    }
}