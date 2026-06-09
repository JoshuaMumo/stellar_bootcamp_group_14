"use client";

import { useState, useMemo } from "react";
import FileUploadDropZone from "./FileUploadDropZone";

type Student = {
  studentId: string;
  name: string;
  graduationYear: number;
  degreeType: string;
  email: string;
  department: string;
};

type IssueCertificateProps = {
  onFileSelect?: (file: File) => void;
};

const mockStudents: Student[] = [
  {
    studentId: "STU-2024-001234",
    name: "Alice Johnson",
    graduationYear: 2024,
    degreeType: "Bachelor of Science",
    email: "alice.johnson@university.edu",
    department: "Computer Science",
  },
  {
    studentId: "STU-2024-001235",
    name: "Bob Smith",
    graduationYear: 2024,
    degreeType: "Master of Arts",
    email: "bob.smith@university.edu",
    department: "English Literature",
  },
  {
    studentId: "STU-2024-001236",
    name: "Carol Davis",
    graduationYear: 2023,
    degreeType: "Bachelor of Arts",
    email: "carol.davis@university.edu",
    department: "History",
  },
  {
    studentId: "STU-2024-001237",
    name: "David Wilson",
    graduationYear: 2024,
    degreeType: "Master of Science",
    email: "david.wilson@university.edu",
    department: "Physics",
  },
  {
    studentId: "STU-2024-001238",
    name: "Emma Martinez",
    graduationYear: 2024,
    degreeType: "PhD in Computer Science",
    email: "emma.martinez@university.edu",
    department: "Computer Science",
  },
  {
    studentId: "STU-2024-001239",
    name: "Frank Brown",
    graduationYear: 2025,
    degreeType: "Bachelor of Engineering",
    email: "frank.brown@university.edu",
    department: "Engineering",
  },
  {
    studentId: "STU-2024-001240",
    name: "Grace Lee",
    graduationYear: 2024,
    degreeType: "Master of Business Administration",
    email: "grace.lee@university.edu",
    department: "Business",
  },
  {
    studentId: "STU-2024-001241",
    name: "Henry Taylor",
    graduationYear: 2023,
    degreeType: "Bachelor of Science",
    email: "henry.taylor@university.edu",
    department: "Biology",
  },
];

export default function IssueCertificate({
  onFileSelect,
}: IssueCertificateProps) {
  const [studentIdInput, setStudentIdInput] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredStudents = useMemo(() => {
    if (!studentIdInput.trim()) return [];
    return mockStudents.filter((student) =>
      student.studentId.toLowerCase().includes(studentIdInput.toLowerCase()),
    );
  }, [studentIdInput]);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentIdInput(student.studentId);
    setShowSuggestions(false);
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    onFileSelect?.(file);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-6">
          {/* Student ID Search with Autocomplete */}
          <div className="relative">
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              Student ID
            </label>
            <input
              type="text"
              placeholder="Enter Student ID (e.g., STU-2024-001234)"
              value={studentIdInput}
              onChange={(e) => {
                setStudentIdInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
            />

            {/* Autocomplete Dropdown */}
            {showSuggestions && filteredStudents.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-64 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg">
                {filteredStudents.map((student) => (
                  <button
                    key={student.studentId}
                    onClick={() => handleSelectStudent(student)}
                    className="w-full border-b border-zinc-100 px-4 py-3 text-left transition hover:bg-zinc-50 last:border-0"
                  >
                    <div className="font-semibold text-zinc-900">
                      {student.studentId}
                    </div>
                    <div className="text-sm text-zinc-600">{student.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              Graduation Year
            </label>
            <input
              type="number"
              placeholder="e.g., 2024"
              value={selectedStudent?.graduationYear || ""}
              readOnly
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 bg-zinc-50 placeholder-zinc-400 focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Degree Type */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              Degree Type
            </label>
            <input
              type="text"
              placeholder="Select a student first"
              value={selectedStudent?.degreeType || ""}
              readOnly
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 bg-zinc-50 placeholder-zinc-400 focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Department */}
          {selectedStudent && (
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                Department
              </label>
              <input
                type="text"
                value={selectedStudent.department}
                readOnly
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 bg-zinc-50 placeholder-zinc-400 focus:outline-none cursor-not-allowed"
              />
            </div>
          )}

          {/* Student Email */}
          {selectedStudent && (
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                Email
              </label>
              <input
                type="email"
                value={selectedStudent.email}
                readOnly
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 bg-zinc-50 placeholder-zinc-400 focus:outline-none cursor-not-allowed"
              />
            </div>
          )}

          <button
            disabled={!selectedStudent || !uploadedFile}
            className="w-full rounded-lg bg-[var(--button-bg)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--button-bg-hover)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate & Sign Transaction
          </button>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-zinc-900">
            Upload Certificate (PDF)
          </label>
          <FileUploadDropZone
            onFileSelect={handleFileSelect}
            accepts=".pdf"
            label="Upload Certificate"
          />
          {uploadedFile && (
            <div className="rounded-lg bg-green-50 p-4 text-sm">
              <p className="font-medium text-green-900">✓ File ready</p>
              <p className="text-green-700">{uploadedFile.name}</p>
            </div>
          )}

          {/* Student Summary */}
          {selectedStudent && (
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Selected Student
              </h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {selectedStudent.name}
                </p>
                <p>
                  <span className="font-medium">ID:</span>{" "}
                  {selectedStudent.studentId}
                </p>
                <p>
                  <span className="font-medium">Degree:</span>{" "}
                  {selectedStudent.degreeType}
                </p>
                <p>
                  <span className="font-medium">Graduation:</span>{" "}
                  {selectedStudent.graduationYear}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
