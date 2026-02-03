import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Company, UserProfile } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    company: Company | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string, companyName: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    refreshCompany: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                loadUserData(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                loadUserData(session.user.id);
            } else {
                setCompany(null);
                setUserProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loadUserData = async (userId: string) => {
        try {
            // Load company
            const { data: companyData, error: companyError } = await supabase
                .from('companies')
                .select('*')
                .eq('supabase_user_id', userId)
                .single();

            if (companyError) throw companyError;
            setCompany(companyData);

            // Load user profile
            const { data: profileData, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('supabase_user_id', userId)
                .single();

            if (profileError) throw profileError;
            setUserProfile(profileData);
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const signUp = async (email: string, password: string, companyName: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) return { error };

        // Create company record
        if (data.user) {
            const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            const { error: companyError } = await supabase
                .from('companies')
                .insert({
                    name: companyName,
                    slug,
                    supabase_user_id: data.user.id,
                    active: true,
                });

            if (companyError) return { error: companyError };

            // Create user profile
            const { error: profileError } = await supabase
                .from('user_profiles')
                .insert({
                    company_id: slug, // Will be updated with actual company_id
                    supabase_user_id: data.user.id,
                    email,
                    name: email.split('@')[0],
                    role: 'admin',
                    active: true,
                });

            if (profileError) return { error: profileError };
        }

        return { error: null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setCompany(null);
        setUserProfile(null);
    };

    const refreshCompany = async () => {
        if (user) {
            await loadUserData(user.id);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                company,
                userProfile,
                loading,
                signIn,
                signUp,
                signOut,
                refreshCompany,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
