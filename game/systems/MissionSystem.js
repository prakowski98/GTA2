import { MathUtils } from '../utils/Math.js';
import { NPC } from '../entities/NPC.js';

export class MissionSystem {
  constructor(entityManager, map) {
    this.entityManager = entityManager;
    this.map = map;
    this.missions = [];
    this.currentMission = null;
    this.completedMissions = [];
  }

  init(engine) {
    this.engine = engine;
  }

  loadMissions(missionData) {
    this.missions = missionData.map(m => ({ ...m, active: false, completed: false }));
  }

  update(dt, engine) {
    this.checkMissionTriggers();

    if (this.currentMission) {
      this.updateCurrentMission(dt, engine);
    }
  }

  checkMissionTriggers() {
    if (this.currentMission) return;

    const player = this.entityManager.getByType('player')[0];
    if (!player) return;

    const playerTransform = player.getComponent('transform');

    for (const trigger of this.map.missionTriggers) {
      const dx = trigger.x - playerTransform.x;
      const dy = trigger.y - playerTransform.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < trigger.radius) {
        const mission = this.missions.find(m => m.id === trigger.missionId && !m.completed);
        if (mission) {
          this.startMission(mission);
          break;
        }
      }
    }
  }

  startMission(mission) {
    this.currentMission = { ...mission, progress: 0, state: 'active', targets: [] };

    if (mission.type === 'delivery') {
      this.currentMission.targetX = mission.targetX;
      this.currentMission.targetY = mission.targetY;
      this.currentMission.deliveryRadius = mission.deliveryRadius || 50;
    } else if (mission.type === 'elimination') {
      this.spawnEliminationTargets(mission);
    } else if (mission.type === 'destruction') {
      this.markDestructionTargets(mission);
    }
  }

  updateCurrentMission(dt, engine) {
    const mission = this.currentMission;

    switch (mission.type) {
      case 'delivery':
        this.updateDeliveryMission(dt, engine);
        break;
      case 'elimination':
        this.updateEliminationMission(dt, engine);
        break;
      case 'destruction':
        this.updateDestructionMission(dt, engine);
        break;
    }
  }

  updateDeliveryMission(dt, engine) {
    const player = this.entityManager.getByType('player')[0];
    if (!player) return;

    const playerTransform = player.getComponent('transform');
    const dx = this.currentMission.targetX - playerTransform.x;
    const dy = this.currentMission.targetY - playerTransform.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.currentMission.deliveryRadius) {
      this.completeMission();
    }
  }

  updateEliminationMission(dt, engine) {
    const aliveTargets = this.currentMission.targets.filter(t => {
      const entity = this.entityManager.get(t);
      if (!entity) return false;
      const health = entity.getComponent('health');
      return health && !health.isDead;
    });

    this.currentMission.progress = this.currentMission.targetCount - aliveTargets.length;
    this.currentMission.targets = aliveTargets;

    if (aliveTargets.length === 0) {
      this.completeMission();
    }
  }

  updateDestructionMission(dt, engine) {
    const aliveTargets = this.currentMission.targets.filter(t => {
      const entity = this.entityManager.get(t);
      if (!entity) return false;
      const health = entity.getComponent('health');
      return health && !health.isDead;
    });

    this.currentMission.progress = this.currentMission.targetCount - aliveTargets.length;
    this.currentMission.targets = aliveTargets;

    if (aliveTargets.length === 0) {
      this.completeMission();
    }
  }

  spawnEliminationTargets(mission) {
    const spawnArea = mission.spawnArea || { x: 1000, y: 1000, w: 500, h: 500 };

    for (let i = 0; i < mission.targetCount; i++) {
      const x = MathUtils.random(spawnArea.x, spawnArea.x + spawnArea.w);
      const y = MathUtils.random(spawnArea.y, spawnArea.y + spawnArea.h);
      const npc = NPC.create(this.entityManager, x, y, mission.targetType || 'gang');
      this.currentMission.targets.push(npc.id);
    }
  }

  markDestructionTargets(mission) {
    const vehicles = this.entityManager.getByType('vehicle');
    const targets = vehicles.slice(0, mission.targetCount);
    this.currentMission.targets = targets.map(v => v.id);
    this.currentMission.targetCount = targets.length;
  }

  completeMission() {
    const originalMission = this.missions.find(m => m.id === this.currentMission.id);
    if (originalMission) {
      originalMission.completed = true;
      this.completedMissions.push(originalMission.id);
    }

    this.currentMission = null;
  }

  failMission() {
    this.currentMission = null;
  }

  getCurrentMissionInfo() {
    if (!this.currentMission) return null;

    return {
      title: this.currentMission.title,
      description: this.currentMission.description,
      progress: this.currentMission.progress,
      targetCount: this.currentMission.targetCount,
      type: this.currentMission.type
    };
  }
}
