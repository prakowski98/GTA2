export class Health {
  constructor(max = 100) {
    this.max = max;
    this.current = max;
    this.isDead = false;
  }

  damage(amount) {
    if (this.isDead) return;
    this.current = Math.max(0, this.current - amount);
    if (this.current === 0) {
      this.isDead = true;
    }
  }

  heal(amount) {
    if (this.isDead) return;
    this.current = Math.min(this.max, this.current + amount);
  }

  reset() {
    this.current = this.max;
    this.isDead = false;
  }
}
