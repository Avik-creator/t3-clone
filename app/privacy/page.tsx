import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">
            Privacy Policy
          </h1>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p>Last updated: December 29, 2025</p>
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us when you
                create an account, use our services, or communicate with us.
                This may include your name, email address, and any other
                information you choose to provide.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. How We Use Your Information
              </h2>
              <p>
                We use the information we collect to provide, maintain, and
                improve our services, to develop new ones, and to protect T3
                Chat and our users.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Data Security
              </h2>
              <p>
                We take reasonable measures to help protect information about
                you from loss, theft, misuse and unauthorized access,
                disclosure, alteration and destruction.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at privacy@t3chat.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
