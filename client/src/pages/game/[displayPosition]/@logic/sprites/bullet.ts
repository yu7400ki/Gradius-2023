import { BULLET_RADIUS, SCREEN_WIDTH } from 'commonConstantsWithClient';
import type { BulletModel } from 'commonTypesWithClient/models';
import { staticPath } from 'src/utils/$path';
import { computePosition } from 'src/utils/computePosition';
import { staticImplements } from '../decorator';
import type { Sprite, SpriteStatic } from '../types';

@staticImplements<SpriteStatic>()
export class Bullet implements Sprite {
  static images: HTMLImageElement[] = [new Image(), new Image()];
  private static initialized = false;
  displayPosition: number;
  model: BulletModel;

  static initialize() {
    const images = Bullet.images;
    return new Promise<void>((resolve) => {
      let loadedCount = 0;
      const handleLoad = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          Bullet.initialized = true;
          resolve();
        }
      };
      images.forEach((image) => {
        image.onload = handleLoad;
      });
      images[0].src = staticPath.images.entity.bullet_red_png;
      images[1].src = staticPath.images.entity.bullet_blue_png;
    });
  }

  constructor(displayPosition: number, model: BulletModel) {
    if (!Bullet.initialized) {
      throw new Error('Bullet is not initialized');
    }

    this.displayPosition = displayPosition;
    this.model = model;
  }

  async draw(ctx: CanvasRenderingContext2D) {
    const bullet = this.model;
    const displayPosition = this.displayPosition;
    const ownerType = bullet.side === 'left' ? 0 : 1;
    const image = Bullet.images[ownerType];
    const pos = computePosition(bullet.createdPos, bullet.createdAt, bullet.direction);
    const x = pos.x - BULLET_RADIUS - displayPosition * SCREEN_WIDTH;
    const y = pos.y - BULLET_RADIUS;
    ctx.drawImage(image, x, y, BULLET_RADIUS * 2, BULLET_RADIUS * 2);
  }
}
