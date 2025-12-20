import { ChangeEvent, Dispatch, SetStateAction } from "react";
import * as XLSX from 'xlsx';
import { User } from "./user";


export const handleFile = ({ e, setUsers }: { e: ChangeEvent<HTMLInputElement>, setUsers: Dispatch<SetStateAction<User[] | null>> }) => {
    if (!e.target.files) return null;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        let users: User[] = [];
        const data = e.target?.result;
        const workbook = XLSX.read(data, { raw: false });
        const nextKey = Object.keys(workbook.Sheets)[0];
        const sheet = workbook.Sheets[nextKey];
        for (const [key, value] of Object.entries(sheet)) {
            if (!value["v"]) continue;
            const row = key.replace(/[0-9]/g, '');
            const id = parseInt(key.replace(/^\D+/g, ''));
            if (!isFinite(id)) continue;
            if (id === 1) continue;
            const header = sheet[`${row}1`]["v"];

            const isName = header === "name" || header === "username";
            const isHash = header === "hash";
            const isMail = header === "email";

            const extractedValue = value["v"];
            const username = (isName) ? extractedValue : null;
            const hash = (isHash) ? extractedValue : null;
            const mail = (isMail) ? extractedValue : null;
            let foundUser = users.find((user) => user.id == id) ?? null;

            if (!foundUser) {
                users.push({
                    id: id,
                    hash: hash,
                    email: mail,
                    username: username,
                    password: null,
                });
            }
            else {
                if (isName)
                    foundUser.username = extractedValue;
                else if (isHash)
                    foundUser.hash = extractedValue;
                else if (isMail)
                    foundUser.email = extractedValue;
            }
        }
        setUsers(users);
    };
    reader.readAsArrayBuffer(file);
}
