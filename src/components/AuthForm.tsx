import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  isSignup: boolean;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setIsSignup: (value: boolean) => void;
}

export const AuthForm = ({
  isSignup,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  phone,
  setPhone,
  handleSubmit,
  setIsSignup,
}: AuthFormProps) => {
  return (
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
  );
};