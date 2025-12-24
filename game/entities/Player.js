import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Renderable } from '../components/Renderable.js';
import { Health } from '../components/Health.js';
import { Projectile } from './Projectile.js';

export class Player {
  static create(entityManager, x, y) {
    const entity = entityManager.create('player');

    entity.addComponent('transform', new Transform(x, y, 0));
    entity.addComponent('physics', new Physics({
      mass: 1,
      friction: 0.85,
      maxSpeed: 250,
      collider: { type: 'circle', radius: 12 }
    }));
    entity.addComponent('renderable', new Renderable({
      type: 'custom',
      layer: 5,
      shape: (ctx) => {
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(8, -2, 6, 4);
      }
    }));
    entity.addComponent('health', new Health(100));

    entity.addTag('player');
    entity.addTag('damageable');

    entity.state = 'idle';
    entity.currentVehicle = null;
    entity.weapon = 'pistol';
    entity.stamina = 100;
    entity.shootCooldown = 0;

    return entity;
  }

  static update(entity, input, dt, engine) {
    const transform = entity.getComponent('transform');
    const physics = entity.getComponent('physics');
    const health = entity.getComponent('health');

    if (health.isDead) {
      entity.state = 'dead';
      return;
    }

    if (entity.shootCooldown > 0) {
      entity.shootCooldown -= dt;
    }

    if (entity.currentVehicle) {
      this.updateDriving(entity, input, dt, engine);
    } else {
      this.updateOnFoot(entity, input, dt, engine);
    }
  }

  static updateOnFoot(entity, input, dt, engine) {
    const transform = entity.getComponent('transform');
    const physics = entity.getComponent('physics');

    const moveX = input.getAxis('KeyA', 'KeyD');
    const moveY = input.getAxis('KeyW', 'KeyS');

    const isRunning = input.isKeyDown('ShiftLeft');
    const speed = isRunning ? 300 : 150;

    if (moveX !== 0 || moveY !== 0) {
      const length = Math.sqrt(moveX * moveX + moveY * moveY);
      const normalizedX = moveX / length;
      const normalizedY = moveY / length;

      physics.applyForce(normalizedX * speed, normalizedY * speed);
      transform.rotation = Math.atan2(normalizedY, normalizedX);
      entity.state = isRunning ? 'run' : 'walk';
    } else {
      entity.state = 'idle';
    }

    if (input.isKeyDown('Space') && entity.shootCooldown <= 0) {
      this.shoot(entity, engine);
      entity.shootCooldown = 0.3;
    }

    if (input.isKeyPressed('KeyE')) {
      this.tryEnterVehicle(entity, engine);
    }
  }

  static updateDriving(entity, input, dt, engine) {
    const vehicle = entity.currentVehicle;
    const vehicleTransform = vehicle.getComponent('transform');
    const vehiclePhysics = vehicle.getComponent('physics');
    const vehicleController = vehicle.getComponent('vehicleController');

    const moveY = input.getAxis('KeyS', 'KeyW');
    const moveX = input.getAxis('KeyA', 'KeyD');

    if (moveY !== 0) {
      const forwardX = Math.cos(vehicleTransform.rotation);
      const forwardY = Math.sin(vehicleTransform.rotation);
      vehiclePhysics.applyForce(
        forwardX * vehicleController.acceleration * moveY,
        forwardY * vehicleController.acceleration * moveY
      );
    }

    if (moveX !== 0) {
      vehicleTransform.rotation += moveX * vehicleController.turnSpeed * dt;
    }

    if (input.isKeyPressed('KeyE')) {
      this.exitVehicle(entity, engine);
    }

    const transform = entity.getComponent('transform');
    transform.x = vehicleTransform.x;
    transform.y = vehicleTransform.y;
    transform.rotation = vehicleTransform.rotation;
  }

  static shoot(entity, engine) {
    const transform = entity.getComponent('transform');
    Projectile.create(
      engine.state.entityManager,
      transform.x,
      transform.y,
      transform.rotation,
      entity,
      20
    );
  }

  static tryEnterVehicle(entity, engine) {
    const transform = entity.getComponent('transform');
    const vehicles = engine.state.entityManager.getByType('vehicle');

    for (const vehicle of vehicles) {
      const vehicleTransform = vehicle.getComponent('transform');
      const vehicleController = vehicle.getComponent('vehicleController');

      if (vehicleController.occupied) continue;

      const dx = vehicleTransform.x - transform.x;
      const dy = vehicleTransform.y - transform.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < vehicleController.enterRadius) {
        vehicleController.enter(entity);
        entity.currentVehicle = vehicle;
        entity.state = 'driving';
        entity.getComponent('renderable').visible = false;
        return;
      }
    }
  }

  static exitVehicle(entity, engine) {
    if (!entity.currentVehicle) return;

    const vehicleController = entity.currentVehicle.getComponent('vehicleController');
    const vehicleTransform = entity.currentVehicle.getComponent('transform');
    const transform = entity.getComponent('transform');

    vehicleController.exit();

    const exitX = Math.cos(vehicleTransform.rotation + Math.PI / 2) * 40;
    const exitY = Math.sin(vehicleTransform.rotation + Math.PI / 2) * 40;
    transform.x = vehicleTransform.x + exitX;
    transform.y = vehicleTransform.y + exitY;

    entity.currentVehicle = null;
    entity.state = 'idle';
    entity.getComponent('renderable').visible = true;
  }
}
