import { BilliardGame } from 'containers/BilliardGame';
import { Ball } from 'entities/Ball';
import { BilliardTable } from 'entities/BilliardTable';
import { Pocket } from 'entities/Pocket';
import { Wall } from 'entities/Wall';
import { Application } from 'pixi.js';
import {
  BALL_COUNT,
  BALL_MAX_RADIUS,
  BALL_MIN_RADIUS,
  BORDER_THICKNESS,
  IMPULSE_POWER,
  POCKET_BORDER_COLOR,
  POCKET_BORDER_THICKNESS,
  POCKET_COLOR,
  POCKET_RADIUS,
  TABLE_COLOR,
  TABLE_HEIGHT,
  TABLE_WIDTH,
  WALL_COLOR,
} from 'share/const/game.const';
import { getBallRandomPosition } from 'share/lib/getBallRandomPosition';
import { getRandomColor } from 'share/lib/getRandomColor';
import { getRandomMinMax } from 'share/lib/getRandomMinMax';
import { PositionType } from 'share/types/position.type';

(async () => {
  const app = new Application();

  await app.init({
    width: TABLE_WIDTH + POCKET_RADIUS * 2,
    height: TABLE_HEIGHT + POCKET_RADIUS * 2,
    backgroundColor: 0x877800,
  });

  document.getElementById('billiard-game').appendChild(app.canvas);

  const billiardGame = new BilliardGame();
  app.stage.addChild(billiardGame);

  const table = new BilliardTable(
    POCKET_RADIUS,
    POCKET_RADIUS,
    TABLE_WIDTH,
    TABLE_HEIGHT,
    TABLE_COLOR
  );

  const walls: Wall[] = [
    // top
    new Wall(
      POCKET_RADIUS,
      POCKET_RADIUS - BORDER_THICKNESS,
      TABLE_WIDTH,
      BORDER_THICKNESS,
      WALL_COLOR
    ),
    // Bottom
    new Wall(
      POCKET_RADIUS,
      TABLE_HEIGHT + POCKET_RADIUS,
      TABLE_WIDTH,
      BORDER_THICKNESS,
      WALL_COLOR
    ),
    // left
    new Wall(
      POCKET_RADIUS - BORDER_THICKNESS,
      POCKET_RADIUS,
      BORDER_THICKNESS,
      TABLE_HEIGHT,
      WALL_COLOR
    ),
    // right
    new Wall(
      TABLE_WIDTH + POCKET_RADIUS,
      POCKET_RADIUS,
      BORDER_THICKNESS,
      TABLE_HEIGHT,
      WALL_COLOR
    ),
  ];

  // Create pockets as circles (corner and side)
  const pockets: Pocket[] = [
    // top left
    new Pocket(
      POCKET_RADIUS,
      POCKET_RADIUS,
      POCKET_RADIUS,
      POCKET_BORDER_THICKNESS,
      POCKET_COLOR,
      POCKET_BORDER_COLOR
    ),
    // // top middle
    new Pocket(
      TABLE_WIDTH / 2 + POCKET_RADIUS,
      POCKET_RADIUS,
      POCKET_RADIUS,
      POCKET_BORDER_THICKNESS,
      POCKET_COLOR,
      POCKET_BORDER_COLOR
    ),
    // bottom left
    new Pocket(
      POCKET_RADIUS,
      TABLE_HEIGHT + POCKET_RADIUS,
      POCKET_RADIUS,
      POCKET_BORDER_THICKNESS,
      POCKET_COLOR,
      POCKET_BORDER_COLOR
    ),
    // // top right
    new Pocket(
      TABLE_WIDTH + POCKET_RADIUS,
      POCKET_RADIUS,
      POCKET_RADIUS,
      POCKET_BORDER_THICKNESS,
      POCKET_COLOR,
      POCKET_BORDER_COLOR
    ),
    // // bottom middle
    new Pocket(
      TABLE_WIDTH / 2 + POCKET_RADIUS,
      TABLE_HEIGHT + POCKET_RADIUS,
      POCKET_RADIUS,
      POCKET_BORDER_THICKNESS,
      POCKET_COLOR,
      POCKET_BORDER_COLOR
    ),
    // // // bottom right
    new Pocket(
      TABLE_WIDTH + POCKET_RADIUS,
      TABLE_HEIGHT + POCKET_RADIUS,
      POCKET_RADIUS,
      POCKET_BORDER_THICKNESS,
      POCKET_COLOR,
      POCKET_BORDER_COLOR
    ),
  ];

  // Draw walls
  walls.forEach(wall => billiardGame.addChild(wall));

  // Draw pockets
  pockets.forEach(pocket => {
    billiardGame.addChild(pocket);
  });

  // Draw table
  billiardGame.addChild(table);

  const balls: Ball[] = [];

  for (let i = 0; i < BALL_COUNT; i++) {
    let radius = getRandomMinMax(BALL_MIN_RADIUS, BALL_MAX_RADIUS);
    let position: PositionType;
    let validPosition = false;
    let color: number;

    while (!validPosition) {
      position = getBallRandomPosition(radius);
      validPosition = balls.every(ball => {
        const dx = ball.x - position.x;
        const dy = ball.y - position.y;
        const minDistance = ball.radius + radius;
        return Math.sqrt(dx ** 2 + dy ** 2) >= minDistance;
      });
    }

    while (!color) {
      const newColor = getRandomColor();
      if (newColor !== TABLE_COLOR && newColor !== WALL_COLOR) {
        color = newColor;
      }
    }

    const ball = new Ball(position.x, position.y, radius, color);
    ball.eventMode = 'static';

    balls.push(ball);
    billiardGame.addChild(ball);
  }

  let selectedBall: Ball | null = null;

  balls.forEach(ball => {
    ball.addEventListener('mousedown', event => {
      selectedBall = event.target as Ball;
    });
  });

  app.canvas.addEventListener('mouseup', event => {
    if (selectedBall) {
      const dx = event.offsetX - selectedBall.x;
      const dy = event.offsetY - selectedBall.y;
      selectedBall.velocity = {
        x: dx * IMPULSE_POWER,
        y: dy * IMPULSE_POWER,
      };
      selectedBall = null;
    }
  });

  app.ticker.add(() => {
    balls.forEach(ball => {
      ball.move();
      ball.detectWallCollision();
    });

    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        balls[i].detectBallCollision(balls[j]);
      }
    }
  }, app);
})();
