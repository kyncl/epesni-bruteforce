import * as XLSX from 'xlsx';
import { User } from "./user";

export const downloadUsers = (users: User[] | null) => {
    const worksheet = XLSX.utils.json_to_sheet(users ?? []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.csv", { bookType: 'csv' });
    alert("Successfully downloaded. If you didn't specify where, please check your download folder");
}
