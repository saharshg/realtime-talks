// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { useEffect, useState } from 'react';
import Dashboard from './dashboard';
// @ts-ignore
import { supabase } from './supabaseClient';

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

  // TODO: fix unnecessary calling
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

  useEffect(() => {
    if (user) {
      supabase
        .from('profile')
        .insert({ name: user?.user_metadata.name, user_id: user.id });
    }
  }, [user]);

  if (!user) {
    return <button onClick={signInWithGitHub}>Login</button>;
  }

  return <Dashboard />;
}

export default App;
