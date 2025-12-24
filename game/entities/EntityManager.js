import { Entity } from './Entity.js';

export class EntityManager {
  constructor() {
    this.entities = new Map();
    this.nextId = 1;
    this.entitiesByType = new Map();
    this.entitiesByTag = new Map();
  }

  create(type = 'entity') {
    const entity = new Entity(this.nextId++, type);
    this.entities.set(entity.id, entity);

    if (!this.entitiesByType.has(type)) {
      this.entitiesByType.set(type, []);
    }
    this.entitiesByType.get(type).push(entity);

    return entity;
  }

  get(id) {
    return this.entities.get(id);
  }

  getByType(type) {
    return this.entitiesByType.get(type) || [];
  }

  getByTag(tag) {
    return this.entitiesByTag.get(tag) || [];
  }

  getAll() {
    return Array.from(this.entities.values());
  }

  getAllActive() {
    return Array.from(this.entities.values()).filter(e => e.active);
  }

  destroy(id) {
    const entity = this.entities.get(id);
    if (!entity) return;
    entity.markedForDeath = true;
  }

  update() {
    const toRemove = [];
    for (const entity of this.entities.values()) {
      if (entity.markedForDeath) {
        toRemove.push(entity.id);
      }
    }

    for (const id of toRemove) {
      const entity = this.entities.get(id);
      this.entities.delete(id);

      const typeList = this.entitiesByType.get(entity.type);
      if (typeList) {
        const index = typeList.indexOf(entity);
        if (index !== -1) typeList.splice(index, 1);
      }

      for (const tag of entity.tags) {
        const tagList = this.entitiesByTag.get(tag);
        if (tagList) {
          const index = tagList.indexOf(entity);
          if (index !== -1) tagList.splice(index, 1);
        }
      }
    }
  }

  clear() {
    this.entities.clear();
    this.entitiesByType.clear();
    this.entitiesByTag.clear();
    this.nextId = 1;
  }
}
