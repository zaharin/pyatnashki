class MenuScreen implements IScreen {
    private elementGameMenu: HTMLElement;
    private elementButtonPlay: HTMLElement;
    private elementButtonSettings: HTMLElement;
    private elementButtonRules: HTMLElement;

    private btnPlayClickListener: (event: any) => any;
    private btnSettingsClickListener: (event: any) => any;
    private btnRulesClickListener: (event: any) => any;

    constructor(private game: Game) {
        this.initElements();
        this.initListeners();
    }

    private initElements() {
        this.elementGameMenu = document.getElementById('game-menu');
        this.elementButtonPlay = <HTMLElement>this.elementGameMenu.querySelector('.btn-play');
        this.elementButtonSettings = <HTMLElement>this.elementGameMenu.querySelector('.btn-settings');
        this.elementButtonRules = <HTMLElement>this.elementGameMenu.querySelector('.btn-rules');
    }

    private initListeners() {
        var self = this;

        this.btnPlayClickListener = btnPlayClickListener;
        this.btnSettingsClickListener = btnSettingsClickListener;
        this.btnRulesClickListener = btnRulesClickListener;

        function btnPlayClickListener() {
            self.game.setScreen(self.game.screens.playing);
        }

        function btnSettingsClickListener() {
            self.game.setScreen(self.game.screens.settings);
        }

        function btnRulesClickListener() {
            self.game.setScreen(self.game.screens.rules);
        }
    }

    activate() {
        this.elementGameMenu.style.display = 'block';
        this.elementButtonPlay.addEventListener('click', this.btnPlayClickListener);
        this.elementButtonSettings.addEventListener('click', this.btnSettingsClickListener);
        this.elementButtonRules.addEventListener('click', this.btnRulesClickListener);
    }

    deactivate() {
        this.elementGameMenu.style.display = 'none';
        this.elementButtonPlay.removeEventListener('click', this.btnPlayClickListener);
        this.elementButtonSettings.removeEventListener('click', this.btnSettingsClickListener);
        this.elementButtonRules.removeEventListener('click', this.btnRulesClickListener);
    }
}
