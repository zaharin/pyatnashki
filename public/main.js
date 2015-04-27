function random(max) {
    return Math.floor(Math.random() * max);
}
function getSpacing() {
    var elementTmp = document.createElement('div');
    elementTmp.className = 'standard-spacing';
    document.body.appendChild(elementTmp);
    var spacing = elementTmp.clientWidth;
    document.body.removeChild(elementTmp);
    return spacing;
}
function createPiece(side) {
    var elementPiece = document.createElement('div');
    elementPiece.className = 'piece';
    elementPiece.style.width = side + 'px';
    elementPiece.style.height = side + 'px';
    var elementPieceInner = document.createElement('span');
    elementPieceInner.style.fontSize = side * .5 + 'px';
    elementPieceInner.style.lineHeight = side + 'px';
    elementPiece.appendChild(elementPieceInner);
    return elementPiece;
}
function timeToStr(time) {
    var timeSec = time / 1000;
    var timeMin = Math.floor(timeSec / 60);
    timeSec = Math.floor(timeSec - timeMin * 60);
    if (timeMin < 10)
        timeMin = '0' + timeMin;
    if (timeSec < 10)
        timeSec = '0' + timeSec;
    return timeMin + ':' + timeSec;
}
var Keyboard;
(function (Keyboard) {
    (function (Key) {
        Key[Key["KEY_LEFT"] = 37] = "KEY_LEFT";
        Key[Key["KEY_UP"] = 38] = "KEY_UP";
        Key[Key["KEY_RIGHT"] = 39] = "KEY_RIGHT";
        Key[Key["KEY_DOWN"] = 40] = "KEY_DOWN";
    })(Keyboard.Key || (Keyboard.Key = {}));
    var Key = Keyboard.Key;
})(Keyboard || (Keyboard = {}));
var Timer = (function () {
    function Timer(delay) {
        if (delay === void 0) { delay = 1000; }
        this.delay = delay;
        this.timerId = 0;
        this.runningStartTime = 0;
        this.idleStartTime = 0;
    }
    Timer.prototype.start = function () {
        if (this.running())
            this.stop();
        this.timerId = setInterval(this.doTimer.bind(this), this.delay);
        this.runningStartTime = new Date().getTime();
        return this.idleStartTime ? this.runningStartTime - this.idleStartTime : 0;
    };
    Timer.prototype.stop = function () {
        if (!this.running())
            return this.idleStartTime = 0;
        clearInterval(this.timerId);
        this.timerId = 0;
        this.idleStartTime = new Date().getTime();
        return this.runningStartTime ? this.idleStartTime - this.runningStartTime : 0;
    };
    Timer.prototype.doTimer = function () {
        if (this.onTimer)
            this.onTimer();
    };
    Timer.prototype.running = function () {
        return this.timerId !== 0;
    };
    return Timer;
})();
var Puzzle = (function () {
    function Puzzle(boardSize) {
        if (boardSize === void 0) { boardSize = 4; }
        this.setBoardSize(boardSize);
    }
    Puzzle.prototype.getBoardSize = function () {
        return this._boardSize;
    };
    Puzzle.prototype.setBoardSize = function (value) {
        this._boardSize = value;
        this._winSequence = this.genWinSequence();
        this.board = this._winSequence.slice(0);
    };
    Puzzle.prototype.genWinSequence = function () {
        var lastIndex = this._boardSize * this._boardSize - 1;
        var result = new Array(lastIndex + 1);
        for (var index = 0; index < lastIndex; index++) {
            result[index] = index + 1;
        }
        result[lastIndex] = 0;
        return result;
    };
    Puzzle.prototype.shuffle = function (stepCount) {
        if (stepCount === void 0) { stepCount = 500; }
        this.board = this._winSequence.slice(0);
        for (var i = 0; i < stepCount; i++) {
            var newEmptyPos = this.getEmptyPosition();
            var randomDir = random(4);
            switch (randomDir) {
                case 0:
                    newEmptyPos[1] += -1;
                    break;
                case 1:
                    newEmptyPos[1] += 1;
                    break;
                case 2:
                    newEmptyPos[0] += -1;
                    break;
                case 3:
                    newEmptyPos[0] += 1;
                    break;
            }
            this._move(newEmptyPos);
        }
    };
    Puzzle.prototype.validMove = function (position) {
        var posX = position[0];
        var posY = position[1];
        if ((posX < 0 || posX >= this._boardSize) || (posY < 0 || posY >= this._boardSize))
            return false;
        var emptyPos = this.getEmptyPosition();
        var diffX = emptyPos[0] - posX;
        var diffY = emptyPos[1] - posY;
        return (diffX !== 0 && diffY === 0) || (diffX === 0 && diffY !== 0);
    };
    Puzzle.prototype._move = function (position) {
        if (!this.validMove(position))
            return false;
        var emptyPos = this.getEmptyPosition();
        var diffX = position[0] - emptyPos[0];
        var diffY = position[1] - emptyPos[1];
        if (diffX > 0 && diffY === 0) {
            // right
            stepIncX = 1;
            stepIncY = 0;
        }
        else if (diffX < 0 && diffY === 0) {
            // left
            stepIncX = -1;
            stepIncY = 0;
        }
        else if (diffX === 0 && diffY < 0) {
            // up
            stepIncX = 0;
            stepIncY = -1;
        }
        else if (diffX === 0 && diffY > 0) {
            // down
            stepIncX = 0;
            stepIncY = 1;
        }
        var stepIncX;
        var stepIncY;
        var countSteps = Math.max(Math.abs(diffX), Math.abs(diffY));
        var stepPos = [emptyPos[0], emptyPos[1]];
        for (var step = 0; step < countSteps; step++) {
            stepPos[0] += stepIncX;
            stepPos[1] += stepIncY;
            this.swap(this.getIndex(emptyPos), this.getIndex(stepPos));
            emptyPos[0] = stepPos[0];
            emptyPos[1] = stepPos[1];
        }
        return true;
    };
    Puzzle.prototype.move = function (position) {
        if (!this._move(position))
            return false;
        this.doMove();
        return true;
    };
    Puzzle.prototype.doMove = function () {
        if (this.onMove)
            this.onMove();
    };
    Puzzle.prototype.checkWin = function () {
        var _this = this;
        return this.board.every(function (value, index) { return value === _this._winSequence[index]; });
    };
    Puzzle.prototype.getEmptyIndex = function () {
        return this.board.indexOf(0);
    };
    Puzzle.prototype.getEmptyPosition = function () {
        return this.getPosition(this.getEmptyIndex());
    };
    Puzzle.prototype.getPosition = function (index) {
        return [index % this._boardSize, Math.floor(index / this._boardSize)];
    };
    Puzzle.prototype.getIndex = function (position) {
        return position[1] * this._boardSize + position[0];
    };
    Puzzle.prototype.swap = function (indexA, indexB) {
        var array = this.board;
        var valueA = array[indexA];
        array[indexA] = array[indexB];
        array[indexB] = valueA;
    };
    return Puzzle;
})();
var BoardDisplay = (function () {
    function BoardDisplay(puzzle) {
        this.puzzle = puzzle;
        this._spacing = -1;
        this._sidePiece = -1;
        this.elementsPiece = [];
        this.initElements();
        this.initListeners();
    }
    BoardDisplay.prototype.initElements = function () {
        this.elementBoardInner = document.getElementById('board-inner');
    };
    BoardDisplay.prototype.initListeners = function () {
        var self = this;
        this.keydownListener = keydownListener;
        this.clickListener = clickListener;
        function keydownListener(event) {
            var key = event.keyCode;
            if (key < 37 /* KEY_LEFT */ || key > 40 /* KEY_DOWN */)
                return;
            var newEmptyPos = self.puzzle.getEmptyPosition();
            switch (key) {
                case 38 /* KEY_UP */:
                    newEmptyPos[1] += 1;
                    break;
                case 40 /* KEY_DOWN */:
                    newEmptyPos[1] += -1;
                    break;
                case 39 /* KEY_RIGHT */:
                    newEmptyPos[0] += -1;
                    break;
                case 37 /* KEY_LEFT */:
                    newEmptyPos[0] += 1;
                    break;
            }
            self.puzzle.move(newEmptyPos);
        }
        function clickListener(event) {
            var clientRect = this.getBoundingClientRect();
            var cursorX = event.clientX - clientRect.left;
            var cursorY = event.clientY - clientRect.top;
            var sidePiece = self.getSidePiece();
            var spacing = self.getSpacing();
            var posX = Math.floor((cursorX - Math.floor(cursorX / sidePiece) * spacing + spacing) / sidePiece);
            var posY = Math.floor((cursorY - Math.floor(cursorY / sidePiece) * spacing + spacing) / sidePiece);
            self.puzzle.move([posX, posY]);
        }
    };
    BoardDisplay.prototype.activateListeners = function () {
        document.addEventListener('keydown', this.keydownListener);
        this.elementBoardInner.addEventListener('click', this.clickListener);
    };
    BoardDisplay.prototype.deactivateListeners = function () {
        document.removeEventListener('keydown', this.keydownListener);
        this.elementBoardInner.removeEventListener('click', this.clickListener);
    };
    BoardDisplay.prototype.getSidePiece = function () {
        return (this.elementBoardInner.clientWidth - this.getSpacing() * (this.puzzle.getBoardSize() + 1)) / this.puzzle.getBoardSize();
    };
    BoardDisplay.prototype.getSpacing = function () {
        if (this._spacing === -1)
            this._spacing = getSpacing();
        return this._spacing;
    };
    BoardDisplay.prototype.fillBoard = function () {
        this.clearBoard();
        var sidePiece = this.getSidePiece();
        var length = this.puzzle.getBoardSize() * this.puzzle.getBoardSize();
        for (var i = 0; i < length; i++) {
            var elementPiece = createPiece(sidePiece);
            elementPiece.id = 'piece-' + i;
            elementPiece.childNodes.item(0).innerHTML = i.toString();
            this.elementBoardInner.appendChild(elementPiece);
            this.elementsPiece.push(elementPiece);
        }
    };
    BoardDisplay.prototype.clearBoard = function () {
        var _this = this;
        if (!this.elementsPiece.length)
            return;
        this._sidePiece = -1;
        this._spacing = -1;
        this.elementsPiece.forEach(function (value) { return _this.elementBoardInner.removeChild(value); });
        this.elementsPiece = [];
    };
    BoardDisplay.prototype.update = function () {
        var _this = this;
        var sidePiece = this.getSidePiece();
        var spacing = this.getSpacing();
        this.puzzle.board.forEach(function (piece, index) {
            var position = _this.puzzle.getPosition(index);
            var elementPiece = _this.elementsPiece[piece];
            elementPiece.style.left = (sidePiece + spacing) * position[0] + spacing + 'px';
            elementPiece.style.top = (sidePiece + spacing) * position[1] + spacing + 'px';
        });
    };
    return BoardDisplay;
})();
var MenuScreen = (function () {
    function MenuScreen(game) {
        this.game = game;
        this.initElements();
        this.initListeners();
    }
    MenuScreen.prototype.initElements = function () {
        this.elementGameMenu = document.getElementById('game-menu');
        this.elementButtonPlay = this.elementGameMenu.querySelector('.btn-play');
        this.elementButtonSettings = this.elementGameMenu.querySelector('.btn-settings');
        this.elementButtonRules = this.elementGameMenu.querySelector('.btn-rules');
    };
    MenuScreen.prototype.initListeners = function () {
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
    };
    MenuScreen.prototype.activate = function () {
        this.elementGameMenu.style.display = 'block';
        this.elementButtonPlay.addEventListener('click', this.btnPlayClickListener);
        this.elementButtonSettings.addEventListener('click', this.btnSettingsClickListener);
        this.elementButtonRules.addEventListener('click', this.btnRulesClickListener);
    };
    MenuScreen.prototype.deactivate = function () {
        this.elementGameMenu.style.display = 'none';
        this.elementButtonPlay.removeEventListener('click', this.btnPlayClickListener);
        this.elementButtonSettings.removeEventListener('click', this.btnSettingsClickListener);
        this.elementButtonRules.removeEventListener('click', this.btnRulesClickListener);
    };
    return MenuScreen;
})();
var SettingsScreen = (function () {
    function SettingsScreen(game) {
        this.game = game;
        this.boardSize = game.boardSize;
        this.initElements();
        this.initListeners();
    }
    SettingsScreen.prototype.initElements = function () {
        this.elementGameSettings = document.getElementById('game-settings');
        this.elementButtonClose = this.elementGameSettings.querySelector('.btn-close');
        this.elementButtonSave = this.elementGameSettings.querySelector('.btn-save');
        this.elementButtonsBoardSize = this.elementGameSettings.querySelectorAll('.btn-board-size');
    };
    SettingsScreen.prototype.initListeners = function () {
        var self = this;
        this.btnCloseClickListener = btnCloseClickListener;
        this.btnSaveClickListener = btnSaveClickListener;
        this.btnBoardSizeClickListener = btnBoardSizeClickListener;
        function btnCloseClickListener() {
            self.game.setScreen(self.game.screens.menu);
        }
        function btnSaveClickListener() {
            self.game.boardSize = self.boardSize;
            self.game.setScreen(self.game.screens.menu);
        }
        function btnBoardSizeClickListener(event) {
            var target = event.target;
            self.boardSize = parseInt(target.dataset.boardSize, 10);
            Array.prototype.forEach.call(self.elementButtonsBoardSize, function (element) {
                element.classList.remove('active');
            });
            target.classList.add('active');
        }
    };
    SettingsScreen.prototype.activate = function () {
        var _this = this;
        this.elementGameSettings.style.display = 'block';
        this.elementButtonClose.addEventListener('click', this.btnCloseClickListener);
        this.elementButtonSave.addEventListener('click', this.btnSaveClickListener);
        Array.prototype.forEach.call(this.elementButtonsBoardSize, function (element) {
            var dataBoardSize = parseInt(element.dataset.boardSize, 10);
            if (dataBoardSize === _this.boardSize) {
                element.classList.add('active');
            }
            else {
                element.classList.remove('active');
            }
            element.addEventListener('click', _this.btnBoardSizeClickListener);
        });
    };
    SettingsScreen.prototype.deactivate = function () {
        var _this = this;
        this.elementGameSettings.style.display = 'none';
        this.elementButtonClose.removeEventListener('click', this.btnCloseClickListener);
        this.elementButtonSave.removeEventListener('click', this.btnSaveClickListener);
        Array.prototype.forEach.call(this.elementButtonsBoardSize, function (element) {
            element.removeEventListener('click', _this.btnBoardSizeClickListener);
        });
    };
    return SettingsScreen;
})();
var RulesScreen = (function () {
    function RulesScreen(game) {
        this.game = game;
        this.initElements();
        this.initListeners();
    }
    RulesScreen.prototype.initElements = function () {
        this.elementGameRules = document.getElementById('game-rules');
        this.elementButtonClose = this.elementGameRules.querySelector('.btn-close');
    };
    RulesScreen.prototype.initListeners = function () {
        var self = this;
        this.btnCloseClickListener = btnPlayClickListener;
        function btnPlayClickListener() {
            self.game.setScreen(self.game.screens.menu);
        }
    };
    RulesScreen.prototype.activate = function () {
        this.elementGameRules.style.display = 'block';
        this.elementButtonClose.addEventListener('click', this.btnCloseClickListener);
    };
    RulesScreen.prototype.deactivate = function () {
        this.elementGameRules.style.display = 'none';
        this.elementButtonClose.removeEventListener('click', this.btnCloseClickListener);
    };
    return RulesScreen;
})();
var PlayingState;
(function (PlayingState) {
    PlayingState[PlayingState["NONE"] = 0] = "NONE";
    PlayingState[PlayingState["PLAYING"] = 1] = "PLAYING";
    PlayingState[PlayingState["PAUSE"] = 2] = "PAUSE";
    PlayingState[PlayingState["FINISH"] = 3] = "FINISH";
    PlayingState[PlayingState["STOP"] = 4] = "STOP";
})(PlayingState || (PlayingState = {}));
var PlayingScreen = (function () {
    function PlayingScreen(game) {
        this.game = game;
        this.state = 0 /* NONE */;
        this.initElements();
        this.initListeners();
    }
    PlayingScreen.prototype.initElements = function () {
        this.elementGamePlaying = document.getElementById('game-playing');
        this.elementButtonNewGame = this.elementGamePlaying.querySelector('.btn-new-game');
        this.elementButtonPause = this.elementGamePlaying.querySelector('.btn-pause');
        this.elementButtonMenu = this.elementGamePlaying.querySelector('.btn-menu');
        this.elementOverlayPause = document.getElementById('overlay-pause');
        this.elementElapsedTimeValue = this.elementGamePlaying.querySelector('.elapsed-time span');
        this.elementCountMovesValue = this.elementGamePlaying.querySelector('.count-moves span');
        this.timer = new Timer(100);
        this.puzzle = new Puzzle(this.game.boardSize);
        this.boardDisplay = new BoardDisplay(this.puzzle);
    };
    PlayingScreen.prototype.initListeners = function () {
        var self = this;
        this.btnNewGameClickListener = btnNewGameClickListener;
        this.btnPauseClickListener = btnPauseClickListener;
        this.btnMenuClickListener = btnMenuClickListener;
        this.overlayClickListener = overlayClickListener;
        this.timer.onTimer = timerListener;
        this.puzzle.onMove = moveListener;
        function btnNewGameClickListener() {
            self.newGame();
        }
        function btnPauseClickListener() {
            self.setState(2 /* PAUSE */);
        }
        function btnMenuClickListener() {
            self.setState(4 /* STOP */);
        }
        function overlayClickListener() {
            self.setState(1 /* PLAYING */);
        }
        function timerListener() {
            self.elementElapsedTimeValue.innerHTML = timeToStr(new Date().getTime() - self.startTime);
        }
        function moveListener() {
            self.countMoves++;
            self.update();
            if (self.puzzle.checkWin()) {
                self.finishGame();
            }
        }
    };
    PlayingScreen.prototype.setState = function (state) {
        if (this.state === state)
            return;
        this.state = state;
        this.changeState();
    };
    PlayingScreen.prototype.changeState = function () {
        switch (this.state) {
            case 1 /* PLAYING */:
                this.playingState();
                break;
            case 2 /* PAUSE */:
                this.pauseState();
                break;
            case 3 /* FINISH */:
                this.finishState();
                break;
            case 4 /* STOP */:
                this.stopState();
                break;
        }
    };
    PlayingScreen.prototype.playingState = function () {
        this.elementOverlayPause.style.display = 'none';
        this.elementOverlayPause.removeEventListener('click', this.overlayClickListener);
        this.startTime += this.timer.start();
        this.activateListeners();
    };
    PlayingScreen.prototype.pauseState = function () {
        this.elementOverlayPause.style.display = 'block';
        this.elementOverlayPause.addEventListener('click', this.overlayClickListener);
        this.timer.stop();
        this.deactivateListeners();
    };
    PlayingScreen.prototype.finishState = function () {
        this.finishTime = new Date().getTime();
        this.timer.stop();
        this.deactivateListeners();
        this.game.countMoves = this.countMoves;
        this.game.runningTime = this.finishTime - this.startTime;
        this.game.setScreen(this.game.screens.wins);
    };
    PlayingScreen.prototype.stopState = function () {
        this.timer.stop();
        this.deactivateListeners();
        this.game.setScreen(this.game.screens.menu);
    };
    PlayingScreen.prototype.activateListeners = function () {
        this.boardDisplay.activateListeners();
        this.elementButtonNewGame.addEventListener('click', this.btnNewGameClickListener);
        this.elementButtonPause.addEventListener('click', this.btnPauseClickListener);
        this.elementButtonMenu.addEventListener('click', this.btnMenuClickListener);
    };
    PlayingScreen.prototype.deactivateListeners = function () {
        this.boardDisplay.deactivateListeners();
        this.elementButtonNewGame.removeEventListener('click', this.btnNewGameClickListener);
        this.elementButtonPause.removeEventListener('click', this.btnPauseClickListener);
        this.elementButtonMenu.removeEventListener('click', this.btnMenuClickListener);
    };
    PlayingScreen.prototype.activate = function () {
        var _this = this;
        this.elementGamePlaying.style.display = 'block';
        this.puzzle.setBoardSize(this.game.boardSize);
        this.boardDisplay.fillBoard();
        this.boardDisplay.update();
        setTimeout(function () { return _this.newGame(); }, 400);
    };
    PlayingScreen.prototype.deactivate = function () {
        this.timer.stop();
        this.deactivateListeners();
        this.boardDisplay.clearBoard();
        this.elementGamePlaying.style.display = 'none';
    };
    PlayingScreen.prototype.newGame = function () {
        this.puzzle.shuffle();
        if (this.puzzle.checkWin())
            this.puzzle.shuffle();
        this.startTime = new Date().getTime();
        this.countMoves = 0;
        this.timer.onTimer();
        this.update();
        this.setState(1 /* PLAYING */);
    };
    PlayingScreen.prototype.finishGame = function () {
        this.setState(3 /* FINISH */);
    };
    PlayingScreen.prototype.update = function () {
        this.boardDisplay.update();
        this.elementCountMovesValue.innerHTML = this.countMoves.toString();
    };
    return PlayingScreen;
})();
var WinsScreen = (function () {
    function WinsScreen(game) {
        this.game = game;
        this.initElements();
        this.initListeners();
    }
    WinsScreen.prototype.initElements = function () {
        this.elementGameWins = document.getElementById('game-wins');
        this.elementButtonPlay = this.elementGameWins.querySelector('.btn-play');
        this.elementButtonMenu = this.elementGameWins.querySelector('.btn-menu');
        this.elementCountMovesValue = this.elementGameWins.querySelector('.count-moves span.value');
        this.elementRunningTimeValue = this.elementGameWins.querySelector('.running-time span.value');
    };
    WinsScreen.prototype.initListeners = function () {
        var self = this;
        this.btnPlayClickListener = btnPlayClickListener;
        this.btnMenuClickListener = btnMenuClickListener;
        function btnPlayClickListener() {
            self.game.setScreen(self.game.screens.playing);
        }
        function btnMenuClickListener() {
            self.game.setScreen(self.game.screens.menu);
        }
    };
    WinsScreen.prototype.activate = function () {
        this.elementGameWins.style.display = 'block';
        this.elementButtonPlay.addEventListener('click', this.btnPlayClickListener);
        this.elementButtonMenu.addEventListener('click', this.btnMenuClickListener);
        this.elementCountMovesValue.innerHTML = this.game.countMoves.toString();
        this.elementRunningTimeValue.innerHTML = timeToStr(this.game.runningTime);
    };
    WinsScreen.prototype.deactivate = function () {
        this.elementButtonPlay.removeEventListener('click', this.btnPlayClickListener);
        this.elementButtonMenu.removeEventListener('click', this.btnMenuClickListener);
        this.elementGameWins.style.display = 'none';
    };
    return WinsScreen;
})();
var Game = (function () {
    function Game() {
        this.boardSize = 4;
        this.screens = {
            menu: new MenuScreen(this),
            settings: new SettingsScreen(this),
            rules: new RulesScreen(this),
            playing: new PlayingScreen(this),
            wins: new WinsScreen(this)
        };
        this.setScreen(this.screens.menu);
    }
    Game.prototype.setScreen = function (screen) {
        if (this.currentScreen)
            this.currentScreen.deactivate();
        this.currentScreen = screen;
        this.currentScreen.activate();
    };
    return Game;
})();
new Game();
