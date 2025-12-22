# Epesni bruteforce
- Tauri app with React frontend for creating hashes of SHA-256 and bruteforcing them with dictionary support.
- **DISCLAIMER**: This repo is only for educational purposes only. If you use it for something that is not legal, it's on you and I don't take any responsibility for it.

# Requirements
- cargo
- pnpm
# How to compile
for linux:
```bash
pnpm install
export NO_STRIP=0
cargo tauri build
./src-tauri/target/release/epesni-bruteforce
```
other:
tf should I know?

# Using dictionaries
If you want to add some dictionaries that the bruteforce should try, put it inside your cache file

|Platform|Value|Example|
|--------|-----|-------|
|Linux|`$XDG_CACHE_HOME` or `$HOME`/.cache/epesni-bruteforce/dictionaries |/home/alice/.cache/epesni-bruteforce/dictionaries|
|macOS|`$HOME`/Library/Caches/epesni-bruteforce/dictionaries|/Users/Alice/Library/Caches/epesni-bruteforce/dictionaries|
|Windows|`{FOLDERID_LocalAppData}`|C:\Users\Alice\AppData\Local/epesni-bruteforce/dictionaries|

And file should starts with `passdic__`
