import dbQuery from "./dbfunctions";
import {ChatType, DbChat, DbUser} from "./types";
import {QueryResult} from "pg";
import {RolesTypes} from "./roles";
import {generateRandomString} from "./tools";

const dbTables = {
    "users": "id SERIAL PRIMARY KEY, username TEXT UNIQUE, email TEXT UNIQUE, password TEXT, refreshtoken TEXT, role TEXT, registrationtime INTEGER, loggedin INTEGER",
    "chats": "id SERIAL PRIMARY KEY, userid INTEGER, chatid INTEGER, type TEXT, securekey TEXT",
    "messages": "id SERIAL PRIMARY KEY, chatid INTEGER, text TEXT, replytoid INTEGER",
}

const createTables = async (): Promise<void> => {
    for (const table_name in dbTables) {
        const db_fields: string = dbTables[table_name];

        dbQuery(`CREATE TABLE IF NOT EXISTS ${table_name} (${db_fields})`)
            .then(() => {
                console.log(`Table "${table_name}" created successfully`);
            })
            .catch(error => {
                console.error(`Error creating table "${table_name}"`, error);
            });
    }
}

const createUser = async (username: string, email: string, hashedPassword: string, role: RolesTypes, loggedIn: number, registrationTime: number): Promise<void> => {
    await dbQuery('INSERT INTO users (username, email, password, role, loggedin, registrationtime) VALUES ($1, $2, $3, $4, $5, $6)',
        [username, email, hashedPassword, role, loggedIn, registrationTime]);
}

const getUser = async (email?: string, username?: string): Promise<DbUser | null> => {
    let dbResult: QueryResult<any>;

    if (username) {
        dbResult = await dbQuery('SELECT * FROM users WHERE username = $1', [username]);
    } else if (email) {
        dbResult = await dbQuery('SELECT * FROM users WHERE email = $1', [email]);
    }

    if (dbResult.rows.length === 0) {
        return null;
    }

    const data = dbResult.rows[0];
    return {
        email: data.email,
        username: data.username,
        id: data.id,
        refreshToken: data.refreshtoken,
        loggedIn: data.loggedin,
        role: data.role,
        password: data.password,
        registrationTime: data.registrationtime
    }
}

const loginUser = async (userId: number, refreshToken: string, loggedIn: number): Promise<void> => {
    await dbQuery('UPDATE users SET refreshtoken = $1, loggedin = $2 WHERE id = $3', [refreshToken, loggedIn, userId]);
}

const getUserByIdAndRefreshToken = async (userId: number, refreshToken: string): Promise<DbUser | null> => {
    const dbResult = await dbQuery('SELECT * FROM users WHERE id = $1 AND refreshtoken = $2', [userId, refreshToken]);

    if (dbResult.rows.length === 0) {
        return null;
    }

    const data = dbResult.rows[0];
    return {
        email: data.email,
        username: data.username,
        id: data.id,
        refreshToken: data.refreshtoken,
        loggedIn: data.loggedin,
        role: data.role,
        password: data.password,
        registrationTime: data.registrationtime
    }
}


const logoutUser = async (refreshToken: string): Promise<void> => {
    await dbQuery('UPDATE users SET refreshtoken = NULL, loggedin = $1 WHERE refreshtoken = $2', [0, refreshToken]);
}

const deleteUser = async (userId: number, refreshToken: string): Promise<void> => {
    await dbQuery('DELETE FROM users WHERE id = $1 AND refreshtoken = $2', [userId, refreshToken]);
}

const chatWithUserExisting = async (userId: number, chatId: number): Promise<boolean> => {
    const searchFirst = await dbQuery('SELECT * FROM chats WHERE userid = $1 AND chatid = $2 AND type = $3', [userId, chatId, "PRIVATE"]);
    if (searchFirst.rows.length > 0) {
        return true;
    }
    const searchSecond = await dbQuery('SELECT * FROM chats WHERE chatid = $1 AND userid = $2 AND type = $3', [userId, chatId, "PRIVATE"]);
    return searchSecond.rows.length > 0;
}

const getChat = async (userId: number, chatId: number, type: ChatType): Promise<DbChat | null> => {
    const dbResult = await dbQuery('SELECT * FROM chats WHERE userid = $1 AND chatid = $2 AND type = $3', [userId, chatId, type]);

    if (dbResult.rows.length === 0) {
        return null;
    }

    const data = dbResult.rows[0];
    return {
        chatId: data.chatid,
        type: data.type,
        secureKey: data.securekey,
        userId: data.userid,
        id: data.id
    }
}

const createChat = async (userId: number, chatId: number, type: ChatType, secretKey: string | undefined = undefined): Promise<{secretKey: string, id: number}> => {
    if (!secretKey) {
        secretKey = generateRandomString(16);
    }

    const result = await dbQuery('INSERT INTO chats (userid, chatid, type, securekey) VALUES ($1, $2, $3, $4) returning id', [
        userId, chatId, type, secretKey
    ]);

    if (result && result.rows && result.rows.length > 0) {
        return {
            secretKey,
            id: result.rows[0].id
        }
    }

    throw new Error("Error with get inserting data.")
}


export default {
    createTables,
    createUser,
    getUser,
    loginUser,
    getUserByIdAndRefreshToken,
    logoutUser,
    deleteUser,
    getChat,
    createChat,
    chatWithUserExisting
}