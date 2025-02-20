import { BaseGraphics } from 'share/base/base-graphics';

export class Circle extends BaseGraphics {
  radius: number;

  constructor(x: number, y: number, radius: number, color: number | string) {
    super();
    this.circle(0, 0, radius).fill(color);
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
}
