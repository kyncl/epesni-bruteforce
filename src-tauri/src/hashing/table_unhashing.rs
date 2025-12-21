use crate::{hashing::unhashing, user::User};
use rayon::iter::{IndexedParallelIterator, IntoParallelRefMutIterator, ParallelIterator};
use std::{collections::HashMap, sync::Arc};
use tauri::{Emitter, Window};

/// known_hashes format is hash: password
pub async fn unhash_table(
    window: Window,
    mut users: Vec<User>,
    char_set: Vec<String>,
    pepper: Option<String>,
    known_hashes: HashMap<String, String>,
) -> Vec<User> {
    let known_hashes = Arc::new(std::sync::Mutex::new(known_hashes));

    tokio::task::spawn_blocking(move || {
        users.par_iter_mut().enumerate().for_each(|(idx, user)| {
            if user.hash.is_none() || user.password.is_some() {
                return;
            }

            let user_hash = user.hash.clone().unwrap();
            let set_password: String;
            let known_password = {
                let known_hashes_lock = known_hashes.lock().unwrap();
                known_hashes_lock.get(&user_hash).cloned()
            };

            if let Some(password) = known_password {
                user.password = Some(password.clone());
                set_password = password;
            } else {
                let result = unhashing::unhash_table(&user_hash, &char_set, pepper.as_deref());
                user.password = Some(result.clone());
                set_password = result;
            }

            window
                .emit(
                    "unhash-progress",
                    ProgressPayload {
                        index: idx,
                        password: set_password,
                    },
                )
                .unwrap();
        });

        users
    })
    .await
    .expect("Blocking task panicked")
}
#[derive(Clone, serde::Serialize)]
struct ProgressPayload {
    index: usize,
    password: String,
}
