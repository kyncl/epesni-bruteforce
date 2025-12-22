import { useState } from "react";
import { CopyToClipboard } from "./CopyToClipboard";
import { charSet } from "./App";
import { unhashValue } from "../lib/unhashing";


export const UnhashInput = ({ classList }: { classList?: string }) => {
    const [result, setResult] = useState("");
    const [hash, setHash] = useState<string | null>(null);
    const [pepper, setPepper] = useState("");
    const [canUnhash, setCanUnhash] = useState(true);

    const unhashHandle = async () => {
        setCanUnhash(false);
        const unhash = await unhashValue({ hash, pepper, charSet });
        setResult(unhash ?? "");
        setCanUnhash(true);
    }

    return (
        <div className={`flex flex-col justify-center items-center mt-10 w-full ${classList}`}>
            <h2 className="sm:text-3xl text-lg text-amber-500">Write your hash</h2>
            <textarea className="text-xl dark:bg-black/20 p-2 m-5 w-full md:w-3xl"
                onChange={(event) => {
                    setHash(event.target.value);
                }}>
            </textarea>
            <div className="mt-5 flex items-center flex-col">
                <h2 className="sm:text-2xl text-xs">Known pepper</h2>
                <input type="text" className="w-full md:w-3xl mt-2"
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val) setPepper(val)
                    }} />
            </div>
            <div className="flex items-center flex-col mt-5">
                <h2 className="sm:text-2xl text-xs">Result</h2>
                <div className="w-full md:w-fit relative mt-2 flex items-center justify-center">
                    <input type="text" disabled className="w-full md:w-3xl" value={result} />
                    <CopyToClipboard text={result} customClass="absolute right-1" />
                </div>
            </div>
            <button
                className="mt-5"
                disabled={!canUnhash}
                onClick={(_) => {
                    const wantsUnhash = confirm("Are you sure you want to unhash. This operation may be really hard on your device");
                    if (wantsUnhash) {
                        unhashHandle();
                    }
                }}
            >
                Unhash
            </button>

        </div>
    );
};
