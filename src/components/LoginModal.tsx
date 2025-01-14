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

export const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { login, signup, sendOTP, verifyOTP } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        if (!phone) {
          toast.error("Phone number is required");
          return;
        }
        await signup(email, password, name, phone);
        setIsVerifying(true);
        await sendOTP(phone);
      } else {
        await login(email, password);
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const verified = await verifyOTP(phone, otp);
      if (verified) {
        setIsOpen(false);
        setIsVerifying(false);
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
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
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
            </div>
            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
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