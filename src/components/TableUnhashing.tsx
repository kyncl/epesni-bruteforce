import { useEffect, useState } from "react";
import { UserTable } from "./UserTable";
import { FaUpload } from "react-icons/fa";
import { User } from "../lib/user";
import { handleFile } from "../lib/tableManagment";
import { unhashUsers } from "../lib/unhashing";
import { CharSetSelector } from "./CharSetSelector";
import { Pepper } from "./Pepper";

export const TableUnhashing = ({ classList }: { classList?: string }) => {
    const [users, setUsers] = useState<User[] | null>(null);

    const [frontPepper, setFrontPepper] = useState("");
    const [endPepper, setEndPepper] = useState("");

    const [canUnhash, setCanUnhash] = useState(false);
    const [didPutNewFile, setDidPutNewFile] = useState(false);
    const [charSet, setCharSet] = useState<string[]>([]);

    const unhashusersButtonHandle = async () => {
        setCanUnhash(false);
        await unhashUsers({ users, frontPepper, endPepper, charSet, setUsers })
        setCanUnhash(true);
    }

    useEffect(() => {
        // This should start when user gives the file 
        if ((users?.length ?? 0 !== 0) && didPutNewFile) {
            setCanUnhash(true);
            setDidPutNewFile(false);
        }
    }, [users]);

    return (
        <div className={classList}>
            <div className="flex items-center flex-col mt-5">
                <h2 className="sm:text-3xl text-lg text-green-500">Unhash table</h2>
                <p className="text-lg">As long as it has email and password it will do the trick</p>
                <CharSetSelector setCharSet={setCharSet} />
                <Pepper setFrontPepper={setFrontPepper} setEndPepper={setEndPepper} />
                <div className="max-w-6xl mx-auto m-8 p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="relative group w-full md:w-auto
                        rounded-xl border-2 border-dashed border-zinc-300 
                        dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 
                        cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 
                        focus:border-indigo-500 dark:focus:border-indigo-400
                        hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all 
                        ">
                            <input
                                type="file"
                                id="file-upload"
                                className="block w-full h-full absolute top-0 left-0 cursor-pointer 
                                text-transparent bg-transparent"
                                onChange={(e) => { handleFile({ e, setUsers }); setDidPutNewFile(true) }}
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex items-center gap-3 px-5 py-3 group"
                            >
                                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm group-hover:text-indigo-600">
                                    <FaUpload className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Choose File</span>
                                    <span className="text-xs text-zinc-500">.xlsx or .csv</span>
                                </div>
                            </label>
                        </div>
                        <button
                            onClick={(_e) => {
                                const wantsUnhash = confirm("Are you sure you want to unhash. This operation may be really hard on your device");
                                if (wantsUnhash)
                                    unhashusersButtonHandle()
                            }}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={!canUnhash}
                        >
                            Unhash
                        </button>
                    </div>
                </div>
            </div>
            <UserTable users={users} />
        </div>
    );
}
