import { ENEMY_HALF_WIDTH, SCREEN_WIDTH } from 'commonConstantsWithClient';
import type { EnemyModel } from 'commonTypesWithClient/models';
import { staticPath } from 'src/utils/$path';
import { computePosition } from 'src/utils/computePosition';
import { staticImplements } from '../decorator';
import type { Sprite, SpriteStatic } from '../types';

@staticImplements<SpriteStatic>()
export class Enemy implements Sprite {
  static images: HTMLImageElement[] = [new Image(), new Image(), new Image()];
  private static initialized = false;
  displayPosition: number;
  model: EnemyModel;

  static initialize() {
    const images = Enemy.images;
    return new Promise<void>((resolve) => {
      let loadedCount = 0;
      const handleLoad = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          Enemy.initialized = true;
          resolve();
        }
      };
      images.forEach((image) => {
        image.onload = handleLoad;
      });
      images[0].src = staticPath.images.entity.ufo_1_png;
      images[1].src = staticPath.images.entity.ufo_2_png;
      images[2].src = staticPath.images.entity.ufo_3_png;
    });
  }

  constructor(displayPosition: number, model: EnemyModel) {
    if (!Enemy.initialized) {
      throw new Error('Enemy is not initialized');
    }

    this.displayPosition = displayPosition;
    this.model = model;
  }

  async draw(ctx: CanvasRenderingContext2D) {
    const enemy = this.model;
    const image = Enemy.images[enemy.type];
    const pos = computePosition(enemy.createdPos, enemy.createdAt, enemy.direction);
    const x = pos.x - ENEMY_HALF_WIDTH - this.displayPosition * SCREEN_WIDTH;
    const y = pos.y - ENEMY_HALF_WIDTH;
    ctx.drawImage(image, x, y, ENEMY_HALF_WIDTH * 2, ENEMY_HALF_WIDTH * 2);
  }
}
