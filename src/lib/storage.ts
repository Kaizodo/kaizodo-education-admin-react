export class Storage {
    static async set<T>(key: string, value: T): Promise<void> {
        if (value === null || value === undefined) {
            localStorage.removeItem(key);
            return;
        }
        const encryptedValue = Storage.#encrypt({ value, type: typeof value });
        localStorage.setItem(key, encryptedValue);
    }

    static async get<T>(key: string): Promise<T | null> {
        const encryptedValue = localStorage.getItem(key);
        if (!encryptedValue) return null;

        try {
            const { value, type } = Storage.#decrypt(encryptedValue);
            return Storage.#castType<T>(value, type);
        } catch {
            return null;
        }
    }

    static async remove(key: string): Promise<void> {
        localStorage.removeItem(key);
    }

    static async clear(): Promise<void> {
        localStorage.clear();
    }

    static #encrypt(data: { value: any; type: string }): string {
        return Storage.#base64Encode(JSON.stringify(data));
    }

    static #decrypt(encrypted: string): { value: any; type: string } {
        return JSON.parse(Storage.#base64Decode(encrypted));
    }

    static #base64Encode(str: string): string {
        return btoa(unescape(encodeURIComponent(str)));
    }

    static #base64Decode(str: string): string {
        return decodeURIComponent(escape(atob(str)));
    }

    static #castType<T>(value: any, type: string): T {
        switch (type) {
            case 'number': return Number(value) as T;
            case 'boolean': return (value === 'true' || value === true) as T;
            case 'object': return (typeof value === 'string' ? JSON.parse(value) : value) as T;
            default: return value as T;
        }
    }
}
