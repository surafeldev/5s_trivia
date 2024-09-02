import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { BlockchainProviders } from "@/Providers/BlockchainProviders";
import { Toaster, toast } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "5sTrivia",
  description: "Thrill trivia app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BlockchainProviders>
          <Toaster />
          {children}
          </BlockchainProviders>
        </body>
    </html>
  );
}
