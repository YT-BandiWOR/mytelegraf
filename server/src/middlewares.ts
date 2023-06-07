import jwt, {JwtPayload} from "jsonwebtoken";
import config from "./config";
import dbQuery from "./dbfunctions";
import {NextFunction, Request, Response} from "express";


const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({ ok: false });
        return;
    }

    const formatted_token = token.split(' ')[1];

    try {
        const decodedToken = (await jwt.verify(formatted_token, config.accessTokenSecret)) as JwtPayload;

        if (decodedToken.exp < (Date.now() / 1000)) {
            res.status(401).json({ ok: false, error: 'Время жизни токена истекло.' });
            return;
        }

        try {
            const query = await dbQuery('SELECT * FROM users WHERE id = $1', [decodedToken.userId]);
            const user = query.rows[0];

            if (!user.loggedin) {
                res.status(401).json({ok: false, error: 'Требуется авторизация.'});
                return;
            }

            req.user = {
                id: user.id,
                password: user.password,
                loggedIn: user.loggedin,
                role: user.role,
                refreshToken: user.refreshtoken,
                email: user.email,
                username: user.username,
                registrationTime: user.registrationtime,
            }

        } catch (error) {
            res.status(500).json({ok: false});
            return;
        }

        next();

    } catch (error) {
        res.status(401).json({ ok: false });
    }
};

export default {
    authMiddleware
}