import { useState } from 'react'
import { useSetValue } from './use-set-value';

export function useForm<T = any>(data = {}) {
    const [form, setForm] = useState<T | any>(data);
    const setValue = useSetValue(setForm);
    return [form, setValue, setForm];
}
