import Card from "./Card";

const features = [
  {
    title: "Immutable Registry",
    description: "Certificate hashes stored permanently on Stellar blockchain",
    tags: ["Blockchain", "Secure"],
  },
  {
    title: "Privacy Preserving",
    description:
      "Only hashes stored on-chain, full certificates remain off-chain",
    tags: ["Privacy", "Secure"],
  },
  {
    title: "Instant Verification",
    description: "Employers verify credentials with a single file upload",
    tags: ["Fast", "Easy"],
  },
  {
    title: "Batch Processing",
    description: "Universities upload multiple certificates via CSV",
    tags: ["Bulk", "Efficient"],
  },
  {
    title: "Revocation Control",
    description: "Universities can revoke compromised or invalid certificates",
    tags: ["Control", "Security"],
  },
  {
    title: "Access Control",
    description: "Only whitelisted institutions can issue certificates",
    tags: ["Secure", "Verified"],
  },
];

export default function FeaturesGrid() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-zinc-950 sm:text-4xl">
            Core Features
          </h2>
          <p className="text-lg text-zinc-600">
            CertChain leverages Soroban smart contracts for secure,
            decentralized certificate management
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              title={feature.title}
              description={feature.description}
              tags={feature.tags}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
