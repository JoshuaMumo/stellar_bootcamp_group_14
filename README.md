# 🏆 CertChain: Decentralized Student Certificate Verification System

## 📌 Overview
CertChain is a decentralized application (dApp) built on the Stellar network using Soroban smart contracts. It solves the problem of certificate fraud by providing an immutable, cryptographically secure registry of academic credentials.

Instead of storing sensitive data on-chain, CertChain stores only SHA-256 hashes, ensuring privacy, security, and verifiability.

---

# 🧱 Project Structure

.

├── cert_chain_contract

├── cert_chain_backend

├── cert_chain_frontend

└── README.md


---

# ⚙️ Tech Stack

- Soroban Smart Contracts (Rust)
- Stellar Blockchain Network
- React + Next.js (Frontend)
- TailwindCSS
- Django REST Framework (Backend)
- JWT Authentication
- SHA-256 Hashing
- Freighter Wallet Integration

---

# 🔐 System Architecture

University Portal
      ↓
Upload PDF + Metadata
      ↓
Backend (Django)
      ↓
Generate SHA-256 Hash
      ↓
Soroban Smart Contract (Stellar)
      ↓
Store Certificate Hash On-chain
      ↓
Employer Uploads Certificate
      ↓
Hash Verification → Blockchain Query
      ↓
Verified / Not Found / Revoked

---

# 📦 Soroban Smart Contract

## 📌 Purpose
Handles on-chain certificate registry using cryptographic hashes only.

## ⚙️ Key Functions

### Issue Certificate
- Stores SHA-256 hash on-chain
- Restricted to authorized universities

### Verify Certificate
- Checks if hash exists on blockchain
- Returns verification status

### Revoke Certificate
- Marks certificate as revoked (audit-safe)

---

## 🧪 Run Contract Tests

cargo test

or

soroban contract test

---

## 🚀 Build & Deploy

soroban contract build

soroban contract deploy \
  --network testnet \
  --source alice

---

# 🐍 Backend API (Django REST Framework)

## Base URLs
Local: http://localhost:8000/api/
Production: https://cert-chain-backend.onrender.com/api/

---

## 🔐 Authentication

### POST /auth/login/

Request:
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "refresh": "...",
  "access": "..."
}

---

## 📄 Certificate Processing

### POST /certificates/process/
Auth: Required (JWT)
Content-Type: multipart/form-data

Fields:
- student_name (text)
- student_id (text)
- degree_name (text)
- graduation_year (number)
- wallet_address (text)
- pdf_file (file)

Response:
{
  "message": "Certificate processed successfully ready for on-chain registry.",
  "document_hash": "e3b0c44298fc..."
}

---

## 🔍 Public Verification

### GET /certificates/<document_hash>/metadata/

Response:
{
  "student_name": "John Doe",
  "student_id": "CS/001/2026",
  "degree_name": "BSc. Computer Science",
  "graduation_year": 2026,
  "university_name": "Maseno University",
  "status": "ACTIVE",
  "created_at": "2026-06-05T14:30:00Z"
}

---

## 🎓 Student Certificates

GET /students/<student_id>/certificates/

---

## 📚 All Certificates

GET /certificates/

---

# 🔄 Authentication Flow

1. University logs in  
2. Receives JWT token  
3. Uploads certificate + metadata  
4. Backend generates SHA-256 hash  
5. Hash sent to Soroban contract  
6. Stored on blockchain  
7. Employer uploads certificate  
8. System verifies hash  
9. Metadata returned from backend  

---

# 📊 Status Codes

| Code | Meaning |
|------|--------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / duplicate |
| 401 | Unauthorized |
| 404 | Not found |
| 500 | Server error |

---

# 🌐 Frontend

## Live Deployment
https://cert-chain-frontend.vercel.app/

---

## Run Locally

npm install
npm run dev

Open:
http://localhost:3000

---

## Features

### University Portal
- Login authentication
- Upload certificates
- Batch processing

### Employer Portal
- Upload PDF
- Instant verification
- Status:
  - Verified
  - Not Found
  - Revoked

---

# 🧪 Testing

Smart Contract:
cargo test

Backend:
python manage.py test

Frontend:
npm test

---

# 🎥 Demo Flow

1. University logs in  
2. Uploads certificate  
3. System generates hash  
4. Hash stored on blockchain  
5. Employer uploads same PDF  
6. Instant verification result  

---

# 👥 Team Roles

- Smart Contract & DevOps  
- Frontend Development  
- Backend API & Hashing  
- Web3 Integration  
- QA, Testing & Documentation  

---

# 🏁 Key Innovation

- No personal data stored on-chain  
- Instant verification  
- Immutable certificate registry  
- Global access verification system  

---

# 📌 CertChain v1.0
Built for Stellar Soroban Hackathon 🚀
