import { ENEMY_HALF_WIDTH, SCREEN_WIDTH } from 'commonConstantsWithClient';
import { staticPath } from 'src/utils/$path';
import { staticImplements } from './decorator';
import type { Sprite, SpriteStatic } from './types';

@staticImplements<SpriteStatic>()
export class Boom implements Sprite {
  static images = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
  static initialized = false;
  displayPosition: number;
  position: { x: number; y: number };
  frame: number;
  end: boolean;

  static initialize() {
    const images = Boom.images;
    return new Promise<void>((resolve) => {
      let loadedCount = 0;
      const handleLoad = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          Boom.initialized = true;
          resolve();
        }
      };
      images.forEach((image) => {
        image.onload = handleLoad;
      });
      images[0].src = staticPath.images.Effect.boom.boom1_png;
      images[1].src = staticPath.images.Effect.boom.boom2_png;
      images[2].src = staticPath.images.Effect.boom.boom3_png;
      images[3].src = staticPath.images.Effect.boom.boom4_png;
      images[4].src = staticPath.images.Effect.boom.boom5_png;
      images[5].src = staticPath.images.Effect.boom.boom6_png;
    });
  }

  constructor(displayPosition: number, position: { x: number; y: number }) {
    if (!Boom.initialized) {
      throw new Error('Boom is not initialized');
    }

    this.displayPosition = displayPosition;
    this.position = position;
    this.frame = 0;
  }

  async draw(ctx: CanvasRenderingContext2D) {
    if (!Boom.initialized) {
      throw new Error('Boom is not initialized');
    }

    const frame = this.frame;
    const images = Boom.images;
    const currentFrame = Math.min(Math.floor(frame / 2), images.length - 1);
    if (Math.floor(frame / 2) === images.length) {
      this.end = true;
      return;
    }
    const image = images[currentFrame];
    const x = this.position.x - this.displayPosition * SCREEN_WIDTH;
    const y = this.position.y;
    ctx.drawImage(image, x, y, ENEMY_HALF_WIDTH * 2 * 1.2, ENEMY_HALF_WIDTH * 2 * 1.2);
  }

  async update() {
    this.frame++;
  }
}
