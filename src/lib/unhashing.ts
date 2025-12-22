import { invoke } from "@tauri-apps/api/core";
import { User } from "./user";
import { Dispatch, SetStateAction } from "react";

interface unhashUsersProps {
    users: User[] | null,
    setUsers: Dispatch<SetStateAction<User[] | null>>,
    charSet: string[],
    pepper: string
}

interface unhashProps {
    hash: string | null,
    charSet: string[],
    pepper: string,
}


export const unhashValue = async ({ hash, charSet, pepper }: unhashProps): Promise<string | null> => {
    if (!hash) return null;
    const unhash: string = await invoke("unhash", {
        hash: hash,
        charSet: charSet,
        pepper: pepper
    });
    return unhash
}

import { listen } from '@tauri-apps/api/event';

export const unhashUsers = async ({ users, charSet, pepper, setUsers }: unhashUsersProps) => {
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
        pepper: pepper,
        knownHashes: knownHashes,
    });
    setUsers(finalUsers);
    unlisten();
}
