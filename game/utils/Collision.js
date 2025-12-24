export const CollisionUtils = {
  aabbVsAABB(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  },

  circleVsCircle(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distSq = dx * dx + dy * dy;
    const radiusSum = r1 + r2;
    return distSq < radiusSum * radiusSum;
  },

  circleVsAABB(cx, cy, r, x, y, w, h) {
    const closestX = Math.max(x, Math.min(cx, x + w));
    const closestY = Math.max(y, Math.min(cy, y + h));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return (dx * dx + dy * dy) < (r * r);
  },

  pointInCircle(px, py, cx, cy, r) {
    const dx = px - cx;
    const dy = py - cy;
    return (dx * dx + dy * dy) < (r * r);
  },

  pointInAABB(px, py, x, y, w, h) {
    return px >= x && px <= x + w && py >= y && py <= y + h;
  },

  raycast(x1, y1, x2, y2, obstacles) {
    for (const obs of obstacles) {
      if (this.lineIntersectsAABB(x1, y1, x2, y2, obs.x, obs.y, obs.w, obs.h)) {
        return obs;
      }
    }
    return null;
  },

  lineIntersectsAABB(x1, y1, x2, y2, rx, ry, rw, rh) {
    const left = this.lineIntersectsLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
    const right = this.lineIntersectsLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
    const top = this.lineIntersectsLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
    const bottom = this.lineIntersectsLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);
    return left || right || top || bottom;
  },

  lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
    if (denom === 0) return false;
    const ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denom;
    const ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denom;
    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
  }
};
