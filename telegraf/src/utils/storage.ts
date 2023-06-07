import { getJwtTokenLifetime } from "./jwt.ts";

export const storage = (storageInstance: Storage = localStorage) => {
    const set = (key: string, value: any, expiration?: number) => {
        const data = {
            value: value,
            expiration: expiration ? new Date().getTime() + expiration * 1000 : null
        };
        storageInstance.setItem(key, JSON.stringify(data));
    };

    const setToken = (key: string, value: string) => {
        set(key, value, getJwtTokenLifetime(value));
    };

    const get = (key: string): any => {
        if (!key) return undefined;

        try {
            const item = storageInstance.getItem(key);
            if (item === null) {
                return item;
            }
            const data = JSON.parse(item);

            if (data && (!data.expiration || data.expiration >= new Date().getTime())) {
                return data.value;
            }
        } catch (error) {
            return storageInstance.getItem(key);
        }

        return undefined;
    };

    const pop = (key: string): any => {
        const value = get(key);
        remove(key);
        return value;
    };

    const remove = (key: string): void => {
        storageInstance.removeItem(key);
    };

    return {
        set,
        setToken,
        get,
        pop,
        remove
    };
};

export default storage;
