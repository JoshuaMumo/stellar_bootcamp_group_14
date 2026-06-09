"use client";

import { FormEvent, useState } from "react";
import { backend } from "@/app/services/backend-helpers";
import VerificationResult from "@/app/components/VerificationResult";

type VerificationStatus =
  | "verified"
  | "not-found"
  | "revoked"
  | "loading"
  | "error"
  | null;

type StudentMetadata = {
  studentId: string;
  graduationYear: number;
  degreeType: string;
};

function normalizeStudentData(data: any): StudentMetadata | null {
  if (!data) return null;

  const studentId = data.student_id || data.studentId || data.id || "";
  const degreeType = data.degree_name || data.degreeType || data.degree || "";
  const graduationYear =
    Number(data.graduation_year ?? data.graduationYear ?? data.year ?? 0) || 0;

  if (!studentId) return null;

  return {
    studentId,
    graduationYear,
    degreeType,
  };
}

export default function VerifyPage() {
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState<VerificationStatus>(null);
  const [metadata, setMetadata] = useState<StudentMetadata | null>(null);
  const [serverHash, setServerHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setMetadata(null);
    setErrorMessage("");

    const trimmedHash = hash.trim();
    if (!trimmedHash) {
      setErrorMessage("Please enter a certificate hash to verify.");
      return;
    }

    setIsLoading(true);
    setStatus("loading");
    setServerHash(trimmedHash);

    try {
      const response = await backend.get(
        `/certificates/${trimmedHash}/metadata/`,
        // {
        //   params: { hash: trimmedHash },
        // },
      );

      const responseData = response.data;
      const normalizedData =
        responseData?.student ||
        responseData?.student_data ||
        responseData ||
        {};

      const student = normalizeStudentData(normalizedData);
      const statusFromServer =
        responseData?.status || (student ? "verified" : "not-found");

      setMetadata(student);
      setStatus(
        statusFromServer === "revoked"
          ? "revoked"
          : statusFromServer === "not-found"
            ? "not-found"
            : student
              ? "verified"
              : "not-found",
      );
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to verify the certificate hash.";
      setStatus("error");
      setErrorMessage(
        typeof serverMessage === "string"
          ? serverMessage
          : JSON.stringify(serverMessage),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm">
          <h1 className="text-4xl font-semibold text-zinc-950 sm:text-5xl">
            Verify Certificate Hash
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Enter a certificate hash and query the backend to retrieve the
            student details linked to that hash.
          </p>
        </div>

        <form
          className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
          onSubmit={handleVerify}
        >
          <div>
            <label
              htmlFor="certificateHash"
              className="block text-sm font-semibold text-zinc-900"
            >
              Certificate Hash
            </label>
            <input
              id="certificateHash"
              value={hash}
              onChange={(event) => setHash(event.target.value)}
              placeholder="Paste the certificate hash here"
              className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-2xl bg-[var(--button-bg)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--button-bg-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Verifying..." : "Verify Hash"}
            </button>
            {serverHash && !isLoading && (
              <p className="text-sm text-zinc-500">
                Current hash: <span className="font-medium">{serverHash}</span>
              </p>
            )}
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {status && status !== "error" ? (
            <VerificationResult
              status={status === "verified" ? "verified" : status}
              certificateHash={serverHash}
              metadata={
                status === "verified" ? metadata || undefined : undefined
              }
            />
          ) : null}

          {status === "verified" && metadata ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
              Student record retrieved successfully.
            </div>
          ) : null}
        </form>
      </div>
    </main>
  );
}
