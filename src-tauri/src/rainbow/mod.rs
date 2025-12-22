use std::{
    fs::File,
    io::{BufRead, BufReader},
    path::PathBuf,
};

use crate::hashing::unhashing::hex_to_bytes;
use anyhow::{anyhow, Result};
use sha2::{Digest, Sha256};

/// Returns found password with pepper
/// If raibow_file is set it will be used
/// Else if raibow_path is set it will try to read it
/// Else error
pub fn rainbow_it(
    hash: &str,
    pepper: Option<&str>,
    rainbow_path: PathBuf,
) -> Result<Option<String>> {
    let file = File::open(&rainbow_path)?;
    let file = BufReader::new(file);
    let pepper_bytes = pepper.unwrap_or("").as_bytes();
    let target_hash = hex_to_bytes(hash);

    for line in file.split(b'\n') {
        if let Ok(line) = line {
            let mut input = Vec::with_capacity(pepper_bytes.len() + line.len());
            input.extend_from_slice(pepper_bytes);
            input.extend_from_slice(&line);

            let hash_result = Sha256::digest(&input);
            if hash_result.as_slice() == target_hash {
                let result = String::from_utf8(input);
                if let Ok(result) = result {
                    println!("Found {}", result);
                    return Ok(Some(result));
                } else {
                    return Err(anyhow!("Couldn't convert input"));
                }
            }
        }
    }
    Ok(None)
}
