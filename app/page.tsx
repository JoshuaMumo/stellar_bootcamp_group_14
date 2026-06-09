import HeroSection from "./components/HeroSection";
import FeaturesGrid from "./components/FeaturesGrid";

export default function Home() {
  return (
    <main className="bg-white">
      <HeroSection />
      <FeaturesGrid />

      <section className="border-t border-zinc-200 bg-[var(--foreground)] px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-zinc-950 sm:text-4xl">
            How It Works
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--button-bg)] text-2xl font-bold text-white mx-auto">
                1
              </div>
              <h3 className="font-semibold text-zinc-900">University Issues</h3>
              <p className="text-sm text-zinc-600">
                Universities generate SHA-256 hashes of certificates and upload
                them to the Soroban smart contract
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--button-bg)] text-2xl font-bold text-white mx-auto">
                2
              </div>
              <h3 className="font-semibold text-zinc-900">Stored Immutably</h3>
              <p className="text-sm text-zinc-600">
                Certificate hashes are recorded permanently on the Stellar
                blockchain with access control
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--button-bg)] text-2xl font-bold text-white mx-auto">
                3
              </div>
              <h3 className="font-semibold text-zinc-900">Employer Verifies</h3>
              <p className="text-sm text-zinc-600">
                Employers upload a certificate file, CertChain generates its
                hash and queries the blockchain instantly
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
