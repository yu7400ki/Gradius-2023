import { PLAYER_HALF_WIDTH, SCREEN_WIDTH } from 'commonConstantsWithClient';
import type { PlayerModel } from 'commonTypesWithClient/models';
import { staticPath } from 'src/utils/$path';
import { staticImplements } from './decorator';
import type { Sprite, SpriteStatic } from './types';

@staticImplements<SpriteStatic>()
export class Player implements Sprite {
  static image = new Image();
  static angleLeft = document.createElement('canvas');
  static angleRight = document.createElement('canvas');
  static initialized = false;
  displayPosition: number;
  model: PlayerModel;
  static initialize() {
    const angleLeft = Player.angleLeft;
    const angleRight = Player.angleRight;
    angleLeft.width = PLAYER_HALF_WIDTH * 2;
    angleLeft.height = PLAYER_HALF_WIDTH * 2;
    angleRight.width = PLAYER_HALF_WIDTH * 2;
    angleRight.height = PLAYER_HALF_WIDTH * 2;
    const ctxLeft = angleLeft.getContext('2d');
    const ctxRight = angleRight.getContext('2d');
    if (!ctxLeft || !ctxRight) {
      throw new Error('Failed to get context');
    }

    return new Promise<void>((resolve) => {
      Player.image.onload = () => {
        ctxLeft.save();
        ctxLeft.translate(PLAYER_HALF_WIDTH, PLAYER_HALF_WIDTH);
        ctxLeft.rotate((90 * Math.PI) / 180);
        ctxLeft.drawImage(
          Player.image,
          -PLAYER_HALF_WIDTH,
          -PLAYER_HALF_WIDTH,
          PLAYER_HALF_WIDTH * 2,
          PLAYER_HALF_WIDTH * 2
        );
        ctxLeft.restore();

        ctxRight.save();
        ctxRight.translate(PLAYER_HALF_WIDTH, PLAYER_HALF_WIDTH);
        ctxRight.rotate((-90 * Math.PI) / 180);
        ctxRight.drawImage(
          Player.image,
          -PLAYER_HALF_WIDTH,
          -PLAYER_HALF_WIDTH,
          PLAYER_HALF_WIDTH * 2,
          PLAYER_HALF_WIDTH * 2
        );
        ctxRight.restore();

        Player.initialized = true;
        resolve();
      };
      Player.image.src = staticPath.images.entity.spaceship_png;
    });
  }

  constructor(displayPosition: number, model: PlayerModel) {
    if (!Player.initialized) {
      throw new Error('Player is not initialized');
    }

    this.displayPosition = displayPosition;
    this.model = model;
  }

  async draw(ctx: CanvasRenderingContext2D) {
    if (!Player.initialized) {
      throw new Error('Player is not initialized');
    }

    const displayNumber = this.displayPosition;
    const player = this.model;

    const x =
      player.pos.x -
      displayNumber * SCREEN_WIDTH +
      PLAYER_HALF_WIDTH * (player.side === 'left' ? 1 : -1);
    const y = player.pos.y + PLAYER_HALF_WIDTH * (player.side === 'left' ? -1 : 1);
    const image = player.side === 'left' ? Player.angleLeft : Player.angleRight;

    ctx.drawImage(image, x, y, PLAYER_HALF_WIDTH * 2, PLAYER_HALF_WIDTH * 2);
  }
}
