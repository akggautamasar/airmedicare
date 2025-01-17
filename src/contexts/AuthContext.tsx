import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AuthError, AuthApiError } from '@supabase/supabase-js';

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
      console.log("Auth state changed:", _event, session);
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
      console.log("Starting signup process...");
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      console.log("Formatted phone number:", formattedPhone);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        phone: formattedPhone,
        options: {
          data: {
            name,
            phone: formattedPhone,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message);
        throw error;
      }

      if (data?.user) {
        console.log("Signup successful:", data);
        toast.success('Account created successfully! Please verify your phone number.');
        return;
      }

      toast.error('Something went wrong during signup. Please try again.');
    } catch (error) {
      console.error("Signup process error:", error);
      if (error instanceof AuthApiError) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (data?.user) {
        toast.success('Logged in successfully!');
      }
    } catch (error) {
      if (error instanceof AuthApiError) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
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
      if (error instanceof AuthApiError) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
      throw error;
    }
  };

  const sendOTP = async (phone: string) => {
    try {
      console.log("Sending OTP to:", phone);
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data: attempts, error: fetchError } = await supabase
        .from('otp_attempts')
        .select('attempts, last_attempt')
        .eq('phone', formattedPhone)
        .single();

      console.log("Current OTP attempts:", attempts);

      if (!fetchError && attempts) {
        const lastAttempt = new Date(attempts.last_attempt);
        const now = new Date();
        const timeDiff = (now.getTime() - lastAttempt.getTime()) / 1000;

        if (attempts.attempts >= 3 && timeDiff < 300) {
          throw new Error('Too many attempts. Please try again in 5 minutes.');
        }

        await supabase
          .from('otp_attempts')
          .update({
            attempts: attempts.attempts + 1,
            last_attempt: new Date().toISOString(),
          })
          .eq('phone', formattedPhone);
      } else {
        await supabase
          .from('otp_attempts')
          .insert({
            phone: formattedPhone,
            attempts: 1,
            user_id: user?.id,
          });
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      
      if (error) {
        console.error("OTP send error:", error);
        toast.error(error.message);
        throw error;
      }

      console.log("OTP sent successfully");
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error("Send OTP error:", error);
      if (error instanceof AuthApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
      throw error;
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      await supabase
        .from('otp_attempts')
        .update({
          attempts: 0,
          last_attempt: new Date().toISOString(),
        })
        .eq('phone', formattedPhone);

      toast.success('Phone number verified successfully!');
      return true;
    } catch (error) {
      if (error instanceof AuthApiError) {
        toast.error(error.message);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
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
