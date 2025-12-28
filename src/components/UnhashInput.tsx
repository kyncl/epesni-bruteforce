import { useState } from "react";
import { CopyToClipboard } from "./CopyToClipboard";
import { unhashValue } from "../lib/unhashing";
import { CharSetSelector } from "./CharSetSelector";
import { isValidSHA256 } from "../lib/shaValidation";
import { Pepper } from "./Pepper";


export const UnhashInput = ({ classList }: { classList?: string }) => {
    const [result, setResult] = useState("");
    const [hash, setHash] = useState<string | null>(null);

    const [frontPepper, setFrontPepper] = useState("");
    const [endPepper, setEndPepper] = useState("");

    const [canUnhash, setCanUnhash] = useState(true);
    const [charSet, setCharSet] = useState<string[]>([]);

    const unhashHandle = async () => {
        setCanUnhash(false);
        const unhash = await unhashValue({ hash, frontPepper, endPepper, charSet });
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
            <CharSetSelector setCharSet={setCharSet} />
            <Pepper setFrontPepper={setFrontPepper} setEndPepper={setEndPepper} />
            <div className="flex items-center flex-col mt-5">
                <h2 className="sm:text-2xl text-xs">Result</h2>
                <div className="w-full md:w-fit relative mt-2 flex items-center justify-center">
                    <input type="text" disabled className="w-full md:w-3xl" value={result} />
                    <CopyToClipboard text={result} customClass="absolute right-1" />
                </div>
            </div>
            <button
                className="mt-5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                disabled={!canUnhash}
                onClick={(_) => {
                    if (hash && !isValidSHA256(hash)) {
                        alert("Your input is not valid sha256 hash");
                    }
                    else {
                        const wantsUnhash = confirm("Are you sure you want to unhash. This operation may be really hard on your device");
                        if (wantsUnhash) {
                            unhashHandle();
                        }
                    }
                }}
            >
                Unhash
            </button>
        </div>
    );
};
