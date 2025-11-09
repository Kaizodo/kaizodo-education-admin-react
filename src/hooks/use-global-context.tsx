import { useContext } from "react";
import { GlobalContext } from "../data/global";

export function useGlobalContext() {
    return useContext(GlobalContext);
}
