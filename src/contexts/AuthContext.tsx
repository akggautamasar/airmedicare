import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  phone?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          phone: session.user.phone,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          phone: session.user.phone,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (email: string, password: string, name: string, phone: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        phone,
        options: {
          data: {
            name,
            phone,
          },
        },
      });

      if (error) throw error;
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const sendOTP = async (phone: string) => {
    try {
      // Track OTP attempts
      const { data: attempts, error: fetchError } = await supabase
        .from('otp_attempts')
        .select('attempts, last_attempt')
        .eq('phone', phone)
        .single();

      if (!fetchError && attempts) {
        const lastAttempt = new Date(attempts.last_attempt);
        const now = new Date();
        const timeDiff = (now.getTime() - lastAttempt.getTime()) / 1000; // in seconds

        if (attempts.attempts >= 3 && timeDiff < 300) { // 5 minutes cooldown
          throw new Error('Too many attempts. Please try again in 5 minutes.');
        }

        // Update attempts count
        await supabase
          .from('otp_attempts')
          .update({
            attempts: attempts.attempts + 1,
            last_attempt: new Date().toISOString(),
          })
          .eq('phone', phone);
      } else {
        // Create new attempt record
        await supabase
          .from('otp_attempts')
          .insert({
            phone,
            attempts: 1,
            user_id: user?.id,
          });
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      
      if (error) throw error;
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      // Reset attempts on successful verification
      await supabase
        .from('otp_attempts')
        .update({
          attempts: 0,
          last_attempt: new Date().toISOString(),
        })
        .eq('phone', phone);

      toast.success('Phone number verified successfully!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, sendOTP, verifyOTP }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};