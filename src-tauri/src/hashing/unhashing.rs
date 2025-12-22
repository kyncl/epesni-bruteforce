use std::{
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    time::Instant,
};

use log::debug;
use rayon::prelude::*;
use sha2::{Digest, Sha256};

use crate::hashing::digit_manipulation::{incerment_digits, offset_to_char_indexes};

pub fn unhash(hash: &str, char_set: &[String], pepper: Option<&str>) -> String {
    println!("hash: {}", hash);
    unhash_blocking(hash, &char_set, pepper.as_deref())
}

pub fn unhash_table(hash: &str, char_set: &[String], pepper: Option<&str>) -> String {
    unhash_blocking(hash, char_set, pepper)
}

fn unhash_blocking(hash: &str, char_set: &[String], pepper: Option<&str>) -> String {
    let pepper_bytes = pepper.unwrap_or("").as_bytes();
    let target_hash = hex_to_bytes(hash);
    let char_bytes: Vec<&[u8]> = char_set.iter().map(|s| s.as_bytes()).collect();
    let base = char_bytes.len();

    let found = Arc::new(AtomicBool::new(false));
    let now = Instant::now();

    for length in 1..=20 {
        // pretty much magical number
        let total: usize = base.pow(length as u32);

        let result = (0..total).into_par_iter().find_map_any(|idx| {
            if found.load(Ordering::Relaxed) {
                return None;
            }

            let mut input = Vec::with_capacity(pepper_bytes.len() + length * 4);
            input.extend_from_slice(pepper_bytes);

            let mut remaining = idx;
            for _ in 0..length {
                input.extend_from_slice(char_bytes[remaining % base]);
                remaining /= base;
            }

            let hash_result = Sha256::digest(&input);

            /* if let Some(known_hashes) = known_hashes.clone() {
                let mut known_hash_lock = known_hashes.lock().unwrap();
                let string_input = String::from_utf8(input.clone());
                if let Ok(string_input) = string_input {
                    known_hash_lock.insert(format!("{:x}", hash_result), string_input);
                }
                drop(known_hash_lock);
            } */
            if hash_result.as_slice() == target_hash {
                found.store(true, Ordering::Relaxed);
                let result = String::from_utf8(input);
                if let Ok(result) = result {
                    println!("Found {}", result);
                    return Some(result);
                } else {
                    eprintln!("Couldn't convert input");
                    return None;
                }
            }
            None
        });

        if let Some(answer) = result {
            println!("took {:.2?}", now.elapsed());
            return answer;
        }
    }

    "unknown".to_string()
}

pub fn hex_to_bytes(hex: &str) -> [u8; 32] {
    let mut bytes = [0u8; 32];
    for (i, chunk) in hex.as_bytes().chunks(2).enumerate() {
        bytes[i] = u8::from_str_radix(std::str::from_utf8(chunk).unwrap(), 16).unwrap();
    }
    bytes
}

async fn process_chunk(
    range: usize,
    char_set: Vec<String>,
    hash: String,
    pepper: Option<String>,
    offset: usize,
    did_finish: Arc<AtomicBool>,
) -> Option<String> {
    let mut char_indexes = offset_to_char_indexes(offset, char_set.len());

    for _ in 0..range {
        if did_finish.load(Ordering::Relaxed) {
            break;
        }

        let value: String = char_indexes
            .par_iter()
            // effectively it's like for looping each char, but this is faster implementation
            .map(|&i| char_set[i].clone())
            .collect();
        let compare_hash = format!(
            "{:x}",
            Sha256::digest(
                format!("{}{}", pepper.clone().unwrap_or("".to_string()), value).as_bytes()
            )
        );
        println!(
            "Pepper: {:?} | Value: {} | Hash: {}",
            pepper, value, compare_hash
        );
        if compare_hash == hash {
            did_finish.store(true, Ordering::Relaxed);
            return Some(value);
        }

        let char_num = char_indexes.len();
        let highest_char_val = char_set.len() - 1;
        incerment_digits(&mut char_indexes, highest_char_val, char_num);
        // println!("input: {} hash: {}", value, compare_hash);
    }
    None
}
