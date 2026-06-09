"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { backend } from "@/app/services/backend-helpers";

type Transaction = {
  studentId: string;
  degree: string;
  studentName: string;
  status: "Active" | "Pending" | "Revoked";
  date: string;
};

type TransactionsTableProps = {
  itemsPerPage?: number;
  title?: string;
  apiPath?: string;
};

const getStatusStyles = (status: Transaction["status"]) => {
  const styles = {
    Active:
      "inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700",
    Pending:
      "inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700",
    Revoked:
      "inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700",
  };
  return styles[status];
};

export default function TransactionsTable({
  itemsPerPage: initialItemsPerPage = 5,
  title = "Recent Transactions",
  apiPath = "certificates",
}: TransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const normalizeTransaction = (item: any): Transaction => {
    const status =
      item.status === "Active" ||
      item.status === "Pending" ||
      item.status === "Revoked"
        ? item.status
        : "Pending";

    return {
      studentId: item.student_id || item.studentId || item.id || "",
      studentName: item.student_name || item.name || "",
      degree: item.degree || item.degree_type || item.degree_name || "",
      status,
      date: item.date || item.created_at || item.timestamp || "",
    };
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await backend.get(apiPath);
        const payload = response.data;

        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.results)
            ? payload.results
            : payload.data || [];

        if (!isMounted) return;

        if (!Array.isArray(items) || items.length === 0) {
          setTransactions([]);
          return;
        }

        setTransactions(items.map(normalizeTransaction));
        setCurrentPage(1);
      } catch (error) {
        console.error("Transactions fetch failed:", error);
        if (!isMounted) return;
        setErrorMessage("Unable to load transactions from the API.");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchTransactions();

    return () => {
      isMounted = false;
    };
  }, [apiPath]);

  const totalPages = Math.max(1, Math.ceil(transactions.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleItemsPerPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      1,
      Math.min(transactions.length, Number(e.target.value) || 1),
    );
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-semibold text-zinc-900">{title}</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="items-per-page" className="text-sm text-zinc-600">
            Items per page:
          </label>
          <input
            id="items-per-page"
            type="number"
            min="1"
            max={transactions.length}
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="w-16 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      {loading && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Loading transactions...
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="px-4 py-3 font-semibold">Student ID</th>
              <th className="px-4 py-3 font-semibold">Student Name</th>
              <th className="px-4 py-3 font-semibold">Degree</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-zinc-500"
                >
                  No transactions available.
                </td>
              </tr>
            ) : (
              currentTransactions.map((transaction, index) => (
                <tr
                  key={`${transaction.studentId}-${index}`}
                  className="border-b border-zinc-100"
                >
                  <td className="px-4 py-3 font-mono text-zinc-700">
                    {transaction.studentId}
                  </td>
                  <td className="px-4 py-3">{transaction.studentName}</td>
                  <td className="px-4 py-3">{transaction.degree}</td>
                  <td className="px-4 py-3">
                    <span className={getStatusStyles(transaction.status)}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {transaction.date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-zinc-600">
          Page {currentPage} of {totalPages} ({transactions.length} total
          records)
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
