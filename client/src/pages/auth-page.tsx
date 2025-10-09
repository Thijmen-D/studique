import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  if (user) {
    return <Redirect to="/" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate({ username, password });
    } else {
      registerMutation.mutate({ username, password, email: email || undefined });
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">StudyFlow</h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? "Welcome back!" : "Create your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending || registerMutation.isPending}
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </Card>
      </div>

      <div className="hidden lg:flex flex-1 bg-primary/5 items-center justify-center p-8">
        <div className="max-w-md space-y-6">
          <h2 className="text-3xl font-bold">Your productivity companion</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg mt-1">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Track your habits</h3>
                <p className="text-sm text-muted-foreground">Build streaks and stay consistent</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg mt-1">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Manage exams</h3>
                <p className="text-sm text-muted-foreground">Stay on top of your study schedule</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg mt-1">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Monitor grades</h3>
                <p className="text-sm text-muted-foreground">Track your academic progress</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
