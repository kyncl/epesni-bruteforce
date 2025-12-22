import { Dispatch, SetStateAction } from "react"

interface pepperProps {
    setFrontPepper:
    Dispatch<SetStateAction<string>>,
    setEndPepper:
    Dispatch<SetStateAction<string>>
}
export const Pepper = ({ setEndPepper, setFrontPepper }: pepperProps) => {
    return (
        <div className="p-5 mb-5">
            <div className="mt-5 flex items-center flex-col">
                <h2 className="sm:text-xl text-xs">front-Pepper</h2>
                <p>this will be placed at the start of every string</p>
                <input type="text" className="w-full md:w-2xl mt-2"
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val) setFrontPepper(val)
                    }} />
            </div>
            <div className="mt-5 flex items-center flex-col">
                <h2 className="sm:text-xl text-xs">end-Pepper</h2>
                <p>this will be placed at the end of every string</p>
                <input type="text" className="w-full md:w-2xl mt-2"
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val) setEndPepper(val)
                    }} />
            </div>
        </div>
    );
}
