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
    /* known_hashes format is hash: password */
    const knownHashes = {
        "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918": "admin"
    };

    const unlisten = await listen<{ index: number, password: string }>('unhash-progress', (event) => {
        const { index, password } = event.payload;
        setUsers(prevUsers => {
            const newUsers = [...prevUsers ?? []];
            if (newUsers[index]) {
                newUsers[index] = { ...newUsers[index], password };
            }
            return newUsers;
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
