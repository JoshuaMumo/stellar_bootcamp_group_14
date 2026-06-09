"use client";

import { useState } from "react";
import FileUploadDropZone from "../components/FileUploadDropZone";
import VerificationResult from "../components/VerificationResult";

type VerificationStatus =
  | "verified"
  | "not-found"
  | "revoked"
  | "loading"
  | null;

export default function EmployerPortal() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>(null);
  const [certificateHash, setCertificateHash] = useState<string>("");

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setVerificationStatus(null);
  };

  const handleVerify = async () => {
    if (!uploadedFile) return;

    // Simulate loading state
    setVerificationStatus("loading");

    // Simulate hash generation and verification
    setTimeout(() => {
      // Mock hash generation
      const mockHash = `sha256_${Math.random().toString(36).substr(2, 9)}`;
      setCertificateHash(mockHash);

      // Simulate API response - randomize for demo
      const statuses: VerificationStatus[] = [
        "verified",
        "not-found",
        "revoked",
      ];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      setVerificationStatus(randomStatus);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold text-zinc-950">
            Employer Portal
          </h1>
          <p className="text-lg text-zinc-600">
            Verify candidate credentials instantly by querying the Stellar
            blockchain
          </p>
        </div>

        {/* Information Card */}
        <div className="mb-12 rounded-lg border border-green-200 bg-[var(--foreground)] p-6">
          <h3 className="mb-2 font-semibold text-green-900">How It Works</h3>
          <ol className="space-y-2 text-sm text-green-800">
            <li>
              <span className="font-medium">1. Upload Certificate:</span> Drag
              and drop or select the candidate's digital certificate (PDF)
            </li>
            <li>
              <span className="font-medium">2. Generate Hash:</span> CertChain
              automatically computes the SHA-256 hash
            </li>
            <li>
              <span className="font-medium">3. Query Blockchain:</span> The hash
              is queried against the Stellar Soroban smart contract
            </li>
            <li>
              <span className="font-medium">4. Instant Result:</span> See
              verification status: Verified, Not Found, or Revoked
            </li>
          </ol>
        </div>

        {/* Main Verification Section */}
        <div className="rounded-lg border border-zinc-200 bg-white p-8">
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="mb-4 block text-lg font-semibold text-zinc-900">
                Upload Certificate to Verify
              </label>
              <FileUploadDropZone
                onFileSelect={handleFileSelect}
                accepts=".pdf,.doc,.docx"
                label="Upload Certificate"
              />
            </div>

            {/* File Info */}
            {uploadedFile && (
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📄</span>
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-blue-700">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Verify Button */}
            {uploadedFile && verificationStatus !== "loading" && (
              <button
                onClick={handleVerify}
                className="w-full rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                Verify Certificate
              </button>
            )}

            {/* Verification Result */}
            {verificationStatus && (
              <div className="space-y-4">
                <VerificationResult
                  status={verificationStatus}
                  certificateHash={certificateHash}
                  metadata={
                    verificationStatus === "verified"
                      ? {
                          studentId: "STU-2024-001234",
                          graduationYear: 2024,
                          degreeType: "Bachelor of Science",
                        }
                      : undefined
                  }
                />

                {verificationStatus === "verified" && (
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm text-green-800">
                      ✓ This candidate's certificate is valid and verified on
                      the Stellar blockchain. You can proceed with confidence.
                    </p>
                  </div>
                )}

                {verificationStatus === "not-found" && (
                  <div className="rounded-lg bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-800">
                      ⚠ This certificate hash is not found in the CertChain
                      registry. Verify the document with the issuing institution
                      directly.
                    </p>
                  </div>
                )}

                {verificationStatus === "revoked" && (
                  <div className="rounded-lg bg-red-50 p-4">
                    <p className="text-sm text-red-800">
                      ✕ This certificate has been revoked. Contact the issuing
                      institution for more information.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setVerificationStatus(null);
                    setCertificateHash("");
                  }}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-900 transition hover:bg-zinc-50"
                >
                  Verify Another Certificate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold text-zinc-950">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="rounded-lg border border-zinc-200 bg-white p-6">
              <summary className="cursor-pointer font-semibold text-zinc-900">
                What file formats are supported?
              </summary>
              <p className="mt-3 text-zinc-600">
                CertChain supports PDF, DOC, and DOCX formats. The system
                generates a SHA-256 hash from the file content to ensure
                consistent verification.
              </p>
            </details>

            <details className="rounded-lg border border-zinc-200 bg-white p-6">
              <summary className="cursor-pointer font-semibold text-zinc-900">
                How long does verification take?
              </summary>
              <p className="mt-3 text-zinc-600">
                Verification typically completes within 1-2 seconds. The process
                involves hash generation and a smart contract query on the
                Stellar blockchain.
              </p>
            </details>

            <details className="rounded-lg border border-zinc-200 bg-white p-6">
              <summary className="cursor-pointer font-semibold text-zinc-900">
                Is my data private?
              </summary>
              <p className="mt-3 text-zinc-600">
                Yes! CertChain only stores certificate hashes on-chain, not the
                actual documents. Your uploaded files are processed locally and
                are not stored on our servers.
              </p>
            </details>

            <details className="rounded-lg border border-zinc-200 bg-white p-6">
              <summary className="cursor-pointer font-semibold text-zinc-900">
                What does "Revoked" mean?
              </summary>
              <p className="mt-3 text-zinc-600">
                A revoked certificate means the issuing institution has marked
                it as invalid, typically due to academic misconduct, fraud, or
                other policy violations. Do not proceed with hiring.
              </p>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}
