import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { PT_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import PageLoader from "@/components/PageLoader";
import NavigationProgressBar from "@/components/NavigationProgressBar";
import { Suspense } from "react";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});
  
const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Fallback components for Suspense
const NavigationProgressBarFallback = () => null;
const PageLoaderFallback = () => null;

export const metadata: Metadata = {
  title: "AI Copilot - Automation Made Visual",
  description: "Design and visualize your automation workflows with AI assistance. Create, share, and export your workflows seamlessly.",
  keywords: ["AI automation", "workflow builder", "visual automation", "AI copilot", "workflow design", "automation tools"],
  authors: [{ name: "AI Copilot Team" }],
  creator: "AI Copilot",
  publisher: "AI Copilot",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL("https://ai-copilot.vercel.app"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="light" suppressHydrationWarning>
        <head>
          <meta name="theme-color" content="#ffffff" />
          <meta name="msapplication-TileColor" content="#5bbad5" />
        </head>
        <body className={`${nunito.variable} ${ptSans.variable} antialiased relative`} suppressHydrationWarning>
          <div className="texture"/>
          <Providers>
            <Suspense fallback={<NavigationProgressBarFallback />}>
              <NavigationProgressBar />
            </Suspense>
            <Suspense fallback={<PageLoaderFallback />}>
              <PageLoader />
            </Suspense>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}