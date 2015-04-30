module GamePuzzle.Timer {
    import Utils = GamePuzzle.Utils;

    enum TimerState {
        RUNNING,
        SUSPEND,
        STOP
    }

    export class Timer {
        private timerId: number = 0;
        private startTime: number;
        private stopTime: number;
        private state: TimerState;

        onTimer:() => void;

        constructor(private delay: number = 1000) {}

        start() {
            this.state === TimerState.RUNNING && this.stop();

            this.timerId = setInterval(this.doTimer.bind(this), this.delay);
            this.startTime = Utils.getTime();
            this.state = TimerState.RUNNING;
        }

        stop() {
            if (this.state === TimerState.STOP) return;

            clearInterval(this.timerId);
            this.timerId = 0;

            this.stopTime = Utils.getTime();
            this.state = TimerState.STOP;
        }

        resume() {
            if (this.state !== TimerState.SUSPEND) return;

            clearInterval(this.timerId);
            this.timerId = setInterval(this.doTimer.bind(this), this.delay);

            this.startTime += Utils.getTime() - this.stopTime;
            this.state = TimerState.RUNNING;
        }

        suspend() {
            if (this.state !== TimerState.RUNNING) return;

            clearInterval(this.timerId);
            this.timerId = 0;

            this.stopTime = Utils.getTime();
            this.state = TimerState.SUSPEND;
        }

        private doTimer() {
            this.onTimer && this.onTimer();
        }

        runningTime(): number {
            switch (this.state) {
                case TimerState.RUNNING:
                    return Utils.getTime() - this.startTime;
                case TimerState.STOP:
                case TimerState.SUSPEND:
                    return this.stopTime - this.startTime;
            }
        }
    }
}