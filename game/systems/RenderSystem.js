export class RenderSystem {
  constructor(entityManager, map, camera) {
    this.entityManager = entityManager;
    this.map = map;
    this.camera = camera;
    this.tileColors = {
      0: '#2d2d2d',
      1: '#3a3a3a',
      2: '#404040',
      3: '#353535',
      4: '#3d3d3d',
      5: '#555555',
      6: '#666666'
    };
  }

  init(engine) {
    this.engine = engine;
  }

  render(ctx, alpha, engine) {
    this.renderMap(ctx);
    this.renderEntities(ctx, alpha);
  }

  renderMap(ctx) {
    this.camera.apply(ctx);

    const startX = Math.floor(this.camera.x / this.map.tileSize);
    const startY = Math.floor(this.camera.y / this.map.tileSize);
    const endX = Math.ceil((this.camera.x + this.camera.width) / this.map.tileSize);
    const endY = Math.ceil((this.camera.y + this.camera.height) / this.map.tileSize);

    for (let y = Math.max(0, startY); y < Math.min(this.map.tilesY, endY); y++) {
      for (let x = Math.max(0, startX); x < Math.min(this.map.tilesX, endX); x++) {
        const tile = this.map.getTile(x, y);
        ctx.fillStyle = this.tileColors[tile] || '#000000';
        ctx.fillRect(
          x * this.map.tileSize,
          y * this.map.tileSize,
          this.map.tileSize,
          this.map.tileSize
        );
      }
    }

    this.camera.restore(ctx);
  }

  renderEntities(ctx, alpha) {
    const entities = this.entityManager.getAllActive();
    const renderList = [];

    for (const entity of entities) {
      const transform = entity.getComponent('transform');
      const renderable = entity.getComponent('renderable');

      if (!transform || !renderable || !renderable.visible) continue;
      if (!this.camera.isVisible(transform.x, transform.y, 100)) continue;

      renderList.push({ entity, transform, renderable });
    }

    renderList.sort((a, b) => a.renderable.layer - b.renderable.layer);

    this.camera.apply(ctx);

    for (const { transform, renderable } of renderList) {
      const interpolated = transform.interpolate(alpha);
      renderable.render(ctx, interpolated.x, interpolated.y, interpolated.rotation);
    }

    this.camera.restore(ctx);
  }
}
