module GamePuzzle.Screen {
    import Screen = GamePuzzle.Screen;

    export class RulesScreen extends Screen.Screen {
        private elementButtonClose: HTMLElement;

        private btnCloseClickListener: (event:any) => any;

        constructor() {
            super('game-rules');
            this.initElements();
            this.initListeners();
        }

        initElements() {
            this.elementButtonClose = <HTMLElement>this.element.querySelector('.btn-close');
        }

        initListeners() {
            var self = this;

            this.btnCloseClickListener = btnCloseClickListener;

            function btnCloseClickListener() {
                self.hide(Screen.Status.STATUS_HIDE);
            }
        }

        activateListeners() {
            this.elementButtonClose.addEventListener('click', this.btnCloseClickListener);
        }

        deactivateListeners() {
            this.elementButtonClose.removeEventListener('click', this.btnCloseClickListener);
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