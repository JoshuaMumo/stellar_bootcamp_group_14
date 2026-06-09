#![cfg(test)]

use crate::{cert_chain::{CertContract, CertContractClient}, storage::CertStatus};
use soroban_sdk::{testutils::Address as _, Address, Env, String, Symbol};

pub struct SetupResult<'a> {
    env:        Env,
    client:     CertContractClient<'a>,
    admin:      Address,
    university: Address,
}

fn setup<'a>() -> SetupResult<'a> {
    let env = Env::default();
    env.mock_all_auths();

    let admin      = Address::generate(&env);
    let university = Address::generate(&env);

    let contract_id = env.register(CertContract, ());
    let client      = CertContractClient::new(&env, &contract_id);

    client.init(&admin);
    client.add_issuer(&admin, &university);

    SetupResult { env, client, admin, university }
}

fn make_hash(env: &Env, val: &str) -> String {
    String::from_str(env, val)
}

fn make_degree(env: &Env) -> Symbol {
    Symbol::new(env, "BSc_CS")
}

#[test]
fn test_init_sets_admin() {
    let s = setup();

    let new_uni = Address::generate(&s.env);
    s.client.add_issuer(&s.admin, &new_uni);

    assert!(s.client.is_whitelisted(&new_uni));
}


#[test]
fn test_add_issuer_whitelists_address() {
    let s = setup();

    let new_uni = Address::generate(&s.env);
    assert!(!s.client.is_whitelisted(&new_uni));

    s.client.add_issuer(&s.admin, &new_uni);
    assert!(s.client.is_whitelisted(&new_uni));
}

#[test]
fn test_remove_issuer_revokes_whitelist() {
    let s = setup();

    assert!(s.client.is_whitelisted(&s.university));
    s.client.remove_issuer(&s.admin, &s.university);
    assert!(!s.client.is_whitelisted(&s.university));
}

#[test]
fn test_non_admin_cannot_add_issuer_returns_error() {
    let s = setup();

    let rogue  = Address::generate(&s.env);
    let victim = Address::generate(&s.env);

    let result = s.client.try_add_issuer(&rogue, &victim);
    assert!(result.is_err());
}

#[test]
fn test_issue_cert_stores_valid_record() {
    let s = setup();

    let hash = make_hash(&s.env, "a3f8c2d1e9b7f04a56cd890ef1234567890abcdef1234567890abcdef12345678");

    s.client.issue_cert(
        &s.university,
        &hash,
        &String::from_str(&s.env, "UON-2024-001"),
        &make_degree(&s.env),
        &2024u32,
    );

    let record = s.client.verify(&hash).unwrap();
    assert_eq!(record.status,     CertStatus::Valid);
    assert_eq!(record.year,       2024);
    assert_eq!(record.student_id, String::from_str(&s.env, "UON-2024-001"));
    assert_eq!(record.issuer,     s.university);
}

#[test]
fn test_duplicate_hash_returns_error() {
    let s = setup();

    let hash = make_hash(&s.env, "dupe00000000000000000000000000000000000000000000000000000000000000");

    s.client.issue_cert(
        &s.university,
        &hash,
        &String::from_str(&s.env, "UON-2024-002"),
        &make_degree(&s.env),
        &2024u32,
    );

    let result = s.client.try_issue_cert(
        &s.university,
        &hash,
        &String::from_str(&s.env, "UON-2024-002"),
        &make_degree(&s.env),
        &2024u32,
    );

    assert!(result.is_err());
}

#[test]
fn test_non_whitelisted_cannot_issue_returns_error() {
    let s = setup();

    let rogue = Address::generate(&s.env);
    let hash  = make_hash(&s.env, "rogue0000000000000000000000000000000000000000000000000000000000000");

    let result = s.client.try_issue_cert(
        &rogue,
        &hash,
        &String::from_str(&s.env, "FAKE-001"),
        &make_degree(&s.env),
        &2024u32,
    );

    assert!(result.is_err());
}


#[test]
fn test_verify_returns_none_for_unknown_hash() {
    let s = setup();

    let result = s.client.verify(
        &make_hash(&s.env, "000000000000000000000000000000000000000000000000000000000000beef")
    );

    assert!(result.is_none());
}


#[test]
fn test_revoke_changes_status_to_revoked() {
    let s = setup();

    let hash = make_hash(&s.env, "b4e9d3c2f1a0e5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0");

    s.client.issue_cert(
        &s.university,
        &hash,
        &String::from_str(&s.env, "UON-2022-003"),
        &make_degree(&s.env),
        &2022u32,
    );

    s.client.revoke_cert(&s.university, &hash);

    let record = s.client.verify(&hash).unwrap();
    assert_eq!(record.status, CertStatus::Revoked);
}

#[test]
fn test_different_issuer_cannot_revoke_returns_error() {
    let s = setup();

    let other_uni = Address::generate(&s.env);
    s.client.add_issuer(&s.admin, &other_uni);

    let hash = make_hash(&s.env, "c5fa0000000000000000000000000000000000000000000000000000000000000");

    s.client.issue_cert(
        &s.university,
        &hash,
        &String::from_str(&s.env, "UON-2024-010"),
        &make_degree(&s.env),
        &2024u32,
    );

    let result = s.client.try_revoke_cert(&other_uni, &hash);
    assert!(result.is_err());
}

#[test]
fn test_revoke_nonexistent_cert_returns_error() {
    let s = setup();

    let hash   = make_hash(&s.env, "ghost0000000000000000000000000000000000000000000000000000000000000");
    let result = s.client.try_revoke_cert(&s.university, &hash);

    assert!(result.is_err());
}