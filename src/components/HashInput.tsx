import { useEffect, useState } from "react";
import { hashPassword } from "../lib/hashing";
import { CopyToClipboard } from "./CopyToClipboard";

export const HashInput = () => {
    const [result, setResutlt] = useState("");
    const [input, setInput] = useState("");

    useEffect(() => {
        const hashValue = async () => {
            if (input != "") {
                setResutlt(await hashPassword(input));
            }
        }
        hashValue();
    }, [input]);

    return (
        <div className="flex flex-col justify-center items-center mt-10">
            <h2 className="sm:text-3xl text-lg text-cyan-500">Write text to be hashed</h2>
            <textarea className="text-xl dark:bg-black/20 p-2 m-5 w-full md:w-3xl"
                onChange={(event) => {
                    setInput(event.target.value);
                }}>
            </textarea>
            <h2 className="sm:text-2xl text-xs">Result</h2>
            <div className="w-full md:w-fit relative flex items-center justify-center">
                <input type="text" disabled className="w-full md:w-3xl" value={result} />
                <CopyToClipboard text={result} customClass="absolute right-1" />
            </div>
        </div>
    );
}
