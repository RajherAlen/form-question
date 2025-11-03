import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import MainLayout from "./MainLayout";

interface IProps {
    children: React.ReactNode;
    redirectTo?: string; // optional redirect path
}

export const IsLoggedInGuard = ({ children, redirectTo = "/login" }: IProps) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setLoading(false);
        };
        getUser();

        // Listen for auth state changes (login/logout)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    if (loading) return <div className='w-full'>
        <div className='h-1.5 w-full bg-pink-100 overflow-hidden'>
            <div className='progress w-full h-full bg-pink-500 left-right'></div>
        </div>
    </div>;

    // If user is not logged in, redirect
    if (!user) return <Navigate to={redirectTo} />;

    // If user is logged in, render children
    return <MainLayout>{children}</MainLayout>;
};
