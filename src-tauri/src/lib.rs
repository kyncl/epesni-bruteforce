use rayon::prelude::*;
use sha2::{Digest, Sha256};

#[tauri::command]
async fn unhash(hash: String, possible_chars: Vec<String>, pepper: Option<String>) -> String {
    println!("hash: {}\npossible_chars: {:?}", hash, &possible_chars);

    // each digit has it's own index of possible characyer
    let mut char_indexes = vec![0];

    loop {
        let original_input: String = char_indexes
            .par_iter()
            // effectively it's like for looping each char, but this is faster implementation
            .map(|&i| possible_chars[i].clone())
            .collect();
        let compare_hash = format!(
            "{:x}",
            Sha256::digest(
                format!(
                    "{}{}",
                    pepper.clone().unwrap_or("".to_string()),
                    original_input
                )
                .as_bytes()
            )
        );
        if compare_hash == hash {
            return original_input;
        }

        let char_num = char_indexes.len();
        let highest_char_val = possible_chars.len() - 1;
        incerment_digits(&mut char_indexes, highest_char_val, char_num);
        println!("{:?}", char_indexes);
    }
}

fn incerment_digits(char_indexes: &mut Vec<usize>, highest_char_val: usize, char_num: usize) {
    let mut i = 0;
    let mut should_add_digit = false;
    for digit in char_indexes.iter_mut() {
        if *digit < highest_char_val {
            *digit += 1;
            break;
        } else {
            *digit = 0;
            if i == char_num - 1 {
                should_add_digit = true;
            }
        }
        i += 1;
    }
    if should_add_digit {
        char_indexes.push(0);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![unhash])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
