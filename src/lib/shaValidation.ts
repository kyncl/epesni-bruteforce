export function isValidSHA256(hash: string): boolean {
    const cleaned = hash.trim();
    const regex = /^[a-fA-F0-9]{64}$/;
    return regex.test(cleaned);
}
