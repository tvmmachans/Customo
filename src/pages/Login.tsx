import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefillUser = params.get("username") || params.get("email");
    if (prefillUser) setEmail(prefillUser);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: "Signed in", description: "Welcome back!" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Sign-in failed", description: err?.message ?? "Invalid credentials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-24 pb-12 flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <Button type="button" variant="outline" onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <input id="remember" type="checkbox" className="h-4 w-4" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              New here? <a href="/signup" className="text-primary">Create an account</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;


