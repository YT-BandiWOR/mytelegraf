type ChatType = 'PRIVATE' | 'GROUP' | 'CHANNEL' | 'BOT' | 'BANNED'

declare global {
    namespace Express {
        interface Request {
            user: undefined | DbUser
        }
    }
}

interface DbUser {
    id: number
    password: string
    refreshToken: string
    loggedIn: number
    registrationTime: number

    username: string
    email: string
    role: string
}

interface DbChat {
    id: number
    userId: number
    chatId: number
    type: ChatType
    secureKey: string
}

interface DbMessage {
    id: number
    chatId: number
    text: string
    replyToId: number
}


export {
    ChatType,
    DbUser,
    DbChat,
    DbMessage
}