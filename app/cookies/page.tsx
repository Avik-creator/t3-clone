import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">
            Cookie Policy
          </h1>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p>Last updated: December 29, 2025</p>
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. What Are Cookies
              </h2>
              <p>
                Cookies are small pieces of text sent by your web browser by a
                website you visit. A cookie file is stored in your web browser
                and allows the Service or a third-party to recognize you and
                make your next visit easier and the Service more useful to you.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. How We Use Cookies
              </h2>
              <p>
                When you use and access the Service, we may place a number of
                cookies files in your web browser. We use cookies for the
                following purposes: to enable certain functions of the Service,
                to provide analytics, and to store your preferences.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Your Choices Regarding Cookies
              </h2>
              <p>
                If you'd like to delete cookies or instruct your web browser to
                delete or refuse cookies, please visit the help pages of your
                web browser.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
