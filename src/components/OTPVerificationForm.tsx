import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

interface OTPVerificationFormProps {
  otp: string;
  setOtp: (value: string) => void;
  phone: string;
  resendDisabled: boolean;
  resendTimer: number;
  handleResendOTP: () => Promise<void>;
  handleVerifyOTP: (e: React.FormEvent) => Promise<void>;
}

export const OTPVerificationForm = ({
  otp,
  setOtp,
  resendDisabled,
  resendTimer,
  handleResendOTP,
  handleVerifyOTP,
}: OTPVerificationFormProps) => {
  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="space-y-2">
        <Label>Enter OTP</Label>
        <InputOTP
          value={otp}
          onChange={(value) => setOtp(value)}
          maxLength={6}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, index) => (
                <InputOTPSlot key={index} {...slot} />
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
  );
};