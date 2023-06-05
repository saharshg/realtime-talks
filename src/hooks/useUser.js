import { useEffect } from "react";
import { useState } from "react";

const useUser = () => {
    const [user, setUser] = useState();
    useEffect(() => {
        const loadUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            setUser(user);
        };
    }, [])

}

export default { user }