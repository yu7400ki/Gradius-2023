export interface Game {
  initialize: () => Promise<void>;
  update: () => Promise<void>;
  draw: (ctx: CanvasRenderingContext2D) => Promise<void>;
}

export interface LoopStatic {
  start: (game: Game, ctx: CanvasRenderingContext2D) => void;
}

export interface Sprite {
  draw: (ctx: CanvasRenderingContext2D) => Promise<void>;
}

export interface SpriteStatic {
  initialize: () => Promise<void>;
}
