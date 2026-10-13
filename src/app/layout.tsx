import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
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
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('creator_engine_theme');
                if (t === 'dark' || (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="h-full bg-[#f8fafc] text-slate-900 font-sans text-base leading-relaxed transition-colors">
        <ThemeProvider>
          <CreatorProvider>
            <AppLayout>{children}</AppLayout>
          </CreatorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
