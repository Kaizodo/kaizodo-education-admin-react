import { useCallback } from "react";

export type SetValueType = (...keys: string[]) => (...values: any[]) => void;

function normalizePath(path: string | number | (string | number)[]): (string | number)[] {
    if (Array.isArray(path)) return path;
    if (typeof path === "number") return [path];
    if (typeof path !== "string") throw new Error("Path must be string, number, or array");

    return path
        .replace(/\[(.*?)\]/g, ".$1") // supports both arr[0] and arr[field:value]
        .split(".")
        .filter(Boolean)
        .map(k => (/^\d+$/.test(k) ? Number(k) : k));
}

function setByPath(obj: any, path: string | number | (string | number)[], value: any) {
    if (obj == null || typeof obj !== "object") obj = {};

    let pushMode = false;
    if (typeof path === "string" && path.endsWith("[]")) {
        pushMode = true;
        path = path.slice(0, -2);
    }

    const keys = normalizePath(path);
    let current: any = obj;

    for (let i = 0; i < keys.length; i++) {
        let key: any = keys[i];
        const isLast = i === keys.length - 1;

        // selector: field:value (example tax_component_id:5)
        if (typeof key === "string" && key.includes(":")) {
            const [field, raw] = key.split(":");
            const matchValue = /^\d+$/.test(raw) ? Number(raw) : raw;

            if (!Array.isArray(current)) return obj; // no error

            const found = current.find((x: any) => x?.[field] === matchValue);
            if (!found) return obj; // silent no-op
            current = found;
            continue;
        }

        if (isLast) {
            if (pushMode) {
                if (!Array.isArray(current[key])) current[key] = [];
                current[key].push(value);
            } else {
                current[key] = value;
            }
        } else {
            if (
                current[key] === undefined ||
                current[key] === null ||
                typeof current[key] !== "object"
            ) {
                current[key] = typeof keys[i + 1] === "number" ? [] : {};
            }
            current = current[key];
        }
    }

    return obj;
}

export function useSetValue<T>(
    setForm: React.Dispatch<React.SetStateAction<T>>
) {
    return useCallback(
        (...paths: (string | number | (string | number)[])[]) =>
            (...values: any[]): Promise<T> =>
                new Promise((resolve) => {
                    setForm((prev) => {
                        const updated = structuredClone(prev)
                        paths.forEach((p, i) => setByPath(updated, p, values[i]))
                        resolve(updated)
                        return updated
                    })
                }),
        [setForm]
    ) as (
        ...paths: (string | number | (string | number)[])[]
    ) => (...values: any[]) => Promise<T>;
}
