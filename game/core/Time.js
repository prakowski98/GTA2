export class Time {
  constructor() {
    this.deltaTime = 0;
    this.fixedDeltaTime = 1 / 60;
    this.time = 0;
    this.frameCount = 0;
    this.timeScale = 1.0;
  }

  update(dt) {
    this.deltaTime = dt * this.timeScale;
    this.time += this.deltaTime;
    this.frameCount++;
  }

  reset() {
    this.time = 0;
    this.frameCount = 0;
  }
}
