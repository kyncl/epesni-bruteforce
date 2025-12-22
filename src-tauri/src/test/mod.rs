use rayon::iter::{IntoParallelRefIterator, ParallelIterator};

use crate::unhashing::unhash;

struct TestingPasswords {
    hash: String,
    password: String,
    front_prefix: Option<String>,
    end_prefix: Option<String>,
}
impl TestingPasswords {
    pub fn new(
        hash: &str,
        password: &str,
        front_prefix: Option<&str>,
        end_prefix: Option<&str>,
    ) -> Self {
        Self {
            hash: hash.to_string(),
            password: password.to_string(),
            front_prefix: front_prefix.map(|s| s.to_owned()),
            end_prefix: end_prefix.map(|s| s.to_owned()),
        }
    }
}

const CHARSET: [&str; 26] = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
    "t", "u", "v", "w", "x", "y", "z",
];

macro_rules! generate_unhash_tests {
    ($($name:ident: $hash:expr, $pass:expr, $front:expr, $end:expr;)*) => {
        $(
            #[test]
            fn $name() {
                let char_set: Vec<String> = CHARSET.par_iter().cloned().map(|s| s.to_owned()).collect();
                let result = unhash($hash, &char_set, $front, $end);
                assert_eq!(result, $pass);
            }
        )*
    }
}
generate_unhash_tests! {
    test_penis: "f6952d6eef555ddd87aca66e56b91530222d6e318414816f3ba7cf5bf694bf0f", "penis", None, None;
    test_sex: "98d44e13f455d916674d38424d39e1cb01b2a9132aacbb7b97a6f8bb7feb2544","sex",None,None;
    test_pain: "5c78c8e7160e76ba9b6c41f74247bb7ba4887f5c06faecd6b9a009785b248c72", "pain", None, None;
    test_gay: "586acb3c6bac489308c0938f762da702573a714dfdf3a729dcb40758b4c363ae", "gay", None, None;
    test_gorillaz: "d1de50137a3a6a6f59048dc234db2e9006b03ae52e5c5a844ae3ef769ee50988", "gorillaz", Some("gor"), None;
    test_linkinpark: "f46daca7eb795765f476243ee233a9c3fa03bd49e71121bb5aebad24a0b5d015", "linkinpark", None, Some("park");
    test_job: "46a792af41ba4e0edfecdb6823dfdb901945a1297f6699895ea00c8fd20ff3dc", "steve sex jobs", Some("steve "), Some(" jobs");
    test_tatsuki: "8e1622631316fb574346ee0cb4023a8a06c9df163bc55e782e3c936ae0b199f2", "tatsuki", Some("tat"), None;
    test_fujimoto: "f8ee130c7204c6e73f6d4c972c7d94553c5f6babf0eea032b411fa30f7acf739", "fujimoto", None, Some("moto");
}
