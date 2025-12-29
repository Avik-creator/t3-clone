import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">
            Terms of Service
          </h1>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p>Last updated: December 29, 2025</p>
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using T3 Chat, you agree to be bound by these
                Terms of Service and all applicable laws and regulations.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily use T3 Chat for personal,
                non-commercial transitory viewing only.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Disclaimer
              </h2>
              <p>
                The materials on T3 Chat are provided on an &apos;as is&apos;
                basis. T3 Chat makes no warranties, expressed or implied, and
                hereby disclaims and negates all other warranties including,
                without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Limitations
              </h2>
              <p>
                In no event shall T3 Chat or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use T3 Chat.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
