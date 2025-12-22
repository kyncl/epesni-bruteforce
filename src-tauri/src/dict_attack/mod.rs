use anyhow::{anyhow, Result};
use sha2::{Digest, Sha256};
use std::{
    fs::File,
    io::{BufRead, BufReader},
    path::PathBuf,
};

use crate::utils::converting::hex_to_bytes;

/// Returns found password with pepper
/// If dict_file is set it will be used
/// Else if dict_path is set it will try to read it
/// Else error
pub fn dict_attack(
    hash: &str,
    pepper: Option<&str>,
    dict_path: Option<PathBuf>,
    dict_file: Option<&File>,
) -> Result<Option<String>> {
    let file = {
        if let Some(dict_path) = dict_path {
            &File::open(&dict_path)?
        } else if let Some(dict_file) = dict_file {
            dict_file
        } else {
            return Err(anyhow!("Didn't give either file nor path"));
        }
    };
    let file = BufReader::new(file);
    let pepper_bytes = pepper.unwrap_or("").as_bytes();
    let target_hash = hex_to_bytes(hash);

    for line in file.split(b'\n').flatten() {
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
    Ok(None)
}
