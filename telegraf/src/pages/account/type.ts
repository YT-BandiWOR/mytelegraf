export type AccountDataFieldType = 'id' | 'username' | 'email' | 'role' | 'password' | 'refreshToken' |'loggedIn' | 'registrationTime'

export interface AccountDataFieldInterface {
    name: string
    value: string
    type: AccountDataFieldType
}