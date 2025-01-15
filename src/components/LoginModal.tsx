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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

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
      console.log("Starting signup/login process...");
      if (isSignup) {
        if (!phone) {
          toast.error("Phone number is required");
          return;
        }

        const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
        console.log("Attempting signup with phone:", formattedPhone);

        await signup(email, password, name, formattedPhone);
        console.log("Signup successful, sending OTP...");
        setIsVerifying(true);
        await sendOTP(formattedPhone);
        console.log("OTP sent successfully");
        startResendTimer();
        toast.success("OTP sent to your phone number!");
      } else {
        console.log("Attempting login...");
        await login(email, password);
        setIsOpen(false);
        toast.success("Logged in successfully!");
      }
    } catch (error: any) {
      console.error("Error during signup/login:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      console.log("Attempting to resend OTP...");
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      await sendOTP(formattedPhone);
      startResendTimer();
      toast.success("OTP resent successfully!");
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      toast.error(error.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Attempting to verify OTP...");
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const verified = await verifyOTP(formattedPhone, otp);
      if (verified) {
        console.log("OTP verified successfully");
        setIsOpen(false);
        setIsVerifying(false);
        toast.success("Phone number verified successfully!");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
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
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label>Enter OTP</Label>
              <InputOTP
                value={otp}
                onChange={(value) => setOtp(value)}
                maxLength={6}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot key={i} {...slots?.[i]} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            <div className="space-y-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleResendOTP}
                disabled={resendDisabled}
                className="w-full"
              >
                {resendDisabled 
                  ? `Resend OTP in ${resendTimer}s` 
                  : "Resend OTP"}
              </Button>
              <Button type="submit" className="w-full">
                Verify OTP
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91XXXXXXXXXX"
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button type="submit">{isSignup ? "Sign Up" : "Login"}</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign Up"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
