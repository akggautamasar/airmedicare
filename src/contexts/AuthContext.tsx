import * as React from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { AuthContextType, User } from "@/types/auth";
import { useOTP } from "@/hooks/useOTP";
import { getErrorMessage } from "@/utils/authErrors";

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const { sendOTP, verifyOTP } = useOTP();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const updateUserState = async (session: any) => {
    if (session) {
      const profile = await fetchUserProfile(session.user.id);
      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata.name,
        phone: session.user.phone,
        role: profile?.role || 'user'
      });
    } else {
      setUser(null);
    }
  };

  React.useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUserState(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      updateUserState(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(getErrorMessage(error));
        throw error;
      }

      if (data?.user) {
        const profile = await fetchUserProfile(data.user.id);
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.name,
          phone: data.user.phone,
          role: profile?.role || 'user'
        });
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      if (error instanceof AuthApiError) {
        toast.error(getErrorMessage(error));
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, phone: string) => {
    try {
      console.log("Starting signup process...");
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
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
        return { error };
      }

      if (data?.user) {
        console.log("Signup successful:", data);
        if (data.session === null) {
          return { needsEmailVerification: true };
        }
        return {};
      }

      return { error: new Error("Something went wrong during signup") as AuthError };
    } catch (error) {
      console.error("Signup process error:", error);
      if (error instanceof AuthApiError) {
        return { error };
      }
      return { error: new Error("An unexpected error occurred") as AuthError };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      if (error instanceof AuthApiError) {
        toast.error(getErrorMessage(error));
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, sendOTP, verifyOTP }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
