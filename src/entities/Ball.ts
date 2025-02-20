import { Circle } from 'figures/Circle';
import {
  BALL_ELASTICITY,
  BALL_FRICTION,
  POCKET_RADIUS,
  TABLE_HEIGHT,
  TABLE_WIDTH,
} from 'share/const/game.const';

export class Ball extends Circle {
  mass: number;
  velocity = { x: 0, y: 0 };
  friction = BALL_FRICTION;

  constructor(x: number, y: number, radius: number, color: number | string) {
    super(x, y, radius, color);
    this.mass = radius;
  }

  move() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
  }

  detectWallCollision() {
    if (
      this.x - this.radius <= POCKET_RADIUS ||
      this.x + this.radius >= TABLE_WIDTH + POCKET_RADIUS
    ) {
      this.velocity.x *= -BALL_ELASTICITY;
      this.x = Math.max(
        POCKET_RADIUS + this.radius,
        Math.min(TABLE_WIDTH + POCKET_RADIUS - this.radius, this.x)
      );
    }
    if (
      this.y - this.radius <= POCKET_RADIUS ||
      this.y + this.radius >= TABLE_HEIGHT + POCKET_RADIUS
    ) {
      this.velocity.y *= -BALL_ELASTICITY;
      this.y = Math.max(
        POCKET_RADIUS + this.radius,
        Math.min(TABLE_HEIGHT + POCKET_RADIUS - this.radius, this.y)
      );
    }
  }

  detectBallCollision(other: Ball) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance < this.radius + other.radius) {
      const overlap = this.radius + other.radius - distance;
      const correctionFactor = overlap / 2;

      const normalX = dx / distance;
      const normalY = dy / distance;

      this.x -= normalX * correctionFactor;
      this.y -= normalY * correctionFactor;
      other.x += normalX * correctionFactor;
      other.y += normalY * correctionFactor;

      const v1 = this.velocity;
      const v2 = other.velocity;

      const relVelX = v2.x - v1.x;
      const relVelY = v2.y - v1.y;
      const normalDotRelVel = relVelX * normalX + relVelY * normalY;

      if (normalDotRelVel > 0) return;

      const impulse = (2 * normalDotRelVel) / (this.mass + other.mass);

      this.velocity.x += impulse * other.mass * normalX * BALL_ELASTICITY;
      this.velocity.y += impulse * other.mass * normalY * BALL_ELASTICITY;
      other.velocity.x -= impulse * this.mass * normalX * BALL_ELASTICITY;
      other.velocity.y -= impulse * this.mass * normalY * BALL_ELASTICITY;
    }
  }
}
