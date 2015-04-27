///<reference path="types.ts" />
///<reference path="Utils.ts" />
///<reference path="Keyboard.ts" />
///<reference path="Timer.ts" />
///<reference path="Puzzle.ts" />
///<reference path="BoardDisplay.ts" />
///<reference path="MenuScreen.ts" />
///<reference path="SettingsScreen.ts" />
///<reference path="RulesScreen.ts" />
///<reference path="PlayingScreen.ts" />
///<reference path="WinsScreen.ts" />

interface IScreens {
    menu: MenuScreen;
    settings: SettingsScreen;
    rules: RulesScreen;
    playing: PlayingScreen;
    wins: WinsScreen;
}

class Game {
    private currentScreen: IScreen;
    boardSize: number = 4;
    countMoves: number;
    runningTime: number;
    screens: IScreens;

    constructor() {
        this.screens = {
            menu: new MenuScreen(this),
            settings: new SettingsScreen(this),
            rules: new RulesScreen(this),
            playing: new PlayingScreen(this),
            wins: new WinsScreen(this)
        };
        this.setScreen(this.screens.menu);
    }

    setScreen(screen: IScreen) {
        if (this.currentScreen) this.currentScreen.deactivate();

        this.currentScreen = screen;
        this.currentScreen.activate();
    }
}

new Game();