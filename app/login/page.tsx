'use client';

import { signIn } from '@/lib/authClient';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Github } from 'lucide-react';

export default function LoginPage() {
  const isMobile = useIsMobile();

  const handleGitHubLogin = async () => {
    await signIn.social({
      provider: 'github',
      callbackURL: '/',
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />
      
      <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] sm:h-80 sm:w-80" />
      <div className="absolute right-0 bottom-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/30 blur-[120px] sm:h-80 sm:w-80" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 sm:max-w-lg">
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center rounded-2xl border border-border bg-card/50 p-3 shadow-lg backdrop-blur-sm sm:p-4">
              <div className="rounded-xl bg-primary/10 p-3 sm:p-4">
                <svg
                  className="h-8 w-8 text-primary sm:h-10 sm:w-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base lg:text-lg">
                Sign in to continue to your account
              </p>
            </div>
          </div>

          <div className="space-y-6 rounded-2xl border border-border bg-card/50 p-6 shadow-xl backdrop-blur-sm sm:p-8 lg:space-y-8 lg:p-10">
            <div className="space-y-4">
              <Button
                onClick={handleGitHubLogin}
                size={isMobile ? 'default' : 'lg'}
                className="group relative w-full overflow-hidden bg-foreground text-background transition-all hover:bg-foreground/90 hover:shadow-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <Github className="h-5 w-5 sm:h-5 sm:w-5" />
                <span className="text-sm font-medium sm:text-base">
                  Continue with GitHub
                </span>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase sm:text-sm">
                <span className="bg-card px-2 text-muted-foreground">
                  Secure authentication
                </span>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4 sm:space-y-4 sm:p-6">
              <div className="flex items-start space-x-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium text-foreground sm:text-sm">
                    Protected by Better Auth
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your data is encrypted and secure
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium text-foreground sm:text-sm">
                    Lightning fast
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Single sign-on with your GitHub account
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground sm:text-sm">
              By continuing, you agree to our{' '}
              <a
                href="#"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 text-center sm:bottom-6 sm:left-6 sm:right-6">
        <div className="inline-flex items-center space-x-2 rounded-full border border-border/50 bg-card/30 px-3 py-1.5 text-xs backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-muted-foreground">All systems operational</span>
        </div>
      </div>
    </div>
  );
}
