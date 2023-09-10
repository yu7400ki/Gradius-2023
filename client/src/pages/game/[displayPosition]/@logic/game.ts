import { ENEMY_HALF_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from 'commonConstantsWithClient';
import { staticPath } from 'src/utils/$path';
import { apiClient } from 'src/utils/apiClient';
import { computePosition } from 'src/utils/computePosition';
import { Boom, Bullet, Enemy, Player } from './sprites';
import type { Game } from './types';

export class Gradius implements Game {
  displayPosition: number;
  background: HTMLImageElement;
  shootSound: HTMLAudioElement;
  players: Player[];
  enemies: Enemy[];
  bullets: Bullet[];
  effect: Boom[];

  constructor(displayPosition: number) {
    this.displayPosition = displayPosition;
    this.players = [];
    this.enemies = [];
    this.bullets = [];
    this.effect = [];
  }

  async initialize() {
    const [players, enemies, bullets] = await Promise.all([
      this.fetchPlayers(),
      this.fetchEnemies(),
      this.fetchBullets(),
      Player.initialize(),
      Enemy.initialize(),
      Bullet.initialize(),
      Boom.initialize(),
    ]);
    this.players = players.map((player) => new Player(this.displayPosition, player));
    this.enemies = enemies.map((enemy) => new Enemy(this.displayPosition, enemy));
    this.bullets = bullets.map((bullet) => new Bullet(this.displayPosition, bullet));
    this.background = new Image();
    this.background.src = staticPath.images.odaiba_jpg;
    this.shootSound = new Audio(staticPath.sounds.shot_mp3);
    return new Promise<void>((resolve) => {
      this.background.onload = () => {
        resolve();
      };
    });
  }

  async update() {
    const [players, enemies, bullets] = await Promise.all([
      this.fetchPlayers(),
      this.fetchEnemies(),
      this.fetchBullets(),
    ]);

    if (bullets.length > this.bullets.length) {
      const audio = this.shootSound.cloneNode() as HTMLAudioElement;
      await audio.play();
    }

    this.effect.forEach((boom) => boom.update());

    const killedEnemy = this.enemies.filter(
      (enemy) => !enemies.some((e) => e.id === enemy.model.id)
    );

    this.players = players.map((player) => new Player(this.displayPosition, player));
    this.enemies = enemies.map((enemy) => new Enemy(this.displayPosition, enemy));
    this.bullets = bullets.map((bullet) => new Bullet(this.displayPosition, bullet));
    this.effect = this.effect.concat(
      killedEnemy.map((enemy) => {
        const pos = computePosition(
          enemy.model.createdPos,
          enemy.model.createdAt,
          enemy.model.direction
        );
        return new Boom(this.displayPosition, {
          x: pos.x - ENEMY_HALF_WIDTH,
          y: pos.y - ENEMY_HALF_WIDTH,
        });
      })
    );
    this.effect = this.effect.filter((boom) => !boom.end);
  }

  async draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.drawImage(this.background, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.players.forEach((player) => player.draw(ctx));
    this.enemies.forEach((enemy) => enemy.draw(ctx));
    this.bullets.forEach((bullet) => bullet.draw(ctx));
    this.effect.forEach((boom) => boom.draw(ctx));
  }

  async fetchPlayers() {
    const res = await apiClient.player.$get({
      query: {
        displayNumber: this.displayPosition,
      },
    });
    return res;
  }

  async fetchEnemies() {
    const res = await apiClient.enemy.$get();
    return res;
  }

  async fetchBullets() {
    const res = await apiClient.bullet.$get({
      query: {
        displayNumber: this.displayPosition,
      },
    });
    return res;
  }
}
