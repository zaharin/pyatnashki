var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GamePuzzle;
(function (GamePuzzle) {
    var Utils;
    (function (Utils) {
        function random(max) {
            return Math.floor(Math.random() * max);
        }
        Utils.random = random;
        function getSpacing() {
            var elementTmp = document.createElement('div');
            elementTmp.className = 'standard-spacing';
            document.body.appendChild(elementTmp);
            var spacing = elementTmp.clientWidth;
            document.body.removeChild(elementTmp);
            return spacing;
        }
        Utils.getSpacing = getSpacing;
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
        Utils.createPiece = createPiece;
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
        Utils.timeToStr = timeToStr;
        function getTime() {
            return new Date().getTime();
        }
        Utils.getTime = getTime;
    })(Utils = GamePuzzle.Utils || (GamePuzzle.Utils = {}));
})(GamePuzzle || (GamePuzzle = {}));
var GamePuzzle;
(function (GamePuzzle) {
    var Keyboard;
    (function (Keyboard) {
        (function (Key) {
            Key[Key["KEY_LEFT"] = 37] = "KEY_LEFT";
            Key[Key["KEY_UP"] = 38] = "KEY_UP";
            Key[Key["KEY_RIGHT"] = 39] = "KEY_RIGHT";
            Key[Key["KEY_DOWN"] = 40] = "KEY_DOWN";
        })(Keyboard.Key || (Keyboard.Key = {}));
        var Key = Keyboard.Key;
    })(Keyboard = GamePuzzle.Keyboard || (GamePuzzle.Keyboard = {}));
})(GamePuzzle || (GamePuzzle = {}));
var GamePuzzle;
(function (GamePuzzle) {
    var Timer;
    (function (_Timer) {
        var Utils = GamePuzzle.Utils;
        var TimerState;
        (function (TimerState) {
            TimerState[TimerState["RUNNING"] = 0] = "RUNNING";
            TimerState[TimerState["SUSPEND"] = 1] = "SUSPEND";
            TimerState[TimerState["STOP"] = 2] = "STOP";
        })(TimerState || (TimerState = {}));
        var Timer = (function () {
            function Timer(delay) {
                if (delay === void 0) { delay = 1000; }
                this.delay = delay;
                this.timerId = 0;
            }
            Timer.prototype.start = function () {
                this.state === 0 /* RUNNING */ && this.stop();
                this.timerId = setInterval(this.doTimer.bind(this), this.delay);
                this.startTime = Utils.getTime();
                this.state = 0 /* RUNNING */;
            };
            Timer.prototype.stop = function () {
                if (this.state === 2 /* STOP */)
                    return;
                clearInterval(this.timerId);
                this.timerId = 0;
                this.stopTime = Utils.getTime();
                this.state = 2 /* STOP */;
            };
            Timer.prototype.resume = function () {
                if (this.state !== 1 /* SUSPEND */)
                    return;
                clearInterval(this.timerId);
                this.timerId = setInterval(this.doTimer.bind(this), this.delay);
                this.startTime += Utils.getTime() - this.stopTime;
                this.state = 0 /* RUNNING */;
            };
            Timer.prototype.suspend = function () {
                if (this.state !== 0 /* RUNNING */)
                    return;
                clearInterval(this.timerId);
                this.timerId = 0;
                this.stopTime = Utils.getTime();
                this.state = 1 /* SUSPEND */;
            };
            Timer.prototype.doTimer = function () {
                this.onTimer && this.onTimer();
            };
            Timer.prototype.runningTime = function () {
                switch (this.state) {
                    case 0 /* RUNNING */:
                        return Utils.getTime() - this.startTime;
                    case 2 /* STOP */:
                    case 1 /* SUSPEND */:
                        return this.stopTime - this.startTime;
                }
            };
            return Timer;
        })();
        _Timer.Timer = Timer;
    })(Timer = GamePuzzle.Timer || (GamePuzzle.Timer = {}));
})(GamePuzzle || (GamePuzzle = {}));
var GamePuzzle;
(function (GamePuzzle) {
    var Puzzle;
    (function (_Puzzle) {
        var Utils = GamePuzzle.Utils;
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
                    var randomDir = Utils.random(4);
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
        _Puzzle.Puzzle = Puzzle;
    })(Puzzle = GamePuzzle.Puzzle || (GamePuzzle.Puzzle = {}));
})(GamePuzzle || (GamePuzzle = {}));
var GamePuzzle;
(function (GamePuzzle) {
    var BoardDisplay;
    (function (_BoardDisplay) {
        var Utils = GamePuzzle.Utils;
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
                    this._spacing = Utils.getSpacing();
                return this._spacing;
            };
            BoardDisplay.prototype.fillBoard = function () {
                this.clearBoard();
                var sidePiece = this.getSidePiece();
                var length = this.puzzle.getBoardSize() * this.puzzle.getBoardSize();
                for (var i = 0; i < length; i++) {
                    var elementPiece = Utils.createPiece(sidePiece);
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
        _BoardDisplay.BoardDisplay = BoardDisplay;
    })(BoardDisplay = GamePuzzle.BoardDisplay || (GamePuzzle.BoardDisplay = {}));
})(GamePuzzle || (GamePuzzle = {}));
var GamePuzzle;
(function (GamePuzzle) {
    var Screen;
    (function (_Screen) {
        (function (Status) {
            Status[Status["STATUS_DEFAULT"] = 0] = "STATUS_DEFAULT";
            Status[Status["STATUS_APPLY"] = 1] = "STATUS_APPLY";
            Status[Status["STATUS_HIDE"] = 2] = "STATUS_HIDE";
            Status[Status["STATUS_SETTINGS"] = 3] = "STATUS_SETTINGS";
            Status[Status["STATUS_RULES"] = 4] = "STATUS_RULES";
            Status[Status["STATUS_PLAY"] = 5] = "STATUS_PLAY";
            Status[Status["STATUS_PAUSE"] = 6] = "STATUS_PAUSE";
            Status[Status["STATUS_NEW_GAME"] = 7] = "STATUS_NEW_GAME";
            Status[Status["STATUS_FINISH_GAME"] = 8] = "STATUS_FINISH_GAME";
        })(_Screen.Status || (_Screen.Status = {}));
        var Status = _Screen.Status;
        var Screen = (function () {
            function Screen(elementId) {
                this.element = document.getElementById(elementId);
            }
            Screen.prototype.show = function () {
                this.element.style.display = 'block';
                this.onShow && this.onShow();
            };
            Screen.prototype.hide = function (status) {
                if (status === void 0) { status = 0 /* STATUS_DEFAULT */; }
                this.element.style.display = 'none';
                this.onHide && this.onHide(status);
            };
            return Screen;
        })();
        _Screen.Screen = Screen;
    })(Screen = GamePuzzle.Screen || (GamePuzzle.Screen = {}));
})(GamePuzzle || (GamePuzzle = {}));
var GamePuzzle;
(function (GamePuzzle) {
    var Screen;
    (function (_Screen) {
        var Screen = GamePuzzle.Screen;
        var MenuScreen = (function (_super) {
            __extends(MenuScreen, _super);
            function MenuScreen() {
                _super.call(this, 'game-menu');
                this.initElements();
                this.initListeners();
            }
            MenuScreen.prototype.initElements = function () {
                this.elementButtonPlay = this.element.querySelector('.btn-play');
                this.elementButtonSettings = this.element.querySelector('.btn-settings');
                this.elementButtonRules = this.element.querySelector('.btn-rules');
            };
            MenuScreen.prototype.initListeners = function () {
                var self = this;
                this.btnPlayClickListener = btnPlayClickListener;
                this.btnSettingsClickListener = btnSettingsClickListener;
                this.btnRulesClickListener = btnRulesClickListener;
                function btnPlayClickListener() {
                    self.hide(5 /* STATUS_PLAY */);
                }
                function btnSettingsClickListener() {
                    self.hide(3 /* STATUS_SETTINGS */);
                }
                function btnRulesClickListener() {
                    self.hide(4 /* STATUS_RULES */);
                }
            };
            MenuScreen.prototype.activateListeners = function () {
                this.elementButtonPlay.addEventListener('click', this.btnPlayClickListener);
                this.elementButtonSettings.addEventListener('click', this.btnSettingsClickListener);
                this.elementButtonRules.addEventListener('click', this.btnRulesClickListener);
            };
            MenuScreen.prototype.deactivateListeners = function () {
                this.elementButtonPlay.removeEventListener('click', this.btnPlayClickListener);
                this.elementButtonSettings.removeEventListener('click', this.btnSettingsClickListener);
                this.elementButtonRules.removeEventListener('click', this.btnRulesClickListener);
            };
            MenuScreen.prototype.show = function () {
                _super.prototype.show.call(this);
                this.activateListeners();
            };
            MenuScreen.prototype.hide = function (status) {
                _super.prototype.hide.call(this, status);
                this.deactivateListeners();
            };
            return MenuScreen;
        })(Screen.Screen);
        _Screen.MenuScreen = MenuScreen;
    })(Screen = GamePuzzle.Screen || (GamePuzzle.Screen = {}));
})(GamePuzzle || (GamePuzzle = {}));
var GamePuzzle;
(function (GamePuzzle) {
    var Screen;
    (function (_Screen) {
        var Screen = GamePuzzle.Screen;
        var SettingsScreen = (function (_super) {
            __extends(SettingsScreen, _super);
            function SettingsScreen() {
                _super.call(this, 'game-settings');
                this.initElements();
                this.initListeners();
            }
            SettingsScreen.prototype.initElements = function () {
                this.elementButtonClose = this.element.querySelector('.btn-close');
                this.elementButtonSave = this.element.querySelector('.btn-save');
                this.elementButtonsBoardSize = this.element.querySelectorAll('.btn-board-size');
            };
            SettingsScreen.prototype.initListeners = function () {
                var self = this;
                this.btnCloseClickListener = btnCloseClickListener;
                this.btnSaveClickListener = btnSaveClickListener;
                this.btnBoardSizeClickListener = btnBoardSizeClickListener;
                function btnCloseClickListener() {
                    self.hide(2 /* STATUS_HIDE */);
                }
                function btnSaveClickListener() {
                    self.hide(1 /* STATUS_APPLY */);
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
            SettingsScreen.prototype.activateListeners = function () {
                var _this = this;
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
            SettingsScreen.prototype.deactivateListeners = function () {
                var _this = this;
                this.elementButtonClose.removeEventListener('click', this.btnCloseClickListener);
                this.elementButtonSave.removeEventListener('click', this.btnSaveClickListener);
                Array.prototype.forEach.call(this.elementButtonsBoardSize, function (element) {
                    element.removeEventListener('click', _this.btnBoardSizeClickListener);
                });
            };
            SettingsScreen.prototype.show = function () {
                _super.prototype.show.call(this);
                this.activateListeners();
            };
            SettingsScreen.prototype.hide = function (status) {
                _super.prototype.hide.call(this, status);
                this.deactivateListeners();
            };
            return SettingsScreen;
        })(Screen.Screen);
        _Screen.SettingsScreen = SettingsScreen;
    })(Screen = GamePuzzle.Screen || (GamePuzzle.Screen = {}));
})(GamePuzzle || (GamePuzzle = {}));
var GamePuzzle;
(function (GamePuzzle) {
    var Screen;
    (function (_Screen) {
        var Screen = GamePuzzle.Screen;
        var RulesScreen = (function (_super) {
            __extends(RulesScreen, _super);
            function RulesScreen() {
                _super.call(this, 'game-rules');
                this.initElements();
                this.initListeners();
            }
            RulesScreen.prototype.initElements = function () {
                this.elementButtonClose = this.element.querySelector('.btn-close');
            };
            RulesScreen.prototype.initListeners = function () {
                var self = this;
                this.btnCloseClickListener = btnCloseClickListener;
                function btnCloseClickListener() {
                    self.hide(2 /* STATUS_HIDE */);
                }
            };
            RulesScreen.prototype.activateListeners = function () {
                this.elementButtonClose.addEventListener('click', this.btnCloseClickListener);
            };
            RulesScreen.prototype.deactivateListeners = function () {
                this.elementButtonClose.removeEventListener('click', this.btnCloseClickListener);
            };
            RulesScreen.prototype.show = function () {
                _super.prototype.show.call(this);
                this.activateListeners();
            };
            RulesScreen.prototype.hide = function (status) {
                _super.prototype.hide.call(this, status);
                this.deactivateListeners();
            };
            return RulesScreen;
        })(Screen.Screen);
        _Screen.RulesScreen = RulesScreen;
    })(Screen = GamePuzzle.Screen || (GamePuzzle.Screen = {}));
})(GamePuzzle || (GamePuzzle = {}));
var GamePuzzle;
(function (GamePuzzle) {
    var Screen;
    (function (_Screen) {
        var Screen = GamePuzzle.Screen;
        var Puzzle = GamePuzzle.Puzzle.Puzzle;
        var Timer = GamePuzzle.Timer.Timer;
        var BoardDisplay = GamePuzzle.BoardDisplay.BoardDisplay;
        var Utils = GamePuzzle.Utils;
        var PlayingState;
        (function (PlayingState) {
            PlayingState[PlayingState["RUNNING"] = 0] = "RUNNING";
            PlayingState[PlayingState["FINISH"] = 1] = "FINISH";
            PlayingState[PlayingState["BREAK"] = 2] = "BREAK";
        })(PlayingState || (PlayingState = {}));
        var PlayingScreen = (function (_super) {
            __extends(PlayingScreen, _super);
            function PlayingScreen() {
                _super.call(this, 'game-playing');
                this.countMoves = 0;
                this.refill = true;
                this.initElements();
                this.initListeners();
            }
            PlayingScreen.prototype.initElements = function () {
                this.elementButtonNewGame = this.element.querySelector('.btn-new-game');
                this.elementButtonPause = this.element.querySelector('.btn-pause');
                this.elementButtonMenu = this.element.querySelector('.btn-menu');
                this.elementElapsedTimeValue = this.element.querySelector('.elapsed-time span');
                this.elementCountMovesValue = this.element.querySelector('.count-moves span');
                this.timer = new Timer(100);
                this.puzzle = new Puzzle();
                this.boardDisplay = new BoardDisplay(this.puzzle);
            };
            PlayingScreen.prototype.initListeners = function () {
                var self = this;
                this.btnNewGameClickListener = btnNewGameClickListener;
                this.btnPauseClickListener = btnPauseClickListener;
                this.btnMenuClickListener = btnMenuClickListener;
                this.timer.onTimer = timerListener;
                this.puzzle.onMove = moveListener;
                function btnNewGameClickListener() {
                    self.newGame();
                }
                function btnPauseClickListener() {
                    self.hide(6 /* STATUS_PAUSE */);
                }
                function btnMenuClickListener() {
                    self.breakGame();
                    self.hide(2 /* STATUS_HIDE */);
                }
                function timerListener() {
                    var time = self.state !== 0 /* RUNNING */ ? 0 : self.timer.runningTime();
                    self.elementElapsedTimeValue.innerHTML = Utils.timeToStr(time);
                }
                function moveListener() {
                    self.countMoves++;
                    self.update();
                    self.puzzle.checkWin() && self.finishGame();
                }
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
            PlayingScreen.prototype.show = function () {
                _super.prototype.show.call(this);
                this.refill && this.boardDisplay.fillBoard();
                this.refill = false;
            };
            PlayingScreen.prototype.hide = function (status) {
                _super.prototype.hide.call(this, status);
                this.deactivateListeners();
            };
            PlayingScreen.prototype.setBoardSize = function (value) {
                if (this.puzzle.getBoardSize() === value)
                    return;
                this.puzzle.setBoardSize(value);
                this.refill = true;
            };
            PlayingScreen.prototype.newGame = function () {
                this.puzzle.shuffle();
                this.puzzle.checkWin() && this.puzzle.shuffle();
                this.countMoves = 0;
                this.timer.start();
                this.state = 0 /* RUNNING */;
                this.update(true);
            };
            PlayingScreen.prototype.finishGame = function () {
                this.state = 1 /* FINISH */;
                this.timer.stop();
                this.update(true);
                this.hide(8 /* STATUS_FINISH_GAME */);
            };
            PlayingScreen.prototype.breakGame = function () {
                this.state = 2 /* BREAK */;
                this.timer.stop();
                this.update(true);
            };
            PlayingScreen.prototype.resume = function () {
                this.timer.resume();
            };
            PlayingScreen.prototype.pause = function () {
                this.timer.suspend();
            };
            PlayingScreen.prototype.runningTime = function () {
                return this.timer.runningTime();
            };
            PlayingScreen.prototype.update = function (updateTimer) {
                if (updateTimer === void 0) { updateTimer = false; }
                updateTimer && this.timer.onTimer();
                var countMoves = this.state === 0 /* RUNNING */ ? this.countMoves : 0;
                this.boardDisplay.update();
                this.elementCountMovesValue.innerHTML = countMoves.toString();
            };
            return PlayingScreen;
        })(Screen.Screen);
        _Screen.PlayingScreen = PlayingScreen;
    })(Screen = GamePuzzle.Screen || (GamePuzzle.Screen = {}));
})(GamePuzzle || (GamePuzzle = {}));
var GamePuzzle;
(function (GamePuzzle) {
    var Screen;
    (function (_Screen) {
        var Screen = GamePuzzle.Screen;
        var Utils = GamePuzzle.Utils;
        var WinsScreen = (function (_super) {
            __extends(WinsScreen, _super);
            function WinsScreen() {
                _super.call(this, 'game-wins');
                this.initElements();
                this.initListeners();
            }
            WinsScreen.prototype.initElements = function () {
                this.elementButtonPlay = this.element.querySelector('.btn-play');
                this.elementButtonMenu = this.element.querySelector('.btn-menu');
                this.elementCountMovesValue = this.element.querySelector('.count-moves span.value');
                this.elementRunningTimeValue = this.element.querySelector('.running-time span.value');
            };
            WinsScreen.prototype.initListeners = function () {
                var self = this;
                this.btnPlayClickListener = btnPlayClickListener;
                this.btnMenuClickListener = btnMenuClickListener;
                function btnPlayClickListener() {
                    self.hide(5 /* STATUS_PLAY */);
                }
                function btnMenuClickListener() {
                    self.hide(2 /* STATUS_HIDE */);
                }
            };
            WinsScreen.prototype.activateListeners = function () {
                this.elementButtonPlay.addEventListener('click', this.btnPlayClickListener);
                this.elementButtonMenu.addEventListener('click', this.btnMenuClickListener);
                this.elementCountMovesValue.innerHTML = this.countMoves.toString();
                this.elementRunningTimeValue.innerHTML = Utils.timeToStr(this.runningTime);
            };
            WinsScreen.prototype.deactivateListeners = function () {
                this.elementButtonPlay.removeEventListener('click', this.btnPlayClickListener);
                this.elementButtonMenu.removeEventListener('click', this.btnMenuClickListener);
            };
            WinsScreen.prototype.show = function () {
                _super.prototype.show.call(this);
                this.activateListeners();
            };
            WinsScreen.prototype.hide = function (status) {
                _super.prototype.hide.call(this, status);
                this.deactivateListeners();
            };
            return WinsScreen;
        })(Screen.Screen);
        _Screen.WinsScreen = WinsScreen;
    })(Screen = GamePuzzle.Screen || (GamePuzzle.Screen = {}));
})(GamePuzzle || (GamePuzzle = {}));
var GamePuzzle;
(function (GamePuzzle) {
    var Screen;
    (function (_Screen) {
        var Screen = GamePuzzle.Screen;
        var PauseScreen = (function (_super) {
            __extends(PauseScreen, _super);
            function PauseScreen() {
                _super.call(this, 'game-pause');
                this.initElements();
                this.initListeners();
            }
            PauseScreen.prototype.initElements = function () {
            };
            PauseScreen.prototype.initListeners = function () {
                var self = this;
                this.elementClickListener = elementClickListener;
                function elementClickListener() {
                    self.hide(2 /* STATUS_HIDE */);
                }
            };
            PauseScreen.prototype.activateListeners = function () {
                this.element.addEventListener('click', this.elementClickListener);
            };
            PauseScreen.prototype.deactivateListeners = function () {
                this.element.removeEventListener('click', this.elementClickListener);
            };
            PauseScreen.prototype.show = function () {
                _super.prototype.show.call(this);
                this.activateListeners();
            };
            PauseScreen.prototype.hide = function (status) {
                _super.prototype.hide.call(this, status);
                this.deactivateListeners();
            };
            return PauseScreen;
        })(Screen.Screen);
        _Screen.PauseScreen = PauseScreen;
    })(Screen = GamePuzzle.Screen || (GamePuzzle.Screen = {}));
})(GamePuzzle || (GamePuzzle = {}));
var GamePuzzle;
(function (GamePuzzle) {
    var Screen = GamePuzzle.Screen;
    var Game = (function () {
        function Game() {
            this.boardSize = 4;
            this.screens = {
                menu: new Screen.MenuScreen(),
                settings: new Screen.SettingsScreen(),
                rules: new Screen.RulesScreen(),
                playing: new Screen.PlayingScreen(),
                wins: new Screen.WinsScreen(),
                pause: new Screen.PauseScreen()
            };
            this.screens.menu.onHide = this.onMenuScreenHide.bind(this);
            this.screens.menu.onHide = this.onMenuScreenHide.bind(this);
            this.screens.settings.onHide = this.onSettingsScreenHide.bind(this);
            this.screens.rules.onHide = this.onRulesScreenHide.bind(this);
            this.screens.playing.onHide = this.onPlayingScreenHide.bind(this);
            this.screens.wins.onHide = this.onWinsScreenHide.bind(this);
            this.screens.pause.onHide = this.onPauseScreenHide.bind(this);
        }
        Game.prototype.newGame = function () {
            var _this = this;
            this.screens.playing.setBoardSize(this.boardSize);
            this.screens.playing.show();
            this.screens.playing.update();
            setTimeout(function () {
                _this.screens.playing.newGame();
                _this.screens.playing.activateListeners();
            }, 400);
        };
        Game.prototype.onMenuScreenHide = function (status) {
            switch (status) {
                case 4 /* STATUS_RULES */:
                    this.screens.rules.show();
                    break;
                case 3 /* STATUS_SETTINGS */:
                    this.screens.settings.boardSize = this.boardSize;
                    this.screens.settings.show();
                    break;
                default:
                    this.newGame();
            }
        };
        Game.prototype.onSettingsScreenHide = function (status) {
            if (status === 1 /* STATUS_APPLY */) {
                this.boardSize = this.screens.settings.boardSize;
            }
            this.screens.menu.show();
        };
        Game.prototype.onRulesScreenHide = function () {
            this.screens.menu.show();
        };
        Game.prototype.onPlayingScreenHide = function (status) {
            switch (status) {
                case 6 /* STATUS_PAUSE */:
                    this.screens.playing.pause();
                    this.screens.pause.show();
                    break;
                case 8 /* STATUS_FINISH_GAME */:
                    this.screens.wins.countMoves = this.screens.playing.countMoves;
                    this.screens.wins.runningTime = this.screens.playing.runningTime();
                    this.screens.wins.show();
                    break;
                default:
                    this.screens.menu.show();
            }
        };
        Game.prototype.onWinsScreenHide = function (status) {
            if (status === 5 /* STATUS_PLAY */) {
                this.newGame();
                return;
            }
            this.screens.menu.show();
        };
        Game.prototype.onPauseScreenHide = function () {
            this.screens.playing.resume();
            this.screens.playing.show();
            this.screens.playing.activateListeners();
        };
        Game.prototype.run = function () {
            this.screens.menu.show();
        };
        return Game;
    })();
    GamePuzzle.Game = Game;
})(GamePuzzle || (GamePuzzle = {}));
var game = new GamePuzzle.Game();
game.run();
