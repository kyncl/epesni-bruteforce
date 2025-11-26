import { useState } from "react";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { sleep } from "../utils/sleep";

export const CopyToClipboard = ({ text, customClass }: { text: string, customClass?: string }) => {
    const [didChecked, setDidChecked] = useState(true);
    const [isDelayed, setIsDelayed] = useState(false);
    const [icon, setIcon] = useState(<MdContentCopy />);

    const handleCopy = async () => {
        if (!isDelayed) {
            setDidChecked(!didChecked);
            if (didChecked) {
                setIcon(<MdCheck />);
                try {
                    await navigator.clipboard.writeText(text);
                    setIsDelayed(true);
                    await sleep(2000);
                    setIsDelayed(false);
                    setIcon(<MdContentCopy />);
                    setDidChecked(true);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
                // setTimeout(() => setDidChecked(false), 2000);
            }
            else {
                setIcon(<MdContentCopy />);
            }
        }
    };

    return (
        <div className={customClass}>
            <button onClick={() => { handleCopy(); }}>
                {icon}
            </button>
        </div>
    )
};
