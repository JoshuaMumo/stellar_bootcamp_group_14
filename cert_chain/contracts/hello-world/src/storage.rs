use soroban_sdk::{contracttype, String,Symbol,Address};

#[contracttype]
#[derive(Clone, PartialEq, Debug)]
pub enum CertStatus {
    Valid,
    Revoked,
}
 
#[contracttype]
#[derive(Clone)]
pub struct CertRecord {
    pub student_id: String,
    pub degree:     Symbol,
    pub year:       u32,
    pub issuer:     Address,
    pub status:     CertStatus,
    pub issued_at:  u64,
}
 

#[contracttype]
pub enum DataKey {
    Cert(String),        
    Whitelist(Address),  
    Admin,
}