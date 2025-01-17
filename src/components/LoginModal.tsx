import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AuthForm } from "./AuthForm";
import { OTPVerificationForm } from "./OTPVerificationForm";

export const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { login, signup, sendOTP, verifyOTP } = useAuth();

  const startResendTimer = () => {
    setResendDisabled(true);
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        if (!phone) {
          toast.error("Phone number is required");
          return;
        }

        const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
        await signup(email, password, name, formattedPhone);
        setIsVerifying(true);
        await sendOTP(formattedPhone);
        startResendTimer();
        toast.success("OTP sent to your phone number");
      } else {
        await login(email, password);
        setIsOpen(false);
        toast.success("Logged in successfully");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      await sendOTP(formattedPhone);
      startResendTimer();
      toast.success("OTP resent successfully");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error(error.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const verified = await verifyOTP(formattedPhone, otp);
      if (verified) {
        setIsOpen(false);
        setIsVerifying(false);
        toast.success("Phone number verified successfully!");
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      toast.error(error.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isVerifying ? "Verify OTP" : isSignup ? "Create Account" : "Login"}</DialogTitle>
          <DialogDescription>
            {isVerifying
              ? "Enter the OTP sent to your phone"
              : isSignup
              ? "Sign up to access all features"
              : "Login to your account to continue"}
          </DialogDescription>
        </DialogHeader>
        {isVerifying ? (
          <OTPVerificationForm
            otp={otp}
            setOtp={setOtp}
            phone={phone}
            resendDisabled={resendDisabled}
            resendTimer={resendTimer}
            handleResendOTP={handleResendOTP}
            handleVerifyOTP={handleVerifyOTP}
          />
        ) : (
          <AuthForm
            isSignup={isSignup}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            handleSubmit={handleSubmit}
            setIsSignup={setIsSignup}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};