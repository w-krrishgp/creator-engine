import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CreatorProvider } from "@/context/CreatorContext";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creator Engine — Creator Monetisation & Brand Opportunity Engine",
  description:
    "Data-driven growth intelligence, explainable brand matchmaking, 30/60/90-day roadmaps, and actionable monetization workflows for ambitious creators.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-[#f8fafc] text-slate-900 font-sans text-base leading-relaxed">
        <CreatorProvider>
          <AppLayout>{children}</AppLayout>
        </CreatorProvider>
      </body>
    </html>
  );
}
