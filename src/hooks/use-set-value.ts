import { useCallback } from "react";

function normalizePath(path: string | number | (string | number)[]): (string | number)[] {
    if (Array.isArray(path)) return path;

    if (typeof path === "number") return [path];

    if (typeof path !== "string") {
        throw new Error("Path must be string, number, or array");
    }

    return path
        .replace(/\[(\d+)\]/g, ".$1") // arr[0] → arr.0
        .split(".")
        .filter(Boolean)
        .map(k => (/^\d+$/.test(k) ? Number(k) : k));
}

function setByPath(obj: any, path: string | number | (string | number)[], value: any) {
    if (obj == null || typeof obj !== "object") {
        obj = {}; // auto-create root
    }

    const keys = normalizePath(path);

    let current: any = obj;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const isLast = i === keys.length - 1;

        if (isLast) {
            current[key] = value;
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

export function useSetValue<T extends Record<string, any>>(
    setForm: React.Dispatch<React.SetStateAction<T>>
) {
    return useCallback(
        (...paths: (string | number | (string | number)[])[]) =>
            (...values: any[]): Promise<T> => {
                return new Promise((resolve) => {
                    setForm((prevForm) => {
                        const updatedForm: T = structuredClone(prevForm);
                        paths.forEach((path, i) => {
                            setByPath(updatedForm, path, values[i]);
                        });
                        resolve(updatedForm);
                        return updatedForm;
                    });
                });
            },
        [setForm]
    );
}
