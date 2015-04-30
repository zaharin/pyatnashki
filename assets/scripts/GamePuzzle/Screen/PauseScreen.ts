module GamePuzzle.Screen {
    import Screen = GamePuzzle.Screen;

    export class PauseScreen extends Screen.Screen {
        private elementClickListener: (event: any) => any;

        constructor() {
            super('game-pause');
            this.initElements();
            this.initListeners();
        }

        initElements() {}

        initListeners() {
            var self = this;

            this.elementClickListener = elementClickListener;

            function elementClickListener() {
                self.hide(Screen.Status.STATUS_HIDE);
            }
        }

        activateListeners() {
            this.element.addEventListener('click', this.elementClickListener);
        }

        deactivateListeners() {
            this.element.removeEventListener('click', this.elementClickListener);
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