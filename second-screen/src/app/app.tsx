// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kdcbkhlccgdinheopcxx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkY2JraGxjY2dkaW5oZW9wY3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3OTE0MjYsImV4cCI6MjAwMTM2NzQyNn0.s3-7yoJGGRn_6OfP7DIfKBq6oaXFyp2foBW5kHqX0sA'
);

export function App() {
  const [user, setUser] = useState<any>();

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    loadUser();
  }, []);

  if (!user) {
    return <button onClick={signInWithGitHub}>Login</button>;
  }

  const createVote = async (e: any) => {
    e.preventDefault();
    await supabase
      .from('sentiment')
      .insert({ value: e.nativeEvent.submitter.name, user_id: user.id });
  };

  return (
    <form onSubmit={createVote}>
      <h1>How do you feel about his non-sense?</h1>
      <button name="good">
        <span role="img" aria-label="yum face">
          😋
        </span>
      </button>
      <button name="bad">
        <span role="img" aria-label="angry face">
          😡
        </span>
      </button>
    </form>
  );
}

export default App;
