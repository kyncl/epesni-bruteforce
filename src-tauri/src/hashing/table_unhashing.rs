use std::collections::HashMap;

use crate::user::User;

pub async fn unhash_table(
    users: Vec<User>,
    char_set: Vec<String>,
    pepper: Option<String>,
    known_hashes: HashMap<String, String>,
) -> Vec<User> {
    vec![]
}
