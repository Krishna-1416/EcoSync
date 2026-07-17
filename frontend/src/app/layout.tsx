import type { Metadata, Viewport } from "next";
import { Manrope, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://smartstadiums.com"),
  title: "Smart Stadiums - Fan Companion",
  description: "GenAI-powered Fan Companion platform offering a multilingual concierge, real-time stadium navigation, and transportation assistance.",
  keywords: ["Stadium", "AI", "Navigation", "Concierge", "Transit", "Smart Stadiums"],
  openGraph: {
    title: "Smart Stadiums - Fan Companion",
    description: "GenAI-powered Fan Companion platform.",
    url: "https://smartstadiums.com",
    siteName: "Smart Stadiums",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Stadiums - Fan Companion",
    description: "GenAI-powered Fan Companion platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dmSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-black text-white relative pt-24">
        {children}
        <Navbar />
      </body>
    </html>
  );
}
