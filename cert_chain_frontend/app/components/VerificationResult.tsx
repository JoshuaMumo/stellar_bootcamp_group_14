type VerificationStatus =
  | "verified"
  | "not-found"
  | "revoked"
  | "loading"
  | null;

type VerificationResultProps = {
  status?: VerificationStatus;
  certificateHash?: string;
  metadata?: {
    studentId: string;
    graduationYear: number;
    degreeType: string;
  };
};

const statusConfig = {
  verified: {
    icon: "✓",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    title: "Certificate Verified",
    description: "This certificate is valid and registered on the blockchain",
  },
  "not-found": {
    icon: "✕",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    title: "Certificate Not Found",
    description: "This certificate is not registered in the CertChain network",
  },
  revoked: {
    icon: "⚠",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    title: "Certificate Revoked",
    description: "This certificate has been revoked by the issuing institution",
  },
  loading: {
    icon: "⟳",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    title: "Verifying...",
    description: "Querying the Stellar blockchain",
  },
};

export default function VerificationResult({
  status = null,
  certificateHash,
  metadata,
}: VerificationResultProps) {
  if (!status) return null;

  const config = statusConfig[status];

  return (
    <div
      className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-6`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-2xl font-bold ${config.color}`}
        >
          {config.icon}
        </div>
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold text-zinc-900">
            {config.title}
          </h3>
          <p className="mb-4 text-sm text-zinc-600">{config.description}</p>

          {certificateHash && (
            <div className="space-y-2 rounded bg-white/50 p-3">
              <p className="text-xs font-mono text-zinc-500">
                Hash:{" "}
                <span className="break-all text-zinc-700">
                  {certificateHash}
                </span>
              </p>
            </div>
          )}

          {metadata && status === "verified" && (
            <div className="mt-4 space-y-2 text-sm">
              <div>
                <span className="font-medium text-zinc-700">Student ID:</span>{" "}
                <span className="text-zinc-600">{metadata.studentId}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-700">
                  Graduation Year:
                </span>{" "}
                <span className="text-zinc-600">{metadata.graduationYear}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-700">Degree Type:</span>{" "}
                <span className="text-zinc-600">{metadata.degreeType}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
