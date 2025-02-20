import { BaseGraphics } from 'share/base/base-graphics';

export class Wall extends BaseGraphics {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number | string
  ) {
    super();
    this.rect(0, 0, width, height);
    this.fill(color);
    this.x = x;
    this.y = y;
  }
}
