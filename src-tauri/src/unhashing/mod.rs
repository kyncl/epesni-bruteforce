pub mod chunk_approach;
pub mod table_unhashing;

use std::{
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    time::Instant,
};

use log::info;
use rayon::prelude::*;
use sha2::{Digest, Sha256};

use crate::utils::converting::hex_to_bytes;

pub fn unhash(
    hash: &str,
    char_set: &[String],
    front_pepper: Option<&str>,
    end_pepper: Option<&str>,
) -> String {
    println!("hash: {}", hash);
    unhash_blocking(hash, char_set, front_pepper, end_pepper)
}

fn unhash_blocking(
    hash: &str,
    char_set: &[String],
    front_pepper: Option<&str>,
    end_pepper: Option<&str>,
) -> String {
    let front_pepper_bytes = front_pepper.unwrap_or("").as_bytes();
    let end_pepper_bytes = end_pepper.unwrap_or("").as_bytes();
    let target_hash = hex_to_bytes(hash);
    let char_bytes: Vec<&[u8]> = char_set.iter().map(|s| s.as_bytes()).collect();
    let base = char_bytes.len();

    let found = Arc::new(AtomicBool::new(false));
    let now = Instant::now();

    for letter_length in 1..=20 {
        let total: usize = base.pow(letter_length as u32);
        let result = (0..total)
            .into_par_iter()
            .map_init(
                || {
                    Vec::with_capacity(
                        front_pepper_bytes.len() + end_pepper_bytes.len() + letter_length * 4,
                    )
                },
                |buffer, idx| {
                    if found.load(Ordering::Relaxed) {
                        return None;
                    }

                    buffer.clear();
                    buffer.extend_from_slice(front_pepper_bytes);

                    let mut remaining = idx;
                    for _ in 0..letter_length {
                        buffer.extend_from_slice(char_bytes[remaining % base]);
                        remaining /= base;
                    }
                    buffer.extend_from_slice(end_pepper_bytes);

                    let hash_result = Sha256::digest(&buffer);
                    if hash_result.as_slice() == target_hash {
                        found.store(true, Ordering::Relaxed);
                        let result = String::from_utf8(buffer.clone());
                        if let Ok(result) = result {
                            let info = format!("Found: {} from: {:x}", result, hash_result);
                            println!("{}", info);
                            info!("{}", info);
                            return Some(result);
                        } else {
                            eprintln!("Couldn't convert input");
                            return None;
                        }
                    }
                    None
                },
            )
            .find_map_any(|res| res);

        if let Some(answer) = result {
            println!("took {:.2?}", now.elapsed());
            return answer;
        }
    }

    "unknown".to_string()
}
