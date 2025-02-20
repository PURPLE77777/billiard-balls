import { Circle } from 'figures/Circle';
import { BaseContainer } from 'share/base/base-container';

export class Pocket extends BaseContainer {
  constructor(
    x: number,
    y: number,
    radius: number,
    borderWidth: number,
    color: number | string,
    borderColor: number | string
  ) {
    super();

    const circle = new Circle(x, y, radius - borderWidth, color);
    const circleBorder = new Circle(x, y, radius, borderColor);

    this.addChild(circleBorder, circle);
  }
}
