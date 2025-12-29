import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CTA = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 sm:px-16 sm:py-24 text-center shadow-2xl">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
              <defs>
                <pattern
                  id="grid"
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
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-5xl mb-6">
              Ready to start your first thread?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80 mb-10">
              Join thousands of users who are already using T3 Chat to boost
              their productivity with AI. Sign up today and experience the
              difference.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8 text-base font-semibold w-full"
                >
                  Get Started Now
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10 w-full"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
