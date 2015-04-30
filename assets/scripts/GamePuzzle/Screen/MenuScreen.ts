module GamePuzzle.Screen {
    import Screen = GamePuzzle.Screen;

    export class MenuScreen extends Screen.Screen {
        private elementButtonPlay: HTMLElement;
        private elementButtonSettings: HTMLElement;
        private elementButtonRules: HTMLElement;

        private btnPlayClickListener: (event: any) => any;
        private btnSettingsClickListener: (event: any) => any;
        private btnRulesClickListener: (event: any) => any;

        constructor() {
            super('game-menu');
            this.initElements();
            this.initListeners();
        }

        initElements() {
            this.elementButtonPlay = <HTMLElement>this.element.querySelector('.btn-play');
            this.elementButtonSettings = <HTMLElement>this.element.querySelector('.btn-settings');
            this.elementButtonRules = <HTMLElement>this.element.querySelector('.btn-rules');
        }

        initListeners() {
            var self = this;

            this.btnPlayClickListener = btnPlayClickListener;
            this.btnSettingsClickListener = btnSettingsClickListener;
            this.btnRulesClickListener = btnRulesClickListener;

            function btnPlayClickListener() {
                self.hide(Screen.Status.STATUS_PLAY);
            }

            function btnSettingsClickListener() {
                self.hide(Screen.Status.STATUS_SETTINGS);
            }

            function btnRulesClickListener() {
                self.hide(Screen.Status.STATUS_RULES);
            }
        }

        activateListeners() {
            this.elementButtonPlay.addEventListener('click', this.btnPlayClickListener);
            this.elementButtonSettings.addEventListener('click', this.btnSettingsClickListener);
            this.elementButtonRules.addEventListener('click', this.btnRulesClickListener);
        }

        deactivateListeners() {
            this.elementButtonPlay.removeEventListener('click', this.btnPlayClickListener);
            this.elementButtonSettings.removeEventListener('click', this.btnSettingsClickListener);
            this.elementButtonRules.removeEventListener('click', this.btnRulesClickListener);
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