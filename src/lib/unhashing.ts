import { invoke } from "@tauri-apps/api/core";
import { User } from "./user";
import { Dispatch, SetStateAction } from "react";
import { listen } from '@tauri-apps/api/event';
import { isValidSHA256 } from "./shaValidation";

interface unhashUsersProps {
    users: User[] | null,
    setUsers: Dispatch<SetStateAction<User[] | null>>,
    charSet: string[],
    frontPepper: string,
    endPepper: string | null
}

interface unhashProps {
    hash: string | null,
    charSet: string[],
    frontPepper: string | null,
    endPepper: string | null
}


export const unhashValue = async ({ hash, charSet, frontPepper, endPepper }: unhashProps): Promise<string | null> => {
    if (!hash) return null;
    if (!isValidSHA256(hash)) {
        return null;
    }

    const unhash: string = await invoke("unhash", {
        hash: hash,
        charSet: charSet,
        frontPepper: frontPepper,
        endPepper: endPepper
    });
    return unhash
}

export const unhashUsers = async ({ users, charSet, frontPepper, endPepper, setUsers }: unhashUsersProps) => {
    if (!users) return;

    /* known_hashes format is hash: password */
    const knownHashes = {
        "3adc2bf68033e11261c160e0e1245a9e0a58d620aa3a6aa576641a5b94ed91fd": "cajovna-2025-admin"
    };

    const unlisten = await listen<{ userId: number, password: string }>('unhash-progress', (event) => {
        const { userId, password } = event.payload;
        setUsers(prevUser => {
            if (!prevUser) return prevUser;
            return prevUser.map(user =>
                user.id === userId ? { ...user, password: password } : user
            );
        });
    });
    const finalUsers: User[] = await invoke("unhash_table", {
        users: users,
        charSet: charSet,
        frontPepper: frontPepper,
        endPepper: endPepper,
        knownHashes: knownHashes,
    });
    setUsers(finalUsers);
    unlisten();
}
