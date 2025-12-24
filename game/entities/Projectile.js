import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Renderable } from '../components/Renderable.js';

export class Projectile {
  static create(entityManager, x, y, angle, owner, damage = 10) {
    const entity = entityManager.create('projectile');

    const speed = 800;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    entity.addComponent('transform', new Transform(x, y, angle));

    const physics = new Physics({
      mass: 0.1,
      friction: 1.0,
      maxSpeed: 1000,
      collider: { type: 'circle', radius: 3 },
      layer: 'projectile'
    });
    physics.vx = vx;
    physics.vy = vy;
    entity.addComponent('physics', physics);

    entity.addComponent('renderable', new Renderable({
      type: 'circle',
      radius: 3,
      color: '#ffff00',
      layer: 10
    }));

    entity.addTag('projectile');
    entity.owner = owner;
    entity.damage = damage;
    entity.lifetime = 2.0;

    return entity;
  }

  static update(entity, dt) {
    entity.lifetime -= dt;
    if (entity.lifetime <= 0) {
      entity.destroy();
    }
  }
}
