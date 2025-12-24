import { Map } from './Map.js';
import { MathUtils } from '../utils/Math.js';

export class WorldGenerator {
  static generate(width = 4096, height = 4096) {
    const map = new Map(width, height, 32);

    this.generateDistricts(map);
    this.generateRoads(map);
    this.generateBuildings(map);
    this.generateSpawnPoints(map);

    return map;
  }

  static generateDistricts(map) {
    for (let y = 0; y < map.tilesY; y++) {
      for (let x = 0; x < map.tilesX; x++) {
        const colorX = x < map.tilesX / 2 ? 0 : 1;
        const colorY = y < map.tilesY / 2 ? 0 : 2;
        map.tiles[y][x] = colorX + colorY + 1;
      }
    }
  }

  static generateRoads(map) {
    const roadWidth = 3;
    const roadSpacing = 15;

    for (let x = 0; x < map.tilesX; x += roadSpacing) {
      for (let y = 0; y < map.tilesY; y++) {
        for (let w = 0; w < roadWidth; w++) {
          const tx = x + w;
          if (tx < map.tilesX) {
            map.tiles[y][tx] = 5;
            map.collisionTiles[y][tx] = 0;
          }
        }
      }
    }

    for (let y = 0; y < map.tilesY; y += roadSpacing) {
      for (let x = 0; x < map.tilesX; x++) {
        for (let w = 0; w < roadWidth; w++) {
          const ty = y + w;
          if (ty < map.tilesY) {
            map.tiles[ty][x] = 5;
            map.collisionTiles[ty][x] = 0;
          }
        }
      }
    }
  }

  static generateBuildings(map) {
    const blockSize = 15;
    const buildingPadding = 1;

    for (let by = 0; by < map.tilesY; by += blockSize) {
      for (let bx = 0; bx < map.tilesX; bx += blockSize) {
        if (map.tiles[by][bx] === 5) continue;

        const buildingWidth = MathUtils.randomInt(3, 8);
        const buildingHeight = MathUtils.randomInt(3, 8);
        const startX = bx + buildingPadding;
        const startY = by + buildingPadding;
        const endX = Math.min(startX + buildingWidth, map.tilesX);
        const endY = Math.min(startY + buildingHeight, map.tilesY);

        for (let ty = startY; ty < endY; ty++) {
          for (let tx = startX; tx < endX; tx++) {
            map.tiles[ty][tx] = 6;
            map.collisionTiles[ty][tx] = 1;
          }
        }
      }
    }
  }

  static generateSpawnPoints(map) {
    map.addSpawnPoint(map.width / 2, map.height / 2, 'player');

    for (let i = 0; i < 20; i++) {
      const x = MathUtils.random(100, map.width - 100);
      const y = MathUtils.random(100, map.height - 100);
      if (!map.isCollision(x, y)) {
        map.addSpawnPoint(x, y, 'npc');
      }
    }

    const vehicleTypes = ['car', 'truck', 'sports'];
    for (let i = 0; i < 15; i++) {
      const x = MathUtils.random(100, map.width - 100);
      const y = MathUtils.random(100, map.height - 100);
      if (!map.isCollision(x, y)) {
        const type = vehicleTypes[MathUtils.randomInt(0, vehicleTypes.length - 1)];
        map.addVehicleSpawn(x, y, type);
      }
    }

    map.addMissionTrigger(500, 500, 50, 'mission_1');
    map.addMissionTrigger(1500, 1500, 50, 'mission_2');
    map.addMissionTrigger(3000, 3000, 50, 'mission_3');
  }
}
