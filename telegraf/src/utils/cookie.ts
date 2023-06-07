import {getJwtTokenLifetime} from "./jwt.ts";


export const set = (name: string, value: string, expiration: number) => {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expiration) {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + expiration * 1000);
        cookieString += `; expires=${expirationDate.toUTCString()}`;
    }

    document.cookie = cookieString;
};

export const setToken = (name: string, value: string) => {
    const expTime = getJwtTokenLifetime(value);
    set(name, value, expTime);
};

export const get = (name: string): string | null => {
    const cookiePairs: string[] = document.cookie.split(';');

    for (let i = 0; i < cookiePairs.length; i++) {
        const [cookieName, cookieValue] = cookiePairs[i].split('=');

        if (!cookieValue || !cookieName) {
            continue;
        }

        if (decodeURIComponent(cookieName.trim()) === name) {
            return decodeURIComponent(cookieValue.trim());
        }
    }

    return null;
};

export const has = (name: string) => {
    return !!(get(name));
}

export const remove = (name: string) => {
    set(name, '', -1);
};

export const pop = (name: string): string | null => {
    const value = get(name);
    remove(name);
    return value;
}


export default {
    set,
    setToken,
    get,
    pop,
    has,
    remove
}