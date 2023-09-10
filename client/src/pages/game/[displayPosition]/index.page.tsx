import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { apiClient } from 'src/utils/apiClient';
import { Game } from './@components/Game';
import styles from './index.module.css';

const Page = () => {
  const router = useRouter();
  let displayPosition: number | null = null;
  if (typeof router.query.displayPosition === 'string') {
    const parsed = Number(router.query.displayPosition);
    if (!isNaN(parsed)) {
      displayPosition = parsed;
    }
  }

  useEffect(() => {
    const redirectToLobby = async () => {
      const res = await apiClient.config.$get();
      if (Number(displayPosition) >= (res ?? 1)) {
        router.push('/game');
      }
    };
    redirectToLobby();
  }, [router, displayPosition]);

  if (displayPosition === null) {
    return null;
  }

  return (
    <div className={styles.canvasContainer}>
      <Game displayPosition={displayPosition} />
    </div>
  );
};

export default Page;
