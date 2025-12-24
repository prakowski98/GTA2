import { MathUtils } from '../utils/Math.js';
import { Projectile } from '../entities/Projectile.js';

export class AISystem {
  constructor(entityManager) {
    this.entityManager = entityManager;
  }

  init(engine) {
    this.engine = engine;
  }

  update(dt, engine) {
    const npcs = this.entityManager.getByType('npc');
    const player = this.entityManager.getByType('player')[0];

    if (!player) return;

    const playerTransform = player.getComponent('transform');

    for (const npc of npcs) {
      const transform = npc.getComponent('transform');
      const physics = npc.getComponent('physics');
      const ai = npc.getComponent('ai');
      const health = npc.getComponent('health');

      if (!transform || !physics || !ai) continue;

      if (health && health.isDead) {
        physics.vx *= 0.9;
        physics.vy *= 0.9;
        continue;
      }

      ai.stateTimer += dt;

      switch (ai.state) {
        case 'idle':
          this.updateIdle(npc, transform, physics, ai, playerTransform, dt);
          break;
        case 'patrol':
          this.updatePatrol(npc, transform, physics, ai, dt);
          break;
        case 'alert':
          this.updateAlert(npc, transform, physics, ai, playerTransform, dt);
          break;
        case 'chase':
          this.updateChase(npc, transform, physics, ai, playerTransform, dt);
          break;
        case 'attack':
          this.updateAttack(npc, transform, physics, ai, playerTransform, dt, engine);
          break;
        case 'flee':
          this.updateFlee(npc, transform, physics, ai, playerTransform, dt);
          break;
      }
    }
  }

  updateIdle(npc, transform, physics, ai, playerTransform, dt) {
    if (ai.stateTimer > 3) {
      if (Math.random() < 0.5 && ai.type === 'civilian') {
        ai.setState('patrol');
        ai.targetX = transform.x + MathUtils.random(-200, 200);
        ai.targetY = transform.y + MathUtils.random(-200, 200);
      }
    }

    this.checkPlayerDetection(npc, transform, ai, playerTransform);
  }

  updatePatrol(npc, transform, physics, ai, dt) {
    const dx = ai.targetX - transform.x;
    const dy = ai.targetY - transform.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 20) {
      ai.setState('idle');
      return;
    }

    const nx = dx / distance;
    const ny = dy / distance;

    physics.applyForce(nx * ai.speed, ny * ai.speed);
    transform.rotation = Math.atan2(ny, nx);

    this.checkPlayerDetection(npc, transform, ai, this.getPlayerTransform());
  }

  updateAlert(npc, transform, physics, ai, playerTransform, dt) {
    ai.detectionLevel += dt;

    if (ai.detectionLevel > 1.0) {
      ai.setState('chase');
      ai.target = playerTransform;
      return;
    }

    const canSee = ai.canSee(
      transform.x, transform.y, transform.rotation,
      playerTransform.x, playerTransform.y
    );

    if (!canSee) {
      ai.detectionLevel -= dt * 0.5;
      if (ai.detectionLevel <= 0) {
        ai.setState('idle');
        ai.detectionLevel = 0;
      }
    }
  }

  updateChase(npc, transform, physics, ai, playerTransform, dt) {
    const dx = playerTransform.x - transform.x;
    const dy = playerTransform.y - transform.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ai.attackRadius && (ai.type === 'police' || ai.type === 'gang')) {
      ai.setState('attack');
      return;
    }

    if (distance > ai.alertRadius * 2) {
      ai.setState('idle');
      ai.detectionLevel = 0;
      return;
    }

    const nx = dx / distance;
    const ny = dy / distance;

    physics.applyForce(nx * ai.speed * 1.5, ny * ai.speed * 1.5);
    transform.rotation = Math.atan2(ny, nx);
  }

  updateAttack(npc, transform, physics, ai, playerTransform, dt, engine) {
    const dx = playerTransform.x - transform.x;
    const dy = playerTransform.y - transform.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    transform.rotation = Math.atan2(dy, dx);

    if (distance > ai.attackRadius * 1.5) {
      ai.setState('chase');
      return;
    }

    if (ai.stateTimer > 1.0) {
      this.npcShoot(npc, transform, engine);
      ai.stateTimer = 0;
    }

    physics.vx *= 0.9;
    physics.vy *= 0.9;
  }

  updateFlee(npc, transform, physics, ai, playerTransform, dt) {
    const dx = transform.x - playerTransform.x;
    const dy = transform.y - playerTransform.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > ai.alertRadius * 2) {
      ai.setState('idle');
      return;
    }

    const nx = dx / distance;
    const ny = dy / distance;

    physics.applyForce(nx * ai.speed * 2, ny * ai.speed * 2);
    transform.rotation = Math.atan2(ny, nx);
  }

  checkPlayerDetection(npc, transform, ai, playerTransform) {
    if (!playerTransform || ai.type === 'civilian') return;

    const dx = playerTransform.x - transform.x;
    const dy = playerTransform.y - transform.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ai.alertRadius) {
      const canSee = ai.canSee(
        transform.x, transform.y, transform.rotation,
        playerTransform.x, playerTransform.y
      );

      if (canSee) {
        ai.setState('alert');
      }
    }
  }

  getPlayerTransform() {
    const player = this.entityManager.getByType('player')[0];
    return player ? player.getComponent('transform') : null;
  }

  npcShoot(npc, transform, engine) {
    Projectile.create(
      this.entityManager,
      transform.x,
      transform.y,
      transform.rotation,
      npc,
      15
    );
  }
}
