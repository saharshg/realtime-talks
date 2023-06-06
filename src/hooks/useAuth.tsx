import {
  useEffect,
  createContext,
  useState,
  useContext,
  ReactElement,
} from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [currentUser, setcurrentUser] = useState<any>();
  useEffect(() => {
    // TODO: Move this to supabase trigger event
    if (currentUser) {
      supabase.from('profile').insert({
        name: currentUser?.user_metadata.name,
        user_id: currentUser.id,
      });
    }
  }, [currentUser]);
  useEffect(() => {
    supabase.auth.getSession().then((session) => {
      setcurrentUser(session?.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      setcurrentUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    if (error) {
      console.log(error);
    }
  };

  if (!currentUser) {
    return <button onClick={signInWithGitHub}>Login</button>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, setcurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
