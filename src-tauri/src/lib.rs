use crate::hashing::unhashing;

pub mod hashing;

#[tauri::command]
async fn unhash(hash: String, char_set: Vec<String>, pepper: Option<String>) -> String {
    unhashing::unhash(hash, char_set, pepper).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![unhash])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
