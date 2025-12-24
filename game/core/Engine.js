import { GameLoop } from './GameLoop.js';
import { Time } from './Time.js';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.time = new Time();
    this.systems = [];
    this.renderSystems = [];
    this.gameLoop = new GameLoop(
      (dt) => this.update(dt),
      (alpha) => this.render(alpha)
    );
    this.state = {};
  }

  addSystem(system) {
    this.systems.push(system);
    if (system.init) {
      system.init(this);
    }
  }

  addRenderSystem(system) {
    this.renderSystems.push(system);
    if (system.init) {
      system.init(this);
    }
  }

  start() {
    this.gameLoop.start();
  }

  stop() {
    this.gameLoop.stop();
  }

  update(dt) {
    this.time.update(dt);
    for (const system of this.systems) {
      if (system.update) {
        system.update(dt, this);
      }
    }
  }

  render(alpha) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const system of this.renderSystems) {
      if (system.render) {
        system.render(this.ctx, alpha, this);
      }
    }
  }
}
