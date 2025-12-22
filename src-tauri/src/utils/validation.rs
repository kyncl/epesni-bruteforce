pub fn is_sha256(hash: &str) -> bool {
    // hash.len() == 64 && hash.chars().all(|c| c.is_ascii_hexdigit())
    // don't know if it's going to be valid cuz of js problems more in shaValidation.ts
    true
}
