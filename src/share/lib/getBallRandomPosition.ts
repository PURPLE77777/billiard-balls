import {
  POCKET_RADIUS,
  TABLE_HEIGHT,
  TABLE_WIDTH,
} from 'share/const/game.const';
import { PositionType } from 'share/types/position.type';

export const getBallRandomPosition = (radius: number): PositionType => {
  return {
    x: Math.random() * (TABLE_WIDTH - radius * 2) + POCKET_RADIUS + radius,
    y: Math.random() * (TABLE_HEIGHT - radius * 2) + POCKET_RADIUS + radius,
  };
};
