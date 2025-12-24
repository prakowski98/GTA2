import { NPC } from '../entities/NPC.js';
import { MathUtils } from '../utils/Math.js';

export class WantedSystem {
  constructor(entityManager, map) {
    this.entityManager = entityManager;
    this.map = map;
    this.heatLevel = 0;
    this.maxHeat = 5;
    this.decayRate = 0.1;
    this.policeSpawnTimer = 0;
    this.policeSpawnInterval = 5;
  }

  init(engine) {
    this.engine = engine;
  }

  update(dt, engine) {
    if (this.heatLevel > 0) {
      this.heatLevel -= this.decayRate * dt;
      this.heatLevel = Math.max(0, this.heatLevel);
    }

    if (this.heatLevel >= 1) {
      this.policeSpawnTimer += dt;
      if (this.policeSpawnTimer >= this.policeSpawnInterval / this.heatLevel) {
        this.spawnPolice(engine);
        this.policeSpawnTimer = 0;
      }
    }

    this.updatePoliceAggression();
  }

  addHeat(amount) {
    this.heatLevel = Math.min(this.maxHeat, this.heatLevel + amount);
  }

  witnessEvent(x, y, severity, engine) {
    const npcs = this.entityManager.getByType('npc');
    let witnessed = false;

    for (const npc of npcs) {
      if (npc.npcType !== 'civilian') continue;

      const transform = npc.getComponent('transform');
      const dx = x - transform.x;
      const dy = y - transform.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 200) {
        witnessed = true;
        break;
      }
    }

    if (witnessed) {
      this.addHeat(severity);
    } else {
      this.addHeat(severity * 0.3);
    }
  }

  spawnPolice(engine) {
    const player = this.entityManager.getByType('player')[0];
    if (!player) return;

    const playerTransform = player.getComponent('transform');
    const spawnDistance = 400;

    const angle = MathUtils.random(0, Math.PI * 2);
    const spawnX = playerTransform.x + Math.cos(angle) * spawnDistance;
    const spawnY = playerTransform.y + Math.sin(angle) * spawnDistance;

    if (!this.map.isCollision(spawnX, spawnY)) {
      const police = NPC.create(this.entityManager, spawnX, spawnY, 'police');
      const ai = police.getComponent('ai');
      ai.setState('chase');
      ai.target = playerTransform;
    }
  }

  updatePoliceAggression() {
    const police = this.entityManager.getByType('npc').filter(n => n.npcType === 'police');

    for (const cop of police) {
      const ai = cop.getComponent('ai');
      if (!ai) continue;

      ai.attackRadius = 100 + this.heatLevel * 20;
      ai.alertRadius = 200 + this.heatLevel * 50;
    }
  }

  onPlayerShoot() {
    this.addHeat(0.3);
  }

  onNPCKilled(npcType) {
    if (npcType === 'civilian') {
      this.addHeat(1.5);
    } else if (npcType === 'police') {
      this.addHeat(2.0);
    } else {
      this.addHeat(0.5);
    }
  }

  onVehicleStolen() {
    this.addHeat(0.5);
  }

  onPropertyDamage() {
    this.addHeat(0.2);
  }
}
