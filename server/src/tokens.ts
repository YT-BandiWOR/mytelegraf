import jwt, {JwtPayload} from "jsonwebtoken";
import config from "./config";

const signAccessToken = (userId: number, username: string): string => {
    return jwt.sign({ userId, username }, config.accessTokenSecret, { expiresIn: config.accessTokenExpiry });
}

const signRefreshToken = (userId: number, username: string): string => {
    return jwt.sign({ userId, username }, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiry });
}

const verifyRefreshToken = (refreshToken: string): JwtPayload => {
    return jwt.verify(refreshToken, config.refreshTokenSecret) as JwtPayload;
}

const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, config.accessTokenSecret) as JwtPayload;
}

export default {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    verifyAccessToken
}