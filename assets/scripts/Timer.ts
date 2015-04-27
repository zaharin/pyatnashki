class Timer {
    private timerId: number = 0;
    private runningStartTime: number = 0;
    private idleStartTime: number = 0;
    onTimer: () => void;

    constructor(private delay: number = 1000) {}

    start(): number {
        if (this.running()) this.stop();

        this.timerId = setInterval(this.doTimer.bind(this), this.delay);
        this.runningStartTime = new Date().getTime();

        return this.idleStartTime ? this.runningStartTime - this.idleStartTime : 0;
    }

    stop(): number {
        if (!this.running()) return this.idleStartTime = 0;

        clearInterval(this.timerId);
        this.timerId = 0;

        this.idleStartTime = new Date().getTime();
        return this.runningStartTime ? this.idleStartTime - this.runningStartTime : 0;
    }

    private doTimer() {
        if (this.onTimer) this.onTimer();
    }

    running(): boolean {
        return this.timerId !== 0;
    }
}