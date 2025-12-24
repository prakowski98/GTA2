export class SpatialGrid {
  constructor(cellSize = 256) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  clear() {
    this.grid.clear();
  }

  insert(entity, x, y, w, h) {
    const cells = this.getCells(x, y, w, h);
    for (const key of cells) {
      if (!this.grid.has(key)) {
        this.grid.set(key, []);
      }
      this.grid.get(key).push(entity);
    }
  }

  query(x, y, w, h) {
    const cells = this.getCells(x, y, w, h);
    const results = new Set();
    for (const key of cells) {
      const entities = this.grid.get(key);
      if (entities) {
        for (const entity of entities) {
          results.add(entity);
        }
      }
    }
    return Array.from(results);
  }

  getCells(x, y, w, h) {
    const cells = [];
    const startX = Math.floor(x / this.cellSize);
    const startY = Math.floor(y / this.cellSize);
    const endX = Math.floor((x + w) / this.cellSize);
    const endY = Math.floor((y + h) / this.cellSize);

    for (let cy = startY; cy <= endY; cy++) {
      for (let cx = startX; cx <= endX; cx++) {
        cells.push(`${cx},${cy}`);
      }
    }
    return cells;
  }
}
