use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};

use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use sha2::{Digest, Sha256};

use crate::utils::digit_manipulation::{incerment_digits, offset_to_char_indexes};

pub async fn process_chunk(
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
