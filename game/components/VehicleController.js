export class VehicleController {
  constructor(config = {}) {
    this.vehicleType = config.type || 'car';
    this.acceleration = config.acceleration || 300;
    this.turnSpeed = config.turnSpeed || 3;
    this.maxSpeed = config.maxSpeed || 400;
    this.brakeForce = config.brakeForce || 0.9;
    this.driver = null;
    this.enterRadius = 40;
    this.occupied = false;
  }

  enter(entity) {
    this.driver = entity;
    this.occupied = true;
  }

  exit() {
    const driver = this.driver;
    this.driver = null;
    this.occupied = false;
    return driver;
  }
}
