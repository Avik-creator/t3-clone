import { GithubSignInButton } from "@/components/Auth/components/signInWithGitub";
import { Sparkles, CheckCircle2, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side - Visual/Info (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
            <defs>
              <pattern
                id="grid-login"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-login)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <Link href="/" className="flex items-center gap-2 mb-12 group w-fit">
            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">T3 Chat</span>
          </Link>

          <h2 className="text-4xl font-bold mb-8 leading-tight">
            Experience the next generation of AI conversation.
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Multiple AI Models</h3>
                <p className="text-primary-foreground/70">
                  Access GPT-4, Claude, and more in one unified interface.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Lightning Fast</h3>
                <p className="text-primary-foreground/70">
                  Optimized for speed with real-time streaming responses.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Privacy First</h3>
                <p className="text-primary-foreground/70">
                  Your conversations are encrypted and private by default.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-linear-to-br from-background to-muted/30">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo (Visible only on mobile) */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                T3 Chat
              </span>
            </Link>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue your threads.
            </p>
          </div>

          <div className="bg-card border border-muted rounded-2xl p-8 shadow-xl shadow-foreground/5 space-y-6">
            <GithubSignInButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Secure Authentication
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>No password required</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>One-click GitHub sign-in</span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground leading-relaxed px-4">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="underline hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
