use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    pub id: usize,
    pub username: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
    pub hash: Option<String>,
}
