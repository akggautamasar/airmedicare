import { supabase } from "@/integrations/supabase/client";
import { AuthApiError } from "@supabase/supabase-js";
import { toast } from "sonner";

export const useOTP = () => {
  const sendOTP = async (phone: string) => {
    try {
      console.log("Sending OTP to:", phone);
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

      const { data: attempts, error: fetchError } = await supabase
        .from("otp_attempts")
        .select("attempts, last_attempt")
        .eq("phone", formattedPhone)
        .single();

      console.log("Current OTP attempts:", attempts);

      if (!fetchError && attempts) {
        const lastAttempt = new Date(attempts.last_attempt);
        const now = new Date();
        const timeDiff = (now.getTime() - lastAttempt.getTime()) / 1000;

        if (attempts.attempts >= 3 && timeDiff < 300) {
          throw new Error("Too many attempts. Please try again in 5 minutes.");
        }

        await supabase
          .from("otp_attempts")
          .update({
            attempts: attempts.attempts + 1,
            last_attempt: new Date().toISOString(),
          })
          .eq("phone", formattedPhone);
      } else {
        await supabase.from("otp_attempts").insert({
          phone: formattedPhone,
          attempts: 1,
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
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error("Send OTP error:", error);
      if (error instanceof AuthApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
      throw error;
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: "sms",
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      await supabase
        .from("otp_attempts")
        .update({
          attempts: 0,
          last_attempt: new Date().toISOString(),
        })
        .eq("phone", formattedPhone);

      toast.success("Phone number verified successfully!");
      return true;
    } catch (error) {
      if (error instanceof AuthApiError) {
        toast.error(error.message);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
      return false;
    }
  };

  return { sendOTP, verifyOTP };
};