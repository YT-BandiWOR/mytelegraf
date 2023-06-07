export interface DbUser {
    id: number
    password: string
    refreshToken: string
    loggedIn: number
    registrationTime: number

    username: string
    email: string
    role: string
}