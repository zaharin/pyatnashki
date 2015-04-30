module GamePuzzle {
    import Screen = GamePuzzle.Screen;

    interface IScreens {
        menu    : Screen.MenuScreen;
        settings: Screen.SettingsScreen;
        rules   : Screen.RulesScreen;
        playing : Screen.PlayingScreen;
        wins    : Screen.WinsScreen;
        pause   : Screen.PauseScreen;
    }

    export class Game {
        boardSize: number = 4;
        screens: IScreens;

        constructor() {
            this.screens = {
                menu    : new Screen.MenuScreen(),
                settings: new Screen.SettingsScreen(),
                rules   : new Screen.RulesScreen(),
                playing : new Screen.PlayingScreen(),
                wins    : new Screen.WinsScreen(),
                pause   : new Screen.PauseScreen()
            };

            this.screens.menu.onHide = this.onMenuScreenHide.bind(this);
            this.screens.menu.onHide = this.onMenuScreenHide.bind(this);
            this.screens.settings.onHide = this.onSettingsScreenHide.bind(this);
            this.screens.rules.onHide = this.onRulesScreenHide.bind(this);
            this.screens.playing.onHide = this.onPlayingScreenHide.bind(this);
            this.screens.wins.onHide = this.onWinsScreenHide.bind(this);
            this.screens.pause.onHide = this.onPauseScreenHide.bind(this);
        }

        private newGame() {
            this.screens.playing.setBoardSize(this.boardSize);
            this.screens.playing.show();
            this.screens.playing.update();
            setTimeout(() => {
                this.screens.playing.newGame();
                this.screens.playing.activateListeners();
            }, 400);
        }

        private onMenuScreenHide(status: Screen.Status) {
            switch (status) {
                case Screen.Status.STATUS_RULES:
                    this.screens.rules.show();
                    break;
                case Screen.Status.STATUS_SETTINGS:
                    this.screens.settings.boardSize = this.boardSize;
                    this.screens.settings.show();
                    break;
                default:
                    this.newGame();
            }
        }

        private onSettingsScreenHide(status: Screen.Status) {
            if (status === Screen.Status.STATUS_APPLY) {
                this.boardSize = this.screens.settings.boardSize;
            }
            this.screens.menu.show();
        }

        private onRulesScreenHide() {
            this.screens.menu.show();
        }

        private onPlayingScreenHide(status: Screen.Status) {
            switch (status) {
                case Screen.Status.STATUS_PAUSE:
                    this.screens.playing.pause();
                    this.screens.pause.show();
                    break;
                case Screen.Status.STATUS_FINISH_GAME:
                    this.screens.wins.countMoves = this.screens.playing.countMoves;
                    this.screens.wins.runningTime = this.screens.playing.runningTime();
                    this.screens.wins.show();
                    break;
                default:
                    this.screens.menu.show();
            }
        }

        private onWinsScreenHide(status: Screen.Status) {
            if (status === Screen.Status.STATUS_PLAY) {
                this.newGame();
                return;
            }
            this.screens.menu.show();
        }

        private onPauseScreenHide() {
            this.screens.playing.resume();
            this.screens.playing.show();
            this.screens.playing.activateListeners();
        }

        run() {
            this.screens.menu.show();
        }
    }
}