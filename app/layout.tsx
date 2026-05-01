import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Analytics from "./components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vertexa Solution — Custom AI & Web Solutions Agency",
  description:
    "Vertexa Solution is a custom solutions agency offering AI automation, AI call agents, web development, and app development — all built specifically for your business.",
  keywords: ["AI automation", "AI call agents", "web development", "app development", "custom solutions", "Vertexa Solution"],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} scroll-smooth`}>
      <body suppressHydrationWarning className="bg-[#0a0a0a] text-white antialiased flex flex-col min-h-screen">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
