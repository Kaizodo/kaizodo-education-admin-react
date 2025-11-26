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

    // Removal handling
    if (typeof path === "string" && path.endsWith("-")) {
        const pathWithoutDash = path.slice(0, -1);
        const base = pathWithoutDash.split("[")[0];
        const inside = pathWithoutDash.split("[")[1]?.replace("]", "") || "";

        const selectors = inside.split(",").map(s => {
            const [field, raw] = s.split(":");
            const val = /^\d+$/.test(raw) ? Number(raw) : raw;
            return { field, val };
        });

        const arr = obj[base];
        if (Array.isArray(arr)) {
            obj[base] = arr.filter(item =>
                !selectors.every(sel => item?.[sel.field] === sel.val)
            );
        }
        return obj;
    }

    // Special handling for array bulk update or get
    if (typeof path === "string" && path.includes("[") && path.includes("]") && !path.endsWith("-")) {
        const base = path.split("[")[0];
        const inside = path.split("[")[1].replace("]", "");

        const isSpecial = inside.includes("(") || !inside.includes(".");
        if (isSpecial) {
            const wherePart = inside.includes("(")
                ? inside.split("(")[0]
                : inside;

            const updatePart = inside.includes("(")
                ? inside.split("(")[1].replace(")", "")
                : null;

            const selectors = wherePart.split(",").map(s => {
                const [field, raw] = s.split(":");
                const val = /^\d+$/.test(raw) ? Number(raw) : raw;
                return { field, val };
            });

            const arr = obj[base];
            if (!Array.isArray(arr)) return obj;

            if (!updatePart) {
                const found = arr.find(item =>
                    selectors.every(sel => item?.[sel.field] === sel.val)
                );
                if (found) return found;
                return obj;
            }

            const rules = updatePart.split("|").map(r => {
                const [k, rest] = r.split("=");
                const parts = rest.split(",");
                return {
                    key: k,
                    match: /^\d+$/.test(parts[0]) ? Number(parts[0]) : parts[0],
                    unmatch: parts[1]
                        ? (/^\d+$/.test(parts[1]) ? Number(parts[1]) : parts[1])
                        : undefined
                };
            });

            arr.forEach(item => {
                const isMatch = selectors.every(sel => item?.[sel.field] === sel.val);
                rules.forEach(rule => {
                    if (isMatch) {
                        item[rule.key] = rule.match;
                    } else if (rule.unmatch !== undefined) {
                        item[rule.key] = rule.unmatch;
                    }
                });
            });

            return obj;
        }
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
                        const updated = structuredClone(prev) as T;
                        let result: any = updated;
                        paths.forEach((p, i) => {
                            const res = setByPath(result, p, values[i]);
                            if (res !== result && paths.length === 1) {
                                result = res;
                            }
                        });
                        resolve(result);
                        return updated;
                    })
                }),
        [setForm]
    ) as (
        ...paths: (string | number | (string | number)[])[]
    ) => (...values: any[]) => Promise<T>;
}


/*

Add item: setValue('someArray[]')({id:1,name:'content',abcd:true})
Update item: setValue('someArray[id:1].name')('new name') or bulk setValue('someArray[id:1](name=newname|other=otherval)')()
Remove item: setValue('someArray[id:1,name:abcd something,otherkey:1]-')()
Get item: setValue('someArray[id:1]')() (returns item, no-op if set)
Nested set: setValue('obj.arr[0].prop')('value')

*/