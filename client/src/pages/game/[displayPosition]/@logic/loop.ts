import { staticImplements } from './decorator';
import type { Game, LoopStatic } from './types';

const FRAME_SIZE = (1.0 / 24.0) * 1000.0;

@staticImplements<LoopStatic>()
export class GameLoop {
  lastFrame: number;
  accumulatedDelta: number;
  requestId: number;

  constructor() {
    this.lastFrame = performance.now();
    this.accumulatedDelta = 0;
    this.requestId = 0;
  }

  static async start(game: Game, ctx: CanvasRenderingContext2D) {
    await game.initialize();
    const instance = new GameLoop();

    const loop = async (pref: number) => {
      instance.accumulatedDelta += pref - instance.lastFrame;
      /*
      while (this.accumulatedDelta > FRAME_SIZE) {
        await game.update();
        this.accumulatedDelta -= FRAME_SIZE;
      }
      */
      if (instance.accumulatedDelta > FRAME_SIZE) {
        await game.update();
        instance.accumulatedDelta -=
          FRAME_SIZE * Math.floor(instance.accumulatedDelta / FRAME_SIZE);
      }
      instance.lastFrame = pref;
      await game.draw(ctx);
      instance.requestId = requestAnimationFrame(loop);
    };

    instance.requestId = requestAnimationFrame(loop);
    return instance;
  }

  stop() {
    cancelAnimationFrame(this.requestId);
  }
}
