import { MathUtils } from '../utils/Math.js';

export class Camera {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.target = null;
    this.smoothing = 0.1;
    this.zoom = 1;
  }

  setTarget(entity) {
    this.target = entity;
  }

  update(dt) {
    if (!this.target) return;

    const transform = this.target.getComponent('transform');
    if (!transform) return;

    const targetX = transform.x - this.width / 2;
    const targetY = transform.y - this.height / 2;

    this.x = MathUtils.lerp(this.x, targetX, this.smoothing);
    this.y = MathUtils.lerp(this.y, targetY, this.smoothing);
  }

  worldToScreen(x, y) {
    return {
      x: (x - this.x) * this.zoom,
      y: (y - this.y) * this.zoom
    };
  }

  screenToWorld(x, y) {
    return {
      x: x / this.zoom + this.x,
      y: y / this.zoom + this.y
    };
  }

  isVisible(x, y, margin = 100) {
    return x + margin > this.x &&
           x - margin < this.x + this.width &&
           y + margin > this.y &&
           y - margin < this.y + this.height;
  }

  apply(ctx) {
    ctx.save();
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
  }

  restore(ctx) {
    ctx.restore();
  }
}
