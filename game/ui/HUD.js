export class HUD {
  constructor(entityManager) {
    this.entityManager = entityManager;
  }

  init(engine) {
    this.engine = engine;
  }

  render(ctx, alpha, engine) {
    const player = this.entityManager.getByType('player')[0];
    if (!player) return;

    const health = player.getComponent('health');
    const wantedSystem = engine.state.wantedSystem;
    const missionSystem = engine.state.missionSystem;

    this.renderHealth(ctx, health);
    this.renderWeapon(ctx, player);
    this.renderHeat(ctx, wantedSystem);
    this.renderMission(ctx, missionSystem);
    this.renderMinimap(ctx, engine);
    this.renderControls(ctx);
  }

  renderHealth(ctx, health) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 220, 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Zdrowie:', 20, 30);

    const healthPercent = health.current / health.max;
    const healthWidth = 120;

    ctx.fillStyle = '#333333';
    ctx.fillRect(20, 35, healthWidth, 10);

    if (healthPercent > 0.6) {
      ctx.fillStyle = '#00ff00';
    } else if (healthPercent > 0.3) {
      ctx.fillStyle = '#ffff00';
    } else {
      ctx.fillStyle = '#ff0000';
    }

    ctx.fillRect(20, 35, healthWidth * healthPercent, 10);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${Math.ceil(health.current)}/${health.max}`, 150, 44);
  }

  renderWeapon(ctx, player) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 60, 220, 30);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`Broń: ${player.weapon || 'Pistolet'}`, 20, 80);
  }

  renderHeat(ctx, wantedSystem) {
    if (!wantedSystem) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 100, 220, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Poszukiwany:', 20, 120);

    const stars = Math.floor(wantedSystem.heatLevel);
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 20px monospace';

    for (let i = 0; i < stars; i++) {
      ctx.fillText('★', 20 + i * 25, 143);
    }
  }

  renderMission(ctx, missionSystem) {
    if (!missionSystem) return;

    const missionInfo = missionSystem.getCurrentMissionInfo();
    if (!missionInfo) return;

    const x = ctx.canvas.width - 320;
    const y = 10;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, 310, 100);

    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('MISJA', x + 10, y + 25);

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.fillText(missionInfo.title, x + 10, y + 45);

    ctx.font = '12px monospace';
    ctx.fillText(missionInfo.description, x + 10, y + 65);

    if (missionInfo.targetCount) {
      ctx.fillText(`Postęp: ${missionInfo.progress}/${missionInfo.targetCount}`, x + 10, y + 85);
    }
  }

  renderMinimap(ctx, engine) {
    const minimapSize = 150;
    const x = ctx.canvas.width - minimapSize - 10;
    const y = ctx.canvas.height - minimapSize - 10;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, minimapSize, minimapSize);

    const player = this.entityManager.getByType('player')[0];
    if (!player) return;

    const playerTransform = player.getComponent('transform');
    const camera = engine.state.camera;

    const scale = minimapSize / 1000;

    ctx.save();
    ctx.translate(x + minimapSize / 2, y + minimapSize / 2);

    const entities = this.entityManager.getAllActive();
    for (const entity of entities) {
      const transform = entity.getComponent('transform');
      if (!transform) continue;

      const dx = (transform.x - playerTransform.x) * scale;
      const dy = (transform.y - playerTransform.y) * scale;

      if (Math.abs(dx) > minimapSize / 2 || Math.abs(dy) > minimapSize / 2) continue;

      if (entity.type === 'player') {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(dx - 2, dy - 2, 4, 4);
      } else if (entity.type === 'npc') {
        if (entity.npcType === 'police') {
          ctx.fillStyle = '#0000ff';
        } else {
          ctx.fillStyle = '#888888';
        }
        ctx.fillRect(dx - 1, dy - 1, 2, 2);
      } else if (entity.type === 'vehicle') {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(dx - 2, dy - 2, 3, 3);
      }
    }

    ctx.restore();
  }

  renderControls(ctx) {
    const x = 10;
    const y = ctx.canvas.height - 120;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, 300, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText('WASD - Ruch/Jazda', x + 10, y + 20);
    ctx.fillText('SPACJA - Strzelaj', x + 10, y + 40);
    ctx.fillText('E - Wejdź/Wyjdź z pojazdu', x + 10, y + 60);
    ctx.fillText('SHIFT - Bieg', x + 10, y + 80);
    ctx.fillText('Zielone punkty - Misje', x + 10, y + 100);
  }
}
