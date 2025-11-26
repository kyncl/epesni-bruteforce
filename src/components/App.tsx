import { useEffect, useState } from "react";
import "../style/App.css";
import { HashInput } from "./HashInput";
import { UnhashInput } from "./UnhashInput";
import { Cajovna } from "./Cajovna";

export const chartSet = [
    "a", "b", "c", "d",
    "e", "f", "g", "h",
    "i", "j", "k", "l",
    "m", "n", "o", "p",
    "q", "r", "s", "t",
    "u", "v", "w", "x",
    "y", "z", "0", "1",
    "2", "3", "4", "5",
    "6", "7", "8", "9"
];

function App() {
    const [section, setSection] = useState(<HashInput />);
    const [currentSectionId, setCurrentSectionId] = useState(0);
    useEffect(() => {
        switch (currentSectionId) {
            case 0:
                setSection(<HashInput />)
                break;
            case 1:
                setSection(<UnhashInput />)
                break;
            case 2:
                setSection(<Cajovna />)
                break;
            default:
                break;
        }
    }, [currentSectionId]);

    return (
        <main className="flex items-center flex-col">
            <h1 className="text-red-500 text-2xl mt-5 font-bold">
                Velice legalni bruteforce ktery neporusuje zakon
                jelikoz je to pro studiini ucely lmao
            </h1>
            <div>
                <button className="m-2" onClick={() => { setCurrentSectionId(0) }}>Hash input</button>
                <button className="m-2" onClick={() => { setCurrentSectionId(1) }}>Get input from hash</button>
                <button className="m-2" onClick={() => { setCurrentSectionId(2) }}>Čajovna ehm velice <i>legalni</i></button>
            </div>
            {section}
        </main>
    );
}

export default App;
