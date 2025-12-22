use crate::{hashing::unhashing, rainbow::rainbow_it, user::User};
use dirs::cache_dir;
use log::{debug, info};
use rayon::{
    iter::{IntoParallelRefIterator, IntoParallelRefMutIterator, ParallelIterator},
    slice::ParallelSliceMut,
};
use std::{collections::HashMap, env::current_dir, fs, path::Path, sync::Arc, time::Instant};
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
            let err = fs::create_dir_all(&curr_dir);
            panic!("{:?}", err);
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

            let mut res = None;
            let cache_files = fs::read_dir(&curr_dir);
            if let Ok(cache_files) = cache_files {
                for file in cache_files {
                    if let Ok(file) = file {
                        // yes I'm menace >:)
                        if file.file_name().to_string_lossy().starts_with("passdic__") {
                            info!("trying {}", file.path().to_string_lossy());
                            let table = rainbow_it(&user_hash, pepper.as_deref(), file.path());
                            if let Ok(Some(rainbow)) = table {
                                res = Some(rainbow);
                                break;
                            }
                        }
                    }
                }
            }

            if let Some(rainbow) = res {
                info!("Found in rainbow table {}", rainbow);
                user.password = Some(rainbow.clone());
                set_password = rainbow;
            } else if let Some(password) = known_password {
                info!("Found in known table");
                user.password = Some(password.clone());
                set_password = password;
            } else {
                info!("Unhashing...");
                let result = unhashing::unhash_table(&user_hash, &char_set, pepper.as_deref());
                user.password = Some(result.clone());
                set_password = result.clone();

                {
                    let mut known_hashes_lock = known_hashes.write().unwrap();
                    known_hashes_lock.insert(user_hash, result);
                }
            }

            window
                .emit(
                    "unhash-progress",
                    ProgressPayload {
                        user_id: user.id,
                        password: set_password,
                    },
                )
                .unwrap();
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
