"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const router= useRouter()
  useEffect(() => {
    fetch("/astronot.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  const handleSignup = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    
    setLoading(true);
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }
      
      // Auto-login after signup
      const result = await signIn("credentials", {
        redirect: true,
        email,
        password,
        callbackUrl: "/chat",
      });
      
      if (result?.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDE */}
      <div className="hidden md:flex md:w-1/2 relative items-center justify-center bg-black text-white overflow-hidden">
        
        <div className="absolute w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl top-10 left-10" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-8">
          
          <div className="w-100 h-100">
            {animationData && (
              <Lottie animationData={animationData} loop={true} />
            )}
          </div>

          <h1 className="text-5xl font-bold tracking-tight">
            DASSO
          </h1>

          <p className="text-zinc-400 text-lg max-w-md">
            Join Dasso and start chatting in real-time with zero friction.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white px-6">
        
        <div className="w-full max-w-sm space-y-6">
          
          <h2 className="text-2xl font-semibold text-gray-900">
            Create your account
          </h2>

          {/* Google Signup */}
          <Button
            onClick={() => signIn("google", { callbackUrl: "/chat" })}
            className="w-full bg-gray-100 text-black text-lg h-11 hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-4 h-4"
            />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-sm text-gray-500">or</span>
            <Separator className="flex-1" />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Name</label>
            <Input
              className="bg-white border-gray-300 text-black h-11 text-base"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Email</label>
            <Input
              className="bg-white border-gray-300 text-black h-11 text-base"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Password</label>
            <Input
              type="password"
              className="bg-white border-gray-300 text-black h-11 text-base"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button 
            onClick={handleSignup} 
            disabled={loading}
            className="w-full bg-black text-white hover:bg-gray-800 h-11 text-base"
          >
            {loading ? "Creating..." : "Create account"}
          </Button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Footer */}
          <p className="text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <span className="text-black font-medium cursor-pointer"
            onClick={() => {
              router.push("/login")
            }}>
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}