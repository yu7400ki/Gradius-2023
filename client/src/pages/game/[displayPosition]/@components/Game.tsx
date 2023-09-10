import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'commonConstantsWithClient';
import { useEffect, useRef, useState } from 'react';

type Props = {
  displayPosition: number;
};

type WindowSize = {
  width: number;
  height: number;
};

export const Game: React.FC<Props> = ({ displayPosition }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Canvas not found');
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not found');
    }

    const load = async () => {
      const { Gradius, GameLoop } = await import('../@logic');
      const game = new Gradius(displayPosition);
      await GameLoop.start(game, ctx);
    };
    load();
  }, [displayPosition]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      height={SCREEN_HEIGHT}
      width={SCREEN_WIDTH}
      style={{
        transform: `
          scale(${windowSize.width / SCREEN_WIDTH}, ${windowSize.height / SCREEN_HEIGHT})
          translateX(${(windowSize.width - SCREEN_WIDTH) / 2}px)
          translateY(${(windowSize.height - SCREEN_HEIGHT) / 2}px)
          `,
      }}
      ref={canvasRef}
    />
  );
};
