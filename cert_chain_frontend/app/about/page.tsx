export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-4xl font-bold text-zinc-950">About CertChain</h1>
      <p className="mb-6 text-lg text-zinc-600">
        CertChain is a decentralized certificate verification platform built on
        the Stellar blockchain using Soroban smart contracts. Our mission is to
        eliminate certificate forgery and streamline credential verification for
        universities and employers worldwide.
      </p>
      <h2 className="mb-4 text-2xl font-bold text-zinc-950">Our Story</h2>
      <p className  ="mb-6 text-lg text-zinc-600">
        Founded in 2026 by a team of blockchain enthusiasts and education
        professionals during the Stellar Impact Bootcamp, CertChain was born out of the frustration with
        traditional certificate verification methods. We recognized the
        potential of blockchain technology to provide a secure, transparent, and
        efficient solution for managing academic credentials.
      </p>
      <h2 className="mb-4 text-2xl font-bold text-zinc-950">Our Technology</h2>
      <p className="mb-6 text-lg text-zinc-600">
        CertChain leverages Soroban smart contracts to create an immutable
        record of certificate hashes on the Stellar blockchain. Universities can
        issue certificates by uploading their hashes, while employers can verify
        credentials instantly by querying the blockchain. This decentralized
        approach ensures security, transparency, and trust in the verification
        process.
      </p>
      <h2 className="mb-4 text-2xl font-bold text-zinc-950">Our Vision</h2>
      <p className="mb-6 text-lg text-zinc-600">
        We envision a world where academic credentials are universally trusted
        and easily verifiable, empowering individuals to showcase their
        achievements and enabling employers to make informed hiring decisions.
        By harnessing the power of blockchain technology, CertChain aims to
        revolutionize the way we manage and verify educational credentials
        globally.
      </p>

      <div>
        <div className="flex items-center space-x-2 text-base">
          <h4 className="font-semibold text-slate-900">Contributors</h4>
          <span className="bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 ...">
            5
          </span>
        </div>
        <div className="mt-3 flex -space-x-2 overflow-hidden">
          <img
            className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <img
            className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <img
            className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
            alt=""
          />
          <img
            className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <img
            className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </div>
        <div className="mt-3 text-sm font-medium">
          <a href="#" className="text-blue-500">
            {/* + 198 others */}
          </a>
        </div>
      </div>
    </div>
  );
}