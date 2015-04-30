module GamePuzzle.Screen {
    import Screen = GamePuzzle.Screen;
    import Utils = GamePuzzle.Utils;

    export class WinsScreen extends Screen.Screen {
        private elementButtonPlay: HTMLElement;
        private elementButtonMenu: HTMLElement;
        private elementCountMovesValue: HTMLElement;
        private elementRunningTimeValue: HTMLElement;

        private btnPlayClickListener: (event: any) => any;
        private btnMenuClickListener: (event: any) => any;

        countMoves: number;
        runningTime: number;

        constructor() {
            super('game-wins');
            this.initElements();
            this.initListeners();
        }

        initElements() {
            this.elementButtonPlay = <HTMLElement>this.element.querySelector('.btn-play');
            this.elementButtonMenu = <HTMLElement>this.element.querySelector('.btn-menu');
            this.elementCountMovesValue = <HTMLElement>this.element.querySelector('.count-moves span.value');
            this.elementRunningTimeValue = <HTMLElement>this.element.querySelector('.running-time span.value');
        }

        initListeners() {
            var self = this;

            this.btnPlayClickListener = btnPlayClickListener;
            this.btnMenuClickListener = btnMenuClickListener;

            function btnPlayClickListener() {
                self.hide(Screen.Status.STATUS_PLAY);
            }

            function btnMenuClickListener() {
                self.hide(Screen.Status.STATUS_HIDE);
            }
        }

        activateListeners() {
            this.elementButtonPlay.addEventListener('click', this.btnPlayClickListener);
            this.elementButtonMenu.addEventListener('click', this.btnMenuClickListener);

            this.elementCountMovesValue.innerHTML = this.countMoves.toString();
            this.elementRunningTimeValue.innerHTML = Utils.timeToStr(this.runningTime);
        }

        deactivateListeners() {
            this.elementButtonPlay.removeEventListener('click', this.btnPlayClickListener);
            this.elementButtonMenu.removeEventListener('click', this.btnMenuClickListener);
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