// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
// @ts-ignore
import { supabase } from './supabaseClient';

type Profile = {
  name: string;
  id: string;
};

export function App() {
  const [profiles, setProfiles] = useState<any>([]);
  useEffect(() => {
    const handleFoodChange = async (payload: any) => {
      const { data, error } = await supabase
        .from('users')
        .select(payload.new.user_id);
      console.log(data, error);
    };
    const channel = supabase
      .channel('food_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'food',
        },
        handleFoodChange
      )
      .subscribe();

    const fetchProfiles = async () => {
      const { data } = await supabase.from('profile').select('*');

      setProfiles(data);
    };
    fetchProfiles();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const storeFood = async (e: any) => {
    e.preventDefault();

    await supabase
      .from('food')
      .insert({ value: e.target.elements.food.value, user_id: user.id });
  };

  return (
    <>
      <form onSubmit={storeFood}>
        <h1>What are you eating?</h1>
        <input name="food" type="text" />
      </form>
      <section className={styles.mainContent}>
        <ul>
          {profiles.map((profile: Profile) => (
            <li key={profile.id}>{profile.name}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default App;
