import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EduFind - Modern School Discovery",
  description: "Find the best school for your future. Explore top schools, compare facilities, admissions, achievements and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
