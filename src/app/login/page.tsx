"use client";

import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-lg shadow-primary/20">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">APMS Access</h1>
          <p className="text-muted-foreground text-sm">Asset & Property Management System</p>
        </div>

        <div className="card p-8 shadow-xl border-border/50 bg-background/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium border border-red-200 animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="name@company.com" 
                  className="input pl-10 h-12 bg-secondary/20 border-transparent focus:bg-background transition-all" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Password</label>
                <a href="#" className="text-[10px] font-bold text-primary hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  placeholder="••••••••" 
                  className="input pl-10 h-12 bg-secondary/20 border-transparent focus:bg-background transition-all" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full h-12 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-[0.98] transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In to Workspace"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
             <p className="text-xs text-muted-foreground">
                Protected by enterprise-grade security. <br/>
                <span className="font-medium">Need access? Contact your administrator.</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
