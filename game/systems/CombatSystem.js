import { Projectile } from '../entities/Projectile.js';
import { Player } from '../entities/Player.js';

export class CombatSystem {
  constructor(entityManager) {
    this.entityManager = entityManager;
  }

  init(engine) {
    this.engine = engine;
  }

  update(dt, engine) {
    const projectiles = this.entityManager.getByType('projectile');

    for (const projectile of projectiles) {
      Projectile.update(projectile, dt);
    }

    this.checkDeaths();
  }

  checkDeaths() {
    const entities = this.entityManager.getAllActive();

    for (const entity of entities) {
      const health = entity.getComponent('health');
      if (!health || !health.isDead) continue;

      if (entity.type === 'player') {
        this.handlePlayerDeath(entity);
      } else if (entity.type === 'npc') {
        this.handleNPCDeath(entity);
      } else if (entity.type === 'vehicle') {
        this.handleVehicleDeath(entity);
      }
    }
  }

  handlePlayerDeath(player) {
    const wantedSystem = this.engine.state.wantedSystem;
    if (wantedSystem) {
      wantedSystem.heatLevel = 0;
    }

    setTimeout(() => {
      const health = player.getComponent('health');
      health.reset();

      const transform = player.getComponent('transform');
      const spawn = this.engine.state.map.spawnPoints.find(s => s.type === 'player');
      if (spawn) {
        transform.x = spawn.x;
        transform.y = spawn.y;
      }

      const physics = player.getComponent('physics');
      physics.vx = 0;
      physics.vy = 0;

      player.state = 'idle';
    }, 3000);
  }

  handleNPCDeath(npc) {
    setTimeout(() => {
      npc.destroy();
    }, 5000);
  }

  handleVehicleDeath(vehicle) {
    const vehicleController = vehicle.getComponent('vehicleController');
    if (vehicleController && vehicleController.driver) {
      Player.exitVehicle(vehicleController.driver, this.engine);
    }

    setTimeout(() => {
      vehicle.destroy();
    }, 10000);
  }
}
