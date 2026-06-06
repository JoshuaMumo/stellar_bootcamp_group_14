use soroban_sdk::{Address, Env, String, Symbol, contract, contractimpl};

use crate::storage::{CertRecord, CertStatus, DataKey};

#[contract]
pub struct CertContract;

#[contractimpl]
impl CertContract {
    // setting the admin
    pub fn init(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().persistent().set(&DataKey::Admin, &admin);
    }

    // confirming if the caller is admin
    fn assert_admin(env:Env, caller:Address) {
        let admin:Address = env.storage().persistent().get(&DataKey::Admin).expect("contract not initialized");
        assert!(admin == caller, "caller is not admin");
    }

    // confirming if the caller is the university, issuer
    fn assert_issuer(env: Env, caller: Address) {
        let is_listed: bool = env.storage().persistent().get::<DataKey, bool>(&DataKey::Whitelist(caller)).unwrap_or(false);
        assert!(is_listed, "caller is not a whitelisted issuer");
    }
    // confirming if the issuer is given priviledges for sending the certificate
    pub fn is_whitelisted(env:Env, caller:Address) -> bool {
        env.storage().persistent().get::<DataKey, bool>(&DataKey::Whitelist(caller)).unwrap_or(false)
    }

    pub fn add_issuer(env: Env, admin: Address, issuer: Address) {
        admin.require_auth();
        Self::assert_admin(env.clone(), admin.clone());
        env.storage().persistent().set(&DataKey::Whitelist(issuer), &true);
    }

    pub fn remove_issuer(env: Env, admin: Address, issuer: Address) {
        admin.require_auth();
        Self::assert_admin(env.clone(), admin.clone());
        env.storage().persistent().set(&DataKey::Whitelist(issuer), &false);
    }

    pub fn issue_cert(env: Env, issuer: Address, hash: String, student_id: String, degree: Symbol, year: u32) {
        issuer.require_auth();
        Self::assert_issuer(env.clone(), issuer.clone());

        assert!(!env.storage().persistent().has(&DataKey::Cert(hash.clone())),"Certificate hash already registered");

        let record = CertRecord {
            student_id,
            degree,
            year,
            issuer,
            status: CertStatus::Valid,
            issued_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&DataKey::Cert(hash), &record);
    }

    pub fn verify(env:Env, hash: String ) -> Option<CertRecord> {
        env.storage().persistent().get(&DataKey::Cert(hash))
    }

    pub fn revoke_cert(env: Env, issuer: Address, hash: String) {
        issuer.require_auth();
        Self::assert_issuer(env.clone(), issuer.clone());

        let mut record: CertRecord = env.storage().persistent().get(&DataKey::Cert(hash.clone())).expect("Certificate not found");
        assert!(record.issuer == issuer, "Only the original issuer can revoke");
        record.status = CertStatus::Revoked;

        env.storage().persistent().set(&DataKey::Cert(hash), &record);
    }
}