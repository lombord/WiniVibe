export class Timer {
  public readonly duration;
  public readonly callback;

  protected remaining: number;
  protected timerId?: number | null;
  private startTime: number = 0;

  constructor(duration: number, callback: Function) {
    this.duration = duration;
    this.callback = callback;
    this.remaining = duration;
  }

  public start() {
    this.resetTimer();
    this.resume();
  }

  public stop() {
    if (this.timerId) window.clearTimeout(this.timerId);
    this.resetTimer();
  }

  public resume() {
    if (this.timerId) return;
    this.timerId = window.setTimeout(() => {
      this.callback();
      this.resetTimer();
    }, this.remaining);
    this.startTime = Date.now();
  }

  public pause() {
    if (!this.timerId) return;
    window.clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.startTime;
    this.resetResume();
  }

  private resetResume() {
    this.startTime = 0;
    this.timerId = null;
  }

  protected resetTimer() {
    this.remaining = this.duration;
    this.resetResume();
  }
}
