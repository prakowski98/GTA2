export class Entity {
  constructor(id, type = 'entity') {
    this.id = id;
    this.type = type;
    this.active = true;
    this.markedForDeath = false;
    this.components = new Map();
    this.tags = new Set();
  }

  addComponent(name, component) {
    this.components.set(name, component);
    return this;
  }

  getComponent(name) {
    return this.components.get(name);
  }

  hasComponent(name) {
    return this.components.has(name);
  }

  removeComponent(name) {
    this.components.delete(name);
    return this;
  }

  addTag(tag) {
    this.tags.add(tag);
    return this;
  }

  hasTag(tag) {
    return this.tags.has(tag);
  }

  destroy() {
    this.markedForDeath = true;
  }
}
