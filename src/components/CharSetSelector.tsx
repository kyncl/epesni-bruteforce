import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "../style/switch.css";
import { charSetCapitalLetters, charSetNumbers, charSetSmalletters, charSetSymbols } from "../utils/charset";

interface charSetSelectorProps {
    classList?: string,
    setCharSet: Dispatch<SetStateAction<string[]>>
}
export const CharSetSelector = (
    { classList, setCharSet }: charSetSelectorProps) => {
    return (
        <div className={`${classList} mt-5 flex`}>
            <CharCheckBox shouldBeOnStart={true} name="Small letters" setCharSet={setCharSet} specificCharSet={charSetSmalletters} />
            <CharCheckBox shouldBeOnStart={true} name="Numbers" setCharSet={setCharSet} specificCharSet={charSetNumbers} />
            <CharCheckBox name="Capital letters" setCharSet={setCharSet} specificCharSet={charSetCapitalLetters} />
            <CharCheckBox name="Symbols" setCharSet={setCharSet} specificCharSet={charSetSymbols} />
        </div>
    )
};

interface charCheckBoxProps {
    name: string,
    shouldBeOnStart?: boolean,
    specificCharSet: string[],
    setCharSet: Dispatch<SetStateAction<string[]>>
}

const CharCheckBox = ({ name, specificCharSet, setCharSet, shouldBeOnStart }: charCheckBoxProps) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => { setEnabled(shouldBeOnStart ?? false); }, [])

    useEffect(() => {
        if (enabled) {
            setCharSet((prev) => [...prev, ...specificCharSet]);
        } else {
            setCharSet((prev) =>
                prev.filter((char) => !specificCharSet.includes(char))
            );
        }
    }, [enabled]);

    return (
        <button className="flex gap-2 pr-5 
        bg-transparent! shadow-none!"
            onClick={(_) => { setEnabled(!enabled) }}>
            <div className="bg-transparent switch">
                <input type="checkbox" className="z-50"
                    disabled
                    checked={enabled} />
                <span className="slider round"></span>
            </div>
            {name}
        </button>
    )
}
