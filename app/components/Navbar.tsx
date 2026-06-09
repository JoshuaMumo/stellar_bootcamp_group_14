"use client";

import Link from "next/link";
import WalletConnectButton from "./WalletConnectButton";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[var(--button-bg)]">
              CertChain
            </span>
            {/* <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Soroban
            </span> */}
          </Link>

          <div className="flex items-center gap-8">
            <div className="hidden sm:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-zinc-700 transition hover:text-[var(--button-bg)]"
              >
                Home
              </Link>
              <Link
                href="/university"
                className="text-sm font-medium text-zinc-700 transition hover:text-[var(--button-bg)]"
              >
                University
              </Link>
              <Link
                href="/employer"
                className="text-sm font-medium text-zinc-700 transition hover:text-[var(--button-bg)]"
              >
                Employer
              </Link>
              <Link
                href="/verify"
                className="text-sm font-medium text-zinc-700 transition hover:text-[var(--button-bg)]"
              >
                Verify
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-zinc-700 transition hover:text-[var(--button-bg)]"
              >
                Register
              </Link>
            </div>

            <WalletConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
