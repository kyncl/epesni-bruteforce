use std::collections::HashMap;

use tauri::Window;

use crate::{
    hashing::{table_unhashing, unhashing},
    user::User,
};

pub mod hashing;
pub mod rainbow;
pub mod user;

#[tauri::command]
async fn unhash(hash: String, char_set: Vec<String>, pepper: Option<String>) -> String {
    unhashing::unhash(&hash, &char_set, pepper.as_deref())
}

#[tauri::command]
async fn unhash_table(
    window: Window,
    users: Vec<User>,
    char_set: Vec<String>,
    pepper: Option<String>,
    known_hashes: HashMap<String, String>,
) -> Vec<User> {
    table_unhashing::unhash_table(window, users, char_set, pepper, known_hashes).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![unhash, unhash_table])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
