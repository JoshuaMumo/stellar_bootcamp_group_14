import type { Metadata } from "next";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import WalletProvider from "./components/WalletProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CertChain - Decentralized Certificate Verification",
  description:
    "Verify educational certificates instantly using Stellar Soroban smart contracts. Eliminate certificate forgery with blockchain-backed verification.",
  keywords: [
    "certificate verification",
    "Stellar network",
    "Soroban",
    "blockchain",
    "education",
    "dApp",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-full flex-col bg-[var(--foreground)] text-zinc-900">
        <WalletProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
