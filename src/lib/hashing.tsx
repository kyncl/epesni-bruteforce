export const hashPassword = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const hexString = new Uint8Array(hash).toHex();
    return hexString;
}

export const hashPasswordCajovna = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const pepper = "cajovna-2025-";
    const data = encoder.encode(pepper + input);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const hexString = new Uint8Array(hash).toHex();
    return hexString;
}
