export class Map {
  constructor(width, height, tileSize = 32) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.tilesX = Math.ceil(width / tileSize);
    this.tilesY = Math.ceil(height / tileSize);
    this.tiles = [];
    this.collisionTiles = [];
    this.spawnPoints = [];
    this.vehicleSpawns = [];
    this.missionTriggers = [];

    this.initializeTiles();
  }

  initializeTiles() {
    for (let y = 0; y < this.tilesY; y++) {
      this.tiles[y] = [];
      this.collisionTiles[y] = [];
      for (let x = 0; x < this.tilesX; x++) {
        this.tiles[y][x] = 0;
        this.collisionTiles[y][x] = 0;
      }
    }
  }

  setTile(x, y, value) {
    if (x >= 0 && x < this.tilesX && y >= 0 && y < this.tilesY) {
      this.tiles[y][x] = value;
    }
  }

  getTile(x, y) {
    if (x >= 0 && x < this.tilesX && y >= 0 && y < this.tilesY) {
      return this.tiles[y][x];
    }
    return -1;
  }

  setCollision(x, y, value) {
    if (x >= 0 && x < this.tilesX && y >= 0 && y < this.tilesY) {
      this.collisionTiles[y][x] = value;
    }
  }

  isCollision(x, y) {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    if (tileX >= 0 && tileX < this.tilesX && tileY >= 0 && tileY < this.tilesY) {
      return this.collisionTiles[tileY][tileX] === 1;
    }
    return true;
  }

  getCollisionTilesInArea(x, y, w, h) {
    const tiles = [];
    const startX = Math.floor(x / this.tileSize);
    const startY = Math.floor(y / this.tileSize);
    const endX = Math.ceil((x + w) / this.tileSize);
    const endY = Math.ceil((y + h) / this.tileSize);

    for (let ty = startY; ty <= endY; ty++) {
      for (let tx = startX; tx <= endX; tx++) {
        if (tx >= 0 && tx < this.tilesX && ty >= 0 && ty < this.tilesY) {
          if (this.collisionTiles[ty][tx] === 1) {
            tiles.push({
              x: tx * this.tileSize,
              y: ty * this.tileSize,
              w: this.tileSize,
              h: this.tileSize
            });
          }
        }
      }
    }
    return tiles;
  }

  addSpawnPoint(x, y, type = 'player') {
    this.spawnPoints.push({ x, y, type });
  }

  addVehicleSpawn(x, y, vehicleType) {
    this.vehicleSpawns.push({ x, y, vehicleType });
  }

  addMissionTrigger(x, y, radius, missionId) {
    this.missionTriggers.push({ x, y, radius, missionId });
  }
}
