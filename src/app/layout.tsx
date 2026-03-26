import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexusGigs | Where Talent Meets Opportunity",
  description: "The premium 3D freelance marketplace for Kenya.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-background text-white antialiased`}>
          {/* This is where the magic happens */}
          <main className="min-h-screen relative">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}