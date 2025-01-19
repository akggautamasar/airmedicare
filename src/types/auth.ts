import { AuthError } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  phone?: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<{ error?: AuthError; needsEmailVerification?: boolean }>;
  logout: () => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
}