"use client";

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/authClient";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-muted bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                T3 Chat
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="flex items-center gap-8">
              {session?.user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || ""}
                        width={32}
                        height={32}
                        className="rounded-full border border-muted"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {session.user.name}
                    </span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="px-6">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button & Sign In */}
          <div className="flex items-center gap-4 md:hidden">
            {!session?.user && (
              <Link href="/login">
                <Button size="sm" className="px-4 h-9 text-xs">
                  Sign In
                </Button>
              </Link>
            )}
            {session && (
              <Image
                src={session.user.image || ""}
                alt={session.user.name || ""}
                width={40}
                height={40}
                className="rounded-full border-2 border-primary/20"
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
    </nav>
  );
};
