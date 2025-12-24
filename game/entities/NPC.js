import { Transform } from '../components/Transform.js';
import { Physics } from '../components/Physics.js';
import { Renderable } from '../components/Renderable.js';
import { Health } from '../components/Health.js';
import { AIBehavior } from '../components/AIBehavior.js';

export class NPC {
  static create(entityManager, x, y, type = 'civilian') {
    const entity = entityManager.create('npc');

    entity.addComponent('transform', new Transform(x, y, 0));
    entity.addComponent('physics', new Physics({
      mass: 1,
      friction: 0.85,
      maxSpeed: type === 'police' ? 280 : 150,
      collider: { type: 'circle', radius: 12 }
    }));

    const colors = {
      civilian: '#888888',
      police: '#0000ff',
      gang: '#ff0000'
    };

    entity.addComponent('renderable', new Renderable({
      type: 'circle',
      radius: 12,
      color: colors[type] || '#888888',
      layer: 5
    }));

    entity.addComponent('health', new Health(type === 'police' ? 80 : 50));

    const ai = new AIBehavior(type);
    if (type === 'police') {
      ai.speed = 200;
      ai.alertRadius = 300;
      ai.attackRadius = 150;
    } else if (type === 'gang') {
      ai.speed = 120;
      ai.alertRadius = 200;
      ai.attackRadius = 120;
    } else {
      ai.speed = 100;
      ai.alertRadius = 100;
      ai.attackRadius = 0;
    }
    entity.addComponent('ai', ai);

    entity.addTag('npc');
    entity.addTag('damageable');
    entity.npcType = type;

    return entity;
  }
}
