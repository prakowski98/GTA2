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
    const districts = [
      { x: 0, y: 0, w: map.tilesX / 2, h: map.tilesY / 2, color: 1 },
      { x: map.tilesX / 2, y: 0, w: map.tilesX / 2, h: map.tilesY / 2, color: 2 },
      { x: 0, y: map.tilesY / 2, w: map.tilesX / 2, h: map.tilesY / 2, color: 3 },
      { x: map.tilesX / 2, y: map.tilesY / 2, w: map.tilesX / 2, h: map.tilesY / 2, color: 4 }
    ];

    for (const district of districts) {
      for (let y = district.y; y < district.y + district.h; y++) {
        for (let x = district.x; x < district.x + district.w; x++) {
          map.setTile(Math.floor(x), Math.floor(y), district.color);
        }
      }
    }
  }

  static generateRoads(map) {
    const roadWidth = 3;
    const roadSpacing = 15;

    for (let x = 0; x < map.tilesX; x += roadSpacing) {
      for (let y = 0; y < map.tilesY; y++) {
        for (let w = 0; w < roadWidth; w++) {
          map.setTile(x + w, y, 5);
          map.setCollision(x + w, y, 0);
        }
      }
    }

    for (let y = 0; y < map.tilesY; y += roadSpacing) {
      for (let x = 0; x < map.tilesX; x++) {
        for (let w = 0; w < roadWidth; w++) {
          map.setTile(x, y + w, 5);
          map.setCollision(x, y + w, 0);
        }
      }
    }
  }

  static generateBuildings(map) {
    const blockSize = 15;
    const buildingPadding = 1;

    for (let by = 0; by < map.tilesY; by += blockSize) {
      for (let bx = 0; bx < map.tilesX; bx += blockSize) {
        const isRoad = map.getTile(bx, by) === 5;
        if (isRoad) continue;

        const buildingWidth = MathUtils.randomInt(3, 8);
        const buildingHeight = MathUtils.randomInt(3, 8);
        const startX = bx + buildingPadding;
        const startY = by + buildingPadding;

        for (let y = 0; y < buildingHeight; y++) {
          for (let x = 0; x < buildingWidth; x++) {
            const tx = startX + x;
            const ty = startY + y;
            if (tx < map.tilesX && ty < map.tilesY) {
              map.setTile(tx, ty, 6);
              map.setCollision(tx, ty, 1);
            }
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
