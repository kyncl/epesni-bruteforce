# Epesni bruteforce
- Tauri desktop app with React frontend for creating hashes of SHA-256 and bruteforcing them with dictionary support.
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
if you want to squeeze even more performance you can try
```bash
export NO_STRIP=0
RUSTFLAGS="-C target-cpu=native" cargo tauri build
./src-tauri/target/release/epesni-bruteforce
```
**BEWARE** this will make build specifically to your CPU

Other:
tf should I know?

# Using dictionaries
If you want to add some dictionaries that the bruteforce should try, put it inside your cache file

|Platform|Value|Example|
|--------|-----|-------|
|Linux|`$XDG_CACHE_HOME` or `$HOME`/.cache/epesni-bruteforce/dictionaries |/home/alice/.cache/epesni-bruteforce/dictionaries|
|macOS|`$HOME`/Library/Caches/epesni-bruteforce/dictionaries|/Users/Alice/Library/Caches/epesni-bruteforce/dictionaries|
|Windows|`{FOLDERID_LocalAppData}`|C:\Users\Alice\AppData\Local/epesni-bruteforce/dictionaries|

- And file should starts with `passdic__`
- If you want some dictionaries with password, checkout [SecLists](https://github.com/danielmiessler/SecLists).

# Running tests
## Vitest
If you want to try vitest to test out unhashing, you may by:
```bash 
pnpm vitest
```
**BUT** this is rn completely useless, because all of the heavy operations are happening inside rust backend so 
ofc pnpm doesn't know how to setup the frontend and backend connection for testing. So what to do?
## Cargo
Thankfully cargo is op so you can run tests by cargo:
```bash
cargo test
```
these operations can be really heavy so it's recommended to run tests with release version 
```bash
cargo test --release
```
