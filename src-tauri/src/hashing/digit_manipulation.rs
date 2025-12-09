/// not mine
/// AI made cuz I like the optimization from O(n) to O(log(n))
pub fn offset_to_char_indexes(offset: usize, base: usize) -> Vec<usize> {
    if offset == 0 {
        return vec![0];
    }

    let mut result = Vec::new();
    let mut remaining = offset;

    while remaining > 0 {
        result.push(remaining % base);
        remaining /= base;
    }

    result
}

pub fn incerment_digits(char_indexes: &mut Vec<usize>, highest_char_val: usize, char_num: usize) {
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
