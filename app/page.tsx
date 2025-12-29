'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/authClient';
import { Button } from '@/components/ui/button';
import { Github, LogOut } from 'lucide-react';

export default function Home() {
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between px-6 py-16 sm:px-16 sm:py-32">
        <div className="flex w-full items-center justify-between">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          {!isPending && (
            <div className="flex items-center gap-3">
              {session?.user ? (
                <>
                  <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 sm:flex">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="gap-2">
                    <Github className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
            {session?.user
              ? `Welcome back, ${session.user.name?.split(' ')[0] || 'there'}!`
              : 'Welcome to your app'}
          </h1>
          <p className="max-w-md text-base leading-8 text-muted-foreground sm:text-lg">
            {session?.user ? (
              <>
                You&apos;re successfully authenticated with GitHub. Start
                building your amazing features!
              </>
            ) : (
              <>
                Get started by signing in with your GitHub account. Looking for
                more? Check out{' '}
                <a
                  href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-medium text-foreground"
                >
                  Templates
                </a>{' '}
                or the{' '}
                <a
                  href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-medium text-foreground"
                >
                  Learning
                </a>{' '}
                center.
              </>
            )}
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 text-base font-medium sm:flex-row">
          {!session?.user ? (
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="h-12 w-full gap-2 sm:w-[200px]">
                <Github className="h-5 w-5" />
                Get Started
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              className="h-12 w-full sm:w-[200px]"
              variant="default"
            >
              Dashboard
            </Button>
          )}
          <a
            className="flex h-12 w-full items-center justify-center rounded-md border border-border bg-background px-5 transition-colors hover:bg-accent sm:w-[200px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
