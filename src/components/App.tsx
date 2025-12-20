import { useState } from "react";
import "../style/App.css";
import { HashInput } from "./HashInput";
import { UnhashInput } from "./UnhashInput";
import { TableUnhashing } from "./TableUnhashing";

export const charSet = [
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
    /*
    * section 0 == hash input
    * section 1 == unhash input 
    * section 2 == unhashing table
    * */
    const [section, setSection] = useState(0);

    return (
        <main className="flex items-center flex-col">
            <h1 className="text-red-500 text-2xl mt-5 font-bold">
                Velice legalni bruteforce ktery neporusuje zakon
                jelikoz je to pro studiini ucely lmao
            </h1>
            <div>
                <button className="m-2" onClick={() => { setSection(0) }}>Hash input</button>
                <button className="m-2" onClick={() => { setSection(1) }}>Unhash input</button>
                <button className="m-2" onClick={() => { setSection(2) }}>Table unhashing</button>
            </div>
            <HashInput classList={`${section === 0 ? "" : "hidden"}`} />
            <UnhashInput classList={`${section === 1 ? "" : "hidden"}`} />
            <TableUnhashing classList={`${section === 2 ? "" : "hidden"}`} />
        </main>
    );
}

export default App;
