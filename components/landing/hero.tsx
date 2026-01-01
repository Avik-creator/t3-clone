"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/authClient";
import { ArrowRight, Plus, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Hero = () => {
  const { data: session } = useSession();

  return (
    <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8">
              <Sparkles className="mr-2 h-4 w-4" />
              Powered by Advanced AI Models
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl mb-6">
              The Next Gen{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI Chat Experience.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl mb-10 max-w-xl">
              Chat with multiple AI models in one place. Fast, secure, and
              designed for the ultimate productivity.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {session ? (
                <Link href="/chat" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base gap-2 w-full"
                  >
                    Start New Thread
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base gap-2 w-full"
                  >
                    Get Started for Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mock Chat Interface */}
          <div className="relative">
            <div className="rounded-2xl border border-muted bg-card shadow-2xl overflow-hidden flex flex-col h-[500px]">
              {/* Chat Header */}
              <div className="p-4 border-b border-muted flex justify-between items-center bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  New Thread
                </span>
                <div className="w-12" />
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Image src="/logo.svg" alt="T3 Chat" width={16} height={16} className="rounded-full" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl p-4 text-sm max-w-[85%] leading-relaxed">
                    Hello! How can I help you today? You can ask me anything or
                    start a new thread to explore different topics.
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl p-4 text-sm max-w-[85%] leading-relaxed shadow-lg shadow-primary/20">
                    Tell me about the latest AI models available here.
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Image src="/logo.svg" alt="T3 Chat" width={16} height={16} className="rounded-full" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl p-4 text-sm max-w-[85%] leading-relaxed">
                    We support GPT-5, Claude 4.5, and many other
                    state-of-the-art models. You can switch between them
                    seamlessly!
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-muted bg-background">
                <div className="relative">
                  <div className="min-h-[60px] w-full rounded-xl border border-muted bg-muted/20 p-3 text-sm text-muted-foreground flex items-center">
                    Type your message here...
                  </div>
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground hidden sm:block">
                      Press Enter to send
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                      <Send className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[10px] text-center text-muted-foreground leading-tight">
                  Make sure you agree to our{" "}
                  <Link
                    href="/terms"
                    className="underline hover:text-foreground transition-colors"
                  >
                    Terms
                  </Link>{" "}
                  and our{" "}
                  <Link
                    href="/privacy"
                    className="underline hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 h-64 w-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-12 -left-12 h-64 w-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
