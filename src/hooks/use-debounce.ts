import { useRef } from "react";

export function useDebounce(
    callback: (...args: any) => void,
    delay: number,
    instantCount: number = 0
) {
    const timeoutRef = useRef<any>(null)
    const callCountRef = useRef(0)

    const debouncedFunction = (...args: any) => {
        if (callCountRef.current < instantCount) {
            callCountRef.current++
            callback(...args)
            return
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            callback(...args)
        }, delay)
    }

    return debouncedFunction
}
