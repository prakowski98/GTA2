export class Transform {
  constructor(x = 0, y = 0, rotation = 0) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.rotation = rotation;
    this.prevRotation = rotation;
  }

  saveState() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.prevRotation = this.rotation;
  }

  interpolate(alpha) {
    return {
      x: this.prevX + (this.x - this.prevX) * alpha,
      y: this.prevY + (this.y - this.prevY) * alpha,
      rotation: this.prevRotation + (this.rotation - this.prevRotation) * alpha
    };
  }
}
