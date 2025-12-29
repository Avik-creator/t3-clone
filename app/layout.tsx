import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/queryProvider";
import { ThemeProvider } from "@/components/providers/themeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "T3 Chat Clone - AI-Powered Conversations",
  description:
    "Experience the next generation of AI chat with T3 Chat Clone. Fast, secure, and designed for productivity.",
  openGraph: {
    title: "T3 Chat Clone - AI-Powered Conversations",
    description:
      "Experience the next generation of AI chat with T3 Chat Clone. Fast, secure, and designed for productivity.",
    url: "https://t3chatclone.avikmukherjee.me",
    siteName: "T3 Chat Clone",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "T3 Chat Clone Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "T3 Chat Clone - AI-Powered Conversations",
    description:
      "Experience the next generation of AI chat with T3 Chat Clone. Fast, secure, and designed for productivity.",
    images: ["/og-image.png"],
    site: "@avikm744",
    creator: "@avikm744",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
