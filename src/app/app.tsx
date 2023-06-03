// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import styles from './app.module.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kdcbkhlccgdinheopcxx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkY2JraGxjY2dkaW5oZW9wY3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3OTE0MjYsImV4cCI6MjAwMTM2NzQyNn0.s3-7yoJGGRn_6OfP7DIfKBq6oaXFyp2foBW5kHqX0sA'
);

export function App() {
  const [currentSentiment, setCurrentSentiment] = useState(50);
  useEffect(() => {
    const channel = supabase
      .channel('sentiment_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sentiment',
        },
        (payload) => {
          setCurrentSentiment((currentValue) => {
            let value = 0;
            if (payload?.new?.value === 'good') {
              value = 1;
            } else if (payload?.new?.value === 'bad') {
              value = -1;
            }
            return Math.min(100, Math.max(0, currentValue + value));
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className={styles.slide}>
      <h1>Loves fades, but Pizza is forever!</h1>
      <p className={styles.bigText}>
        <span role="img" aria-label="Pizza">
          🍕
        </span>
      </p>

      <div className={styles.responses}>
        <h2>How the audience is feeling</h2>

        <div className={styles.sentimentContainer}>
          <p>
            <span role="img" aria-label="angry face">
              😡
            </span>
          </p>
          <label htmlFor="sentiment" className={styles['sr-only']}>
            Current sentiment
          </label>
          <input
            type="range"
            className={styles.sentiment}
            id="sentiment"
            min={0}
            max={100}
            value={currentSentiment}
            readOnly
          />
          <p>
            <span role="img" aria-label="yum face">
              😋
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
