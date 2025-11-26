import { useEffect, useState } from "react";
import { CopyToClipboard } from "./CopyToClipboard";
import { invoke } from "@tauri-apps/api/core";
import { chartSet } from "./App";

export const UnhashInput = ({ pepper }: { pepper?: String | null }) => {
    const [result, setResult] = useState("");
    const [hash, setHash] = useState("");

    useEffect(() => {
        const unhashValue = async () => {
            if (hash != "") {
                const unhash: string = await invoke("unhash", {
                    hash: hash,
                    possibleChars: chartSet,
                    pepper: pepper
                });
                setResult(unhash);
            }
        }
        unhashValue();
    }, [hash]);

    return (
        <div className="flex flex-col justify-center items-center mt-10 w-full">
            <h2>Write your hash</h2>
            <textarea className="text-xl dark:bg-black/20 p-2 m-5 w-full md:w-3xl"
                onChange={(event) => {
                    setHash(event.target.value);
                }}>
            </textarea>
            <h2>Result</h2>
            <div className="w-full md:w-fit relative flex items-center justify-center">
                <input type="text" disabled className="w-full md:w-3xl" value={result} />
                <CopyToClipboard text={result} customClass="absolute right-1" />
            </div>
        </div>
    );
};
