import { SpatialGrid } from '../utils/SpatialGrid.js';
import { CollisionUtils } from '../utils/Collision.js';

export class PhysicsSystem {
  constructor(entityManager, map) {
    this.entityManager = entityManager;
    this.map = map;
    this.spatialGrid = new SpatialGrid(256);
    this.gravity = 0;
  }

  init(engine) {
    this.engine = engine;
  }

  update(dt, engine) {
    const entities = this.entityManager.getAllActive();

    for (const entity of entities) {
      const transform = entity.getComponent('transform');
      const physics = entity.getComponent('physics');

      if (!transform || !physics) continue;

      transform.saveState();

      physics.update(dt);

      if (!physics.isStatic) {
        transform.x += physics.vx * dt;
        transform.y += physics.vy * dt;
      }
    }

    this.handleCollisions(entities);
  }

  handleCollisions(entities) {
    this.spatialGrid.clear();

    for (const entity of entities) {
      const transform = entity.getComponent('transform');
      const physics = entity.getComponent('physics');
      if (!transform || !physics) continue;

      const collider = physics.collider;
      if (collider.type === 'circle') {
        this.spatialGrid.insert(entity,
          transform.x - collider.radius,
          transform.y - collider.radius,
          collider.radius * 2,
          collider.radius * 2
        );
      } else if (collider.type === 'rect') {
        this.spatialGrid.insert(entity,
          transform.x - collider.width / 2,
          transform.y - collider.height / 2,
          collider.width,
          collider.height
        );
      }
    }

    for (const entity of entities) {
      const transform = entity.getComponent('transform');
      const physics = entity.getComponent('physics');
      if (!transform || !physics) continue;

      this.resolveWorldCollision(entity, transform, physics);

      const collider = physics.collider;
      const nearby = this.spatialGrid.query(
        transform.x - 100,
        transform.y - 100,
        200,
        200
      );

      for (const other of nearby) {
        if (entity.id >= other.id) continue;

        const otherTransform = other.getComponent('transform');
        const otherPhysics = other.getComponent('physics');
        if (!otherTransform || !otherPhysics) continue;

        this.resolveEntityCollision(
          entity, transform, physics,
          other, otherTransform, otherPhysics
        );
      }
    }
  }

  resolveWorldCollision(entity, transform, physics) {
    if (physics.layer === 'projectile') return;

    const collider = physics.collider;
    const tiles = this.map.getCollisionTilesInArea(
      transform.x - 50,
      transform.y - 50,
      100,
      100
    );

    for (const tile of tiles) {
      if (collider.type === 'circle') {
        if (CollisionUtils.circleVsAABB(
          transform.x, transform.y, collider.radius,
          tile.x, tile.y, tile.w, tile.h
        )) {
          const closestX = Math.max(tile.x, Math.min(transform.x, tile.x + tile.w));
          const closestY = Math.max(tile.y, Math.min(transform.y, tile.y + tile.h));
          const dx = transform.x - closestX;
          const dy = transform.y - closestY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < collider.radius && distance > 0) {
            const overlap = collider.radius - distance;
            const nx = dx / distance;
            const ny = dy / distance;
            transform.x += nx * overlap;
            transform.y += ny * overlap;
            physics.vx *= 0.5;
            physics.vy *= 0.5;
          }
        }
      }
    }
  }

  resolveEntityCollision(e1, t1, p1, e2, t2, p2) {
    const c1 = p1.collider;
    const c2 = p2.collider;

    let colliding = false;

    if (c1.type === 'circle' && c2.type === 'circle') {
      colliding = CollisionUtils.circleVsCircle(
        t1.x, t1.y, c1.radius,
        t2.x, t2.y, c2.radius
      );

      if (colliding) {
        const dx = t2.x - t1.x;
        const dy = t2.y - t1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const overlap = c1.radius + c2.radius - distance;

        if (overlap > 0 && distance > 0) {
          const nx = dx / distance;
          const ny = dy / distance;

          if (!p1.isStatic && !p2.isStatic) {
            t1.x -= nx * overlap * 0.5;
            t1.y -= ny * overlap * 0.5;
            t2.x += nx * overlap * 0.5;
            t2.y += ny * overlap * 0.5;

            const relVelX = p2.vx - p1.vx;
            const relVelY = p2.vy - p1.vy;
            const impulse = (relVelX * nx + relVelY * ny) * 0.5;

            p1.vx += nx * impulse;
            p1.vy += ny * impulse;
            p2.vx -= nx * impulse;
            p2.vy -= ny * impulse;
          } else if (!p1.isStatic) {
            t1.x -= nx * overlap;
            t1.y -= ny * overlap;
            p1.vx *= 0.5;
            p1.vy *= 0.5;
          } else if (!p2.isStatic) {
            t2.x += nx * overlap;
            t2.y += ny * overlap;
            p2.vx *= 0.5;
            p2.vy *= 0.5;
          }
        }
      }
    }

    if (colliding) {
      if (e1.hasTag('projectile') && e2.hasTag('damageable')) {
        this.handleProjectileHit(e1, e2);
      } else if (e2.hasTag('projectile') && e1.hasTag('damageable')) {
        this.handleProjectileHit(e2, e1);
      }
    }
  }

  handleProjectileHit(projectile, target) {
    const health = target.getComponent('health');
    if (health) {
      health.damage(projectile.damage || 10);
    }
    projectile.destroy();
  }
}
