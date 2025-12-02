import { useContext, useRef } from "react";
import { FaCalculator } from "react-icons/fa6";
import { PosContext } from "../PosHome";
import PosCalculator, { PosCalculatorRef } from "./PosCalculator";

export enum KeyType {
    ClearCurrent = 10,
    Clear = 11,
    Calculator = 12,
    MultiZero = 13,
    Dot = 14,
    None = 15
}

export default function PosNumpadWidget() {
    const { setPosContext } = useContext(PosContext);
    const calculatorRef = useRef<PosCalculatorRef>(null);
    const keys: (KeyType | number)[] = [
        KeyType.ClearCurrent,
        KeyType.Clear,
        KeyType.Calculator,
        7, 8, 9,
        4, 5, 6,
        1, 2, 3,
        0, KeyType.MultiZero, KeyType.Dot,
    ];

    const handleNumPress = async (key: number) => {
        if (key == KeyType.Calculator) {
            if (calculatorRef.current) {
                calculatorRef.current.open();
            }
            return;
        }
        setPosContext(s => ({ ...s, numkey: key }));
    }

    return (
        <>
            <div className="grid grid-cols-3 border-s h-full">
                {keys.map((key) => {

                    return (
                        <div
                            onClick={() => handleNumPress(key)}
                            key={'numpad_key_' + key}
                            className="flex py-3 flex-1 border-b border-e items-center justify-center text-center text-2xl font-bold transition-all hover:bg-red-100 active:shadow-inner select-none"

                        >
                            {key == KeyType.ClearCurrent && 'CC'}
                            {key == KeyType.Clear && 'C'}
                            {key == KeyType.Calculator && <FaCalculator />}
                            {key == KeyType.MultiZero && '00'}
                            {key == KeyType.Dot && '.'}
                            {key < 10 && key}
                        </div>
                    )
                })}
            </div>
            <PosCalculator ref={calculatorRef} />
        </>
    );
}
