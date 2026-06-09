export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--foreground)] px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-[var(--button-bg)] px-4 py-2">
          <span className="text-sm font-semibold text-white">
            Powered by Stellar Soroban
          </span>
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
          Decentralized Certificate Verification
        </h1>

        <p className="mb-8 text-lg leading-8 text-zinc-600 sm:text-xl">
          CertChain eliminates certificate forgery through immutable,
          cryptographically secure verification on the Stellar blockchain.
          Universities issue, employers verify, and trust is earned through
          transparency.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/university"
            className="rounded-lg bg-[var(--button-bg)] px-8 py-3 text-center font-semibold text-white transition hover:bg-[var(--button-bg-hover)]"
          >
            University Portal
          </a>
          <a
            href="/employer"
            className="rounded-lg border border-zinc-300 bg-white px-8 py-3 text-center font-semibold text-zinc-900 transition hover:bg-zinc-50"
          >
            Employer Portal
          </a>
        </div>
      </div>
    </section>
  );
}
