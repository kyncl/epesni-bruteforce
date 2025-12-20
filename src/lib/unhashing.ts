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

export const unhashUsers = async ({ users, charSet, pepper, setUsers }: unhashUsersProps) => {
    let updatedUsers: User[] = [];
    for (const user of users ?? []) {
        const unhash: string = await invoke("unhash", {
            hash: user.hash,
            charSet: charSet,
            pepper: pepper
        });
        const updatedUser: User = {
            id: user.id,
            username: user.username,
            password: unhash,
            hash: user.hash,
            email: user.email
        };
        setUsers(prevUsers =>
            (prevUsers ?? []).map(u =>
                u.id === user.id ? updatedUser : u
            )
        );
    }
    setUsers(updatedUsers);
}
