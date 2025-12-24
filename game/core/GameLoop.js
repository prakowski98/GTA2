export class GameLoop {
  constructor(updateCallback, renderCallback) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
    this.isRunning = false;
    this.lastFrameTime = 0;
    this.accumulator = 0;
    this.fixedTimeStep = 1 / 60;
    this.maxFrameTime = 0.25;
    this.alpha = 0;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now() / 1000;
    this.loop();
  }

  stop() {
    this.isRunning = false;
  }

  loop() {
    if (!this.isRunning) return;

    const currentTime = performance.now() / 1000;
    let frameTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    if (frameTime > this.maxFrameTime) {
      frameTime = this.maxFrameTime;
    }

    this.accumulator += frameTime;

    while (this.accumulator >= this.fixedTimeStep) {
      this.updateCallback(this.fixedTimeStep);
      this.accumulator -= this.fixedTimeStep;
    }

    this.alpha = this.accumulator / this.fixedTimeStep;
    this.renderCallback(this.alpha);

    requestAnimationFrame(() => this.loop());
  }
}
