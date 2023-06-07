import {DbUser} from "../../types.ts";

export type AccountDataFieldType = 'id' | 'username' | 'email' | 'role' | 'password' | 'refreshToken' |'loggedIn' | 'registrationTime'

export interface AccountPageInterface {
    account: DbUser | null
}

export interface AccountDataField {
    name: string
    value: string
    type: AccountDataFieldType
}