use crate::{dict_attack::dict_attack, unhashing::unhash, user::User};
use dirs::cache_dir;
use log::info;
use rayon::{
    iter::{IntoParallelRefIterator, IntoParallelRefMutIterator, ParallelIterator},
    slice::ParallelSliceMut,
};
use std::{
    collections::HashMap,
    fs::{self, File},
    path::Path,
    sync::Arc,
    time::Instant,
};
use tauri::{Emitter, Window};

/// known_hashes format is hash: password
pub async fn unhash_table(
    window: Window,
    users: Vec<User>,
    char_set: Vec<String>,
    pepper: Option<String>,
    known_hashes: HashMap<String, String>,
) -> Vec<User> {
    let known_hashes = Arc::new(std::sync::RwLock::new(known_hashes));
    let now = Instant::now();
    let (mut users_with_pass, mut users_without_pass): (Vec<_>, Vec<_>) = users
        .par_iter()
        .cloned()
        .partition(|user| user.hash.is_none() || user.password.is_some());

    let curr_dir = cache_dir()
        .unwrap_or(Path::new(".").to_path_buf())
        .join("epesni-bruteforce")
        .join("dictionaries");

    if let Ok(exist) = fs::exists(&curr_dir) {
        if !exist {
            let _ = fs::create_dir_all(&curr_dir);
        }
    }

    let cache_files = fs::read_dir(&curr_dir);
    let mut dict_files = vec![];
    if let Ok(cache_files) = cache_files {
        for file in cache_files.flatten() {
            // yes I'm menace >:)
            if file.file_name().to_string_lossy().starts_with("passdic__") {
                info!("found dictionary: {}", file.path().to_string_lossy());
                let f = File::open(file.path());
                if let Ok(f) = f {
                    dict_files.push(f);
                }
            }
        }
    }

    tokio::task::spawn_blocking(move || {
        users_without_pass.par_iter_mut().for_each(|user| {
            if user.hash.is_none() || user.password.is_some() {
                return;
            }

            let user_hash = user.hash.clone().unwrap();
            let set_password: String;
            let known_password = {
                let known_hashes_lock = known_hashes.read().unwrap();
                known_hashes_lock.get(&user_hash).cloned()
            };

            // Skip it if it already find inside known hashes
            let dictionary_attack_result = {
                if known_password.is_some() {
                    None
                } else {
                    dict_files.par_iter().find_map_first(|file| {
                        let table = dict_attack(&user_hash, pepper.as_deref(), None, Some(file));
                        if let Ok(Some(rainbow)) = table {
                            Some(rainbow)
                        } else {
                            None
                        }
                    })
                }
            };

            if let Some(dictionary_attack) = dictionary_attack_result {
                info!("Found in dictionary table {}", dictionary_attack);
                user.password = Some(dictionary_attack.clone());
                set_password = dictionary_attack;
            } else if let Some(password) = known_password {
                info!("Found in known table");
                user.password = Some(password.clone());
                set_password = password;
            } else {
                info!("Unhashing...");
                let result = unhash(&user_hash, &char_set, pepper.as_deref());
                user.password = Some(result.clone());
                set_password = result.clone();
            }

            window
                .emit(
                    "unhash-progress",
                    ProgressPayload {
                        user_id: user.id,
                        password: set_password.clone(),
                    },
                )
                .unwrap();

            {
                let mut known_hashes_lock = known_hashes.write().unwrap();
                known_hashes_lock.insert(user_hash, set_password);
            }
        });

        println!("Whole table took {:.2?}", now.elapsed());
        users_with_pass.append(&mut users_without_pass);
        users_with_pass.par_sort_unstable_by_key(|user| user.id);
        users_with_pass
    })
    .await
    .expect("Blocking task panicked")
}

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct ProgressPayload {
    user_id: usize,
    password: String,
}
