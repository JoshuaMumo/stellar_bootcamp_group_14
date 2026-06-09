"use client";

import { useState } from "react";

type FileUploadDropZoneProps = {
  onFileSelect: (file: File) => void;
  accepts?: string;
  label?: string;
};

export default function FileUploadDropZone({
  onFileSelect,
  accepts = ".pdf,.doc,.docx",
  label = "Upload Certificate",
}: FileUploadDropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`rounded-lg border-2 border-dashed transition ${
        isDragActive
          ? "border-orange-500 bg-orange-50"
          : "border-zinc-300 bg-zinc-50 hover:border-zinc-400"
      }`}
    >
      <label className="flex cursor-pointer flex-col items-center justify-center px-6 py-12">
        <svg
          className="mb-2 h-12 w-12 text-zinc-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v24a4 4 0 004 4h24a4 4 0 004-4V20m-14-12l6 6m6-6l-6 6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="mb-1 text-sm font-semibold text-zinc-900">
          {label}
        </span>
        <span className="text-xs text-zinc-500">or drag and drop</span>
        <span className="mt-1 text-xs text-zinc-400">{accepts}</span>
        <input
          type="file"
          className="hidden"
          accept={accepts}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
