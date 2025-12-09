use std::{
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    time::Instant,
};

use rayon::prelude::*;
use sha2::{Digest, Sha256};

use crate::hashing::digit_manipulation::{incerment_digits, offset_to_char_indexes};

pub async fn unhash(hash: String, char_set: Vec<String>, pepper: Option<String>) -> String {
    println!("hash: {}\npossible_chars: {:?}", hash, &char_set);

    // each digit has it's own index of possible character
    let mut tasks = vec![];
    let did_finish = Arc::new(AtomicBool::new(false));
    let now = Instant::now();

    for thread_num in 0..500_000 {
        if did_finish.load(Ordering::Relaxed) {
            break;
        }

        let char_set_clone = char_set.clone();
        let hash_clone = hash.clone();
        let pepper_clone = pepper.clone();
        let did_finish_clone = Arc::clone(&did_finish);

        let task = tokio::task::spawn(async move {
            let result = process_chunk(
                100,
                char_set_clone,
                hash_clone,
                pepper_clone,
                (thread_num * 100) as usize,
                did_finish_clone,
            )
            .await;
            result
        });
        tasks.push(task);
    }

    let (mut finished_tasks, mut unfinished_tasks): (Vec<_>, Vec<_>) =
        tasks.par_iter().partition(|task| task.is_finished());
    while unfinished_tasks.len() != 0 {
        (finished_tasks, unfinished_tasks) = tasks.par_iter().partition(|task| task.is_finished());
        for task in finished_tasks {
            let possible_result = task.await;
            if let Ok(result) = possible_result {
                if let Some(result) = result {
                    println!("answer {}", result);
                    println!("process took {:.2?}", now.elapsed());
                    return result;
                }
            } else {
                panic!("error in thread");
            }
        }
    }
    format!("unknown")
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
