# CertChain — Decentralized Student Certificate Verification
 
A decentralized application (dApp) built on the **Stellar network** using **Soroban smart contracts**. CertChain solves certificate forgery by storing SHA-256 hashes of academic certificates on an immutable blockchain. Only the hash goes on-chain — the physical or digital certificate stays off-chain.

## Project Structure
 
```
certchain/
├── .env                          # Shared environment variables 
├── smart-contract/
│   ├── Makefile                  # Build, deploy and interact targets
│   └── src/
│       ├── lib.rs                # CertContract — main contract entry
│       └── storage.rs            # CertRecord, CertStatus, DataKey types
        └── test.rs               # unit tests 
```

### Files
- `smart-contract/src/lib.rs` — main contract
- `smart-contract/src/storage.rs` — data types
- `smart-contract/Makefile` — build and deploy pipeline
### Contract Functions
 
| Function | Access | Description |
|----------|--------|-------------|
| `init(admin)` | Anyone (once) | Sets the contract admin |
| `add_issuer(admin, issuer)` | Admin only | Whitelists a university public key |
| `remove_issuer(admin, issuer)` | Admin only | Removes a university from whitelist |
| `issue_cert(issuer, hash, student_id, degree, year)` | Whitelisted issuers | Registers a certificate hash on-chain |
| `verify(hash)` | Public | Returns `Option<CertRecord>` — None if not found |
| `revoke_cert(issuer, hash)` | Original issuer only | Marks a certificate as Revoked |
| `is_whitelisted(address)` | Public | Returns bool — used by tests and frontend |
 
### Data Types (`storage.rs`)
 
```rust
pub enum CertStatus { Valid, Revoked }
 
pub struct CertRecord {
    pub student_id: String,
    pub degree:     Symbol,
    pub year:       u32,
    pub issuer:     Address,
    pub status:     CertStatus,
    pub issued_at:  u64,
}
 
pub enum DataKey {
    Cert(String),       // hash -> CertRecord
    Whitelist(Address), // address -> bool
    Admin,
}
```
 

 
Using `.has()` instead of `.get()` will return `true` even after `remove_issuer` sets the value to `false` — because the key still exists.
 
### Makefile Targets
 
```bash
make build           # compile .wasm
make test            # run all Rust tests
make debug           # run tests with full backtrace
make upload          # build + install wasm to testnet → saves wasm_hash.txt
make deploy          # deploy contract → saves contract_address.txt
make init            # call init() on deployed contract
make add-issuer      # whitelist a university (ISSUER= required)
make remove-issuer   # remove a university  (ISSUER= required)
make issue           # issue a certificate  (CERT_HASH=, STUDENT_ID=, DEGREE=, YEAR= required)
make verify          # verify a certificate (CERT_HASH= required)
make revoke          # revoke a certificate (CERT_HASH= required)
make save-address    # writes contract address back into .env
make logs            # print upload.log and deploy.log
```
 
### Generating Admin & Issuer Accounts
 
```bash
# Generate keypairs
stellar keys generate admin      --network testnet
stellar keys generate university --network testnet
 
# Fund on testnet (required before any transactions)
stellar keys fund admin      --network testnet
stellar keys fund university --network testnet
 
# Get public keys for .env
stellar keys address admin
stellar keys address university
```
 
---