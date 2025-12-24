export class AIBehavior {
  constructor(type = 'civilian') {
    this.type = type;
    this.state = 'idle';
    this.target = null;
    this.targetX = 0;
    this.targetY = 0;
    this.alertRadius = 200;
    this.attackRadius = 100;
    this.visionAngle = Math.PI / 2;
    this.visionRange = 300;
    this.stateTimer = 0;
    this.patrolPoints = [];
    this.currentPatrolIndex = 0;
    this.speed = 100;
    this.detectionLevel = 0;
  }

  setState(newState) {
    this.state = newState;
    this.stateTimer = 0;
  }

  canSee(fromX, fromY, fromAngle, targetX, targetY) {
    const dx = targetX - fromX;
    const dy = targetY - fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.visionRange) return false;

    const angleToTarget = Math.atan2(dy, dx);
    let angleDiff = angleToTarget - fromAngle;

    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    return Math.abs(angleDiff) < this.visionAngle;
  }
}
