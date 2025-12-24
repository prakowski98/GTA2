import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Renderable } from '../components/Renderable.js';
import { VehicleController } from '../components/VehicleController.js';
import { Health } from '../components/Health.js';

export class Vehicle {
  static create(entityManager, x, y, vehicleType = 'car') {
    const entity = entityManager.create('vehicle');

    const configs = {
      car: {
        width: 32,
        height: 48,
        color: '#ff0000',
        mass: 2,
        acceleration: 400,
        turnSpeed: 2.5,
        maxSpeed: 400,
        health: 100
      },
      truck: {
        width: 40,
        height: 64,
        color: '#0000ff',
        mass: 4,
        acceleration: 250,
        turnSpeed: 1.8,
        maxSpeed: 300,
        health: 200
      },
      sports: {
        width: 30,
        height: 44,
        color: '#ffff00',
        mass: 1.5,
        acceleration: 600,
        turnSpeed: 3.5,
        maxSpeed: 600,
        health: 80
      }
    };

    const config = configs[vehicleType] || configs.car;

    entity.addComponent('transform', new Transform(x, y, 0));
    entity.addComponent('physics', new Physics({
      mass: config.mass,
      friction: 0.92,
      maxSpeed: config.maxSpeed,
      collider: { type: 'circle', radius: config.height / 2 }
    }));
    entity.addComponent('renderable', new Renderable({
      type: 'custom',
      layer: 4,
      shape: (ctx) => {
        ctx.fillStyle = config.color;
        ctx.fillRect(-config.width / 2, -config.height / 2, config.width, config.height);
        ctx.fillStyle = '#000000';
        ctx.fillRect(-config.width / 2 + 2, config.height / 2 - 8, config.width - 4, 6);
        ctx.fillRect(-config.width / 2 + 2, -config.height / 2 + 2, config.width - 4, 6);
      }
    }));
    entity.addComponent('vehicleController', new VehicleController({
      type: vehicleType,
      acceleration: config.acceleration,
      turnSpeed: config.turnSpeed,
      maxSpeed: config.maxSpeed
    }));
    entity.addComponent('health', new Health(config.health));

    entity.addTag('vehicle');
    entity.addTag('damageable');
    entity.vehicleType = vehicleType;

    return entity;
  }
}
