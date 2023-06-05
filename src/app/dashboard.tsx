import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { supabase } from '../supabaseClient';
import { useAuth } from 'src/hooks/useAuth';

type Profile = {
  name: string;
  id: string;
};

export function App() {
  const [profiles, setProfiles] = useState<any>([]);
  const [myFood, setMyFood] = useState([]);
  const { currentUser } = useAuth();

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profile')
      .select('*')
      .neq('user_id', currentUser.id);

    setProfiles(data);
  };

  const getMyFood = () => {
    supabase
      .from('food')
      .select('value')
      .eq('user_id', currentUser?.id)
      .then(({ data }: { data: any }) => {
        setMyFood(data);
      });
  };
  useEffect(() => {
    fetchProfiles();
    getMyFood();

    const foodUpdateChannel = supabase
      .channel('food-update-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'food',
          filter: `user_id=eq.${currentUser?.id}`,
        },
        () => {
          getMyFood();
        }
      )
      .subscribe();

    return () => {
      foodUpdateChannel.unsubscribe();
    };
  }, []);

  const storeFood = async (e: any) => {
    e.preventDefault();

    await supabase
      .from('food')
      .insert({ value: e.target.elements.food.value, user_id: currentUser.id });
  };

  return (
    <>
      <form onSubmit={storeFood}>
        <h1>Hi, {currentUser?.user_metadata?.name}!</h1>
        <h2>What are you eating?</h2>
        <input name="food" type="text" />
      </form>
      <section className={styles.mainContent}>
        <ul>
          {myFood.map(({ value }) => {
            const randomColor = Math.floor(Math.random() * 16777215).toString(
              16
            );
            return (
              <li
                key={value}
                style={{
                  color: `#${randomColor}`,
                  listStyle: 'none',
                  textTransform: 'capitalize',
                }}
              >
                {value}
              </li>
            );
          })}
        </ul>
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
