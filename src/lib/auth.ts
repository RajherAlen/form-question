import { supabase } from "./supabaseClient";

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    const userId = data?.session?.user?.id;

    if (!userId) {
        return { success: false, error: 'User ID not found' };
    }

    return { success: true, data };
};

export const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error.message);
    } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        console.log('User logged out');
    }
};