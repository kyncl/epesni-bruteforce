use std::collections::HashMap;

use tauri::Window;

use crate::{unhashing::table_unhashing, user::User};

pub mod dict_attack;
pub mod unhashing;
pub mod user;
pub mod utils;

#[tauri::command]
async fn unhash(
    hash: String,
    char_set: Vec<String>,
    front_pepper: Option<String>,
    end_pepper: Option<String>,
) -> String {
    unhashing::unhash(
        &hash,
        &char_set,
        front_pepper.as_deref(),
        end_pepper.as_deref(),
    )
}

#[tauri::command]
async fn unhash_table(
    window: Window,
    users: Vec<User>,
    char_set: Vec<String>,
    front_pepper: Option<String>,
    end_pepper: Option<String>,
    known_hashes: HashMap<String, String>,
) -> Vec<User> {
    table_unhashing::unhash_table(
        window,
        users,
        char_set,
        front_pepper,
        end_pepper,
        known_hashes,
    )
    .await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![unhash, unhash_table])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
