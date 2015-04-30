module GamePuzzle.Screen {
    export enum Status {
        STATUS_DEFAULT  = 0,
        STATUS_APPLY    = 1,
        STATUS_HIDE     = 2,
        STATUS_SETTINGS = 3,
        STATUS_RULES    = 4,
        STATUS_PLAY     = 5,
        STATUS_PAUSE    = 6,
        STATUS_NEW_GAME    = 7,
        STATUS_FINISH_GAME = 8
    }

    export interface IScreen {
        show: (activateListeners: boolean) => void;
        hide: (status: Status) => void;
        onShow: () => void;
        onHide: (status: Screen.Status) => void;
    }

    export class Screen implements IScreen {
        element: HTMLElement;

        onShow: () => void;
        onHide: (status: Status) => void;

        constructor(elementId: string) {
            this.element = document.getElementById(elementId);
        }

        show() {
            this.element.style.display = 'block';
            this.onShow && this.onShow();
        }

        hide(status: Status = Status.STATUS_DEFAULT) {
            this.element.style.display = 'none';
            this.onHide && this.onHide(status);
        }
    }
}
