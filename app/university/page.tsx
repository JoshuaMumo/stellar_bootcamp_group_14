"use client";

import { useContext, useState } from "react";
import FileUploadDropZone from "../components/FileUploadDropZone";
import AnalyticsCard from "../components/AnalyticsCard";
import TransactionsTable from "../components/TransactionsTable";
import IssueCertificate from "../components/IssueCertificate";
import { WalletContext } from "../components/WalletProvider";

const analytics = [
  {
    title: "Total Issued",
    description: "20390582",
    tags: ["Issued"],
    tagColor: "bg-green-100 text-green-700",
  },
  {
    title: "Active",
    description: "10456789",
    tags: ["Active"],
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    title: "Pending",
    description: "2578394",
    tags: ["Pending"],
    tagColor: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Revoked",
    description: "35890",
    tags: ["Revoked"],
    tagColor: "bg-red-100 text-red-700",
  },
];

export default function UniversityPortal() {
  const [activeTab, setActiveTab] = useState<"issue" | "batch" | "dashboard">(
    "dashboard",
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { connected } = useContext(WalletContext);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold text-zinc-950">
            University Portal
          </h1>
          <p className="text-lg text-zinc-600">
            Issue and manage certificate hashes on the Stellar blockchain
          </p>
        </div>

        {/* Authentication Section (hidden when wallet connected) */}
        {!connected && (
          <div className="mb-12 rounded-lg border border-[var(--button-bg)] bg-[var(--foreground)] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--button-bg)] text-white font-bold">
                🔐
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 ">
                  Wallet Connection Required
                </h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Connect your Stellar wallet to authenticate as an authorized
                  university issuer.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-zinc-200">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "dashboard"
                ? "border-b-2 border-[var(--button-bg)] text-[var(--button-bg)]"
                : "text-zinc-600 hover:text-[var(--button-bg)]"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("issue")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "issue"
                ? "border-b-2 border-[var(--button-bg)] text-[var(--button-bg)]"
                : "text-zinc-600 hover:text-[var(--button-bg)]"
            }`}
          >
            Issue Certificate
          </button>
          <button
            onClick={() => setActiveTab("batch")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "batch"
                ? "border-b-2 border-[var(--button-bg)] text-[var(--button-bg)]"
                : "text-zinc-600 hover:text-[var(--button-bg)]"
            }`}
          >
            Batch Upload
          </button>
        </div>

        {/* Issue Single Certificate */}
        {activeTab === "issue" && (
          <IssueCertificate onFileSelect={(file) => setUploadedFile(file)} />
        )}

        {/* Batch Upload */}
        {activeTab === "batch" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <h3 className="mb-4 font-semibold text-zinc-900">
                CSV Format Requirements
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="px-4 py-2 font-semibold">Column</th>
                      <th className="px-4 py-2 font-semibold">Example</th>
                      <th className="px-4 py-2 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-100">
                      <td className="px-4 py-2 font-mono text-orange-600">
                        student_id
                      </td>
                      <td className="px-4 py-2">STU-2024-001234</td>
                      <td className="px-4 py-2 text-zinc-600">
                        Unique student identifier
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="px-4 py-2 font-mono text-orange-600">
                        graduation_year
                      </td>
                      <td className="px-4 py-2">2024</td>
                      <td className="px-4 py-2 text-zinc-600">
                        Year of graduation
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-orange-600">
                        degree_type
                      </td>
                      <td className="px-4 py-2">Bachelor of Science</td>
                      <td className="px-4 py-2 text-zinc-600">
                        Type of degree awarded
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-zinc-900">
                Upload CSV File
              </label>
              <FileUploadDropZone
                onFileSelect={(file) => setUploadedFile(file)}
                accepts=".csv"
                label="Upload CSV"
              />
              {uploadedFile && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-green-50 p-4 text-sm">
                    <p className="font-medium text-green-900">✓ File ready</p>
                    <p className="text-green-700">{uploadedFile.name}</p>
                  </div>
                  <button className="w-full rounded-lg bg-[var(--button-bg)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--button-bg-hover)] cursor-pointer">
                    Process Batch Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {analytics.map((item) => (
                <AnalyticsCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                  tagColor={item.tagColor}
                  href={`/university/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                />
              ))}
            </div>

            <TransactionsTable itemsPerPage={5} title="Recent Transactions" />
          </div>
        )}
      </div>
    </main>
  );
}
