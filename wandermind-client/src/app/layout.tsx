import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WanderMind | AI-Powered Travel Platform",
  description: "Your AI-powered travel itinerary & experience platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased font-sans min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
