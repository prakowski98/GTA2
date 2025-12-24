export class Renderable {
  constructor(config = {}) {
    this.type = config.type || 'circle';
    this.color = config.color || '#ffffff';
    this.width = config.width || 32;
    this.height = config.height || 32;
    this.radius = config.radius || 16;
    this.layer = config.layer || 0;
    this.visible = true;
    this.shape = config.shape || null;
  }

  render(ctx, x, y, rotation) {
    if (!this.visible) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    if (this.type === 'circle') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'rect') {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    } else if (this.type === 'custom' && this.shape) {
      this.shape(ctx);
    }

    ctx.restore();
  }
}
