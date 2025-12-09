export const hashPassword = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const buffer = new Uint8Array(hash).buffer;
    return buf2hex(buffer);
}

export const hashPasswordCajovna = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const pepper = "cajovna-2025-";
    const data = encoder.encode(pepper + input);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const buffer = new Uint8Array(hash).buffer;
    return buf2hex(buffer);
}

function buf2hex(buffer: ArrayBuffer) {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}
