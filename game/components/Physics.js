export class Physics {
  constructor(config = {}) {
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.mass = config.mass || 1;
    this.friction = config.friction || 0.98;
    this.drag = config.drag || 0.99;
    this.maxSpeed = config.maxSpeed || 500;
    this.collider = config.collider || { type: 'circle', radius: 16 };
    this.isStatic = config.isStatic || false;
    this.layer = config.layer || 'default';
  }

  applyForce(fx, fy) {
    this.ax += fx / this.mass;
    this.ay += fy / this.mass;
  }

  applyImpulse(ix, iy) {
    this.vx += ix / this.mass;
    this.vy += iy / this.mass;
  }

  update(dt) {
    if (this.isStatic) return;

    this.vx += this.ax * dt;
    this.vy += this.ay * dt;

    this.vx *= this.friction;
    this.vy *= this.friction;

    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > this.maxSpeed) {
      const scale = this.maxSpeed / speed;
      this.vx *= scale;
      this.vy *= scale;
    }

    this.ax = 0;
    this.ay = 0;
  }
}
