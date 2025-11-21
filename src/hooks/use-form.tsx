import { useState } from 'react'
import { useSetValue } from './use-set-value';

export function useForm<T>(data?: T) {
    const [form, setForm] = useState<T>((data as T) ?? {} as T)
    const setValue = useSetValue<T>(setForm)

    return [form, setValue, setForm] as [
        T,
        typeof setValue,
        typeof setForm
    ]
}
