import server from "./app";
import bcrypt from "bcrypt";
import validator from "validator";
import {RolesTypes} from "./roles";
import config from "./config";
import middlewares from "./middlewares";
import tables from "./tables";
import tokens from "./tokens";
import {Request, Response} from "express";


server.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { username = '', password = '', email = '' } = req.body;

    try {
        if (!validator.isEmail(email)) {
            res.status(401).json({ok: false, error: 'Невалидный email-адрес.'});
            return;
        }

        if (username.length < config.min_username_len) {
            res.status(401).json({ok: false, error: 'Невалидное имя пользователя.'});
            return;
        }

        if (password.length < config.min_password_len) {
            res.status(401).json({ok: false, error: 'Невалидный пароль.'});
            return;
        }

        const existingUser = await tables.getUser(email, username);
        if (existingUser) {
            res.status(409).json({ ok: false, error: 'Пользователь с таким именем или email уже существует.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role: RolesTypes = "user";
        const loggedIn: number = 0;
        const registrationTime = Math.floor(Date.now());

        await tables.createUser(username, email, hashedPassword, role, loggedIn, registrationTime);
        res.status(201).json({ ok: true });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ ok: false });
    }
});

// Авторизация пользователя
server.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { username = '', email = '', password } = req.body;

    try {
        const user = await tables.getUser(email, username);
        if (!user) {
            res.status(401).json({ ok: false, error: 'Пользователь с этим именем не найден.' });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ ok: false, error: 'Неверный пароль.' });
            return;
        }

        const token = tokens.signAccessToken(user.id, user.username);
        const refreshToken = tokens.signRefreshToken(user.id, user.username);
        await tables.loginUser(user.id, refreshToken, 1);

        res.json({ ok: true, token, refreshToken });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ ok: false });
    }
});

// Обновление токена
server.post('/refresh', async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    try {
        const decodedRefreshToken = tokens.verifyRefreshToken(refreshToken);
        const user = await tables.getUserByIdAndRefreshToken(decodedRefreshToken.userId, refreshToken);
        if (!user) {
            res.status(401).json({ ok: false, error: 'Неверный токен обновления.' });
            return;
        }

        if (!user.loggedIn) {
            res.status(401).json({ok: false, error: 'Требуется авторизация.'})
            return;
        }

        res.json({ ok: true, token: tokens.signAccessToken(user.id, user.username) });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(401).json({ ok: false });
    }
});

server.get('/me', middlewares.authMiddleware, async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ok: true, user: req.user});
})

// Разавторизация
server.post('/logout', middlewares.authMiddleware, async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    try {
        await tables.logoutUser(refreshToken);

        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ ok: false });
    }
});

server.post('/deleteAccount', middlewares.authMiddleware, async (req: Request, res: Response): Promise<void> => {
    const { refreshToken, password } = req.body;

    try {
        const passwordMatch = await bcrypt.compare(password, req.user.password);
        if (!passwordMatch) {
            res.status(401).json({ ok: false, error: 'Неверный пароль.' });
            return;
        }

        await tables.deleteUser(req.user.id, refreshToken);

        res.json({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false});
    }
});

server.post("/getUser", middlewares.authMiddleware, async (req: Request, res: Response): Promise<void> => {
    const {username} = req.body;

    try {
        const user = await tables.getUser(null, username);
        if (!user) {
            res.status(404).json({ok: false, error: 'Пользователь не найден.'});
            return;
        }

        if (user.id === req.user?.id) {
            res.status(200).json({ok: true, user});
            return;
        }

        res.status(200).json({ok: true, user: {id: user.id}});
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false});
    }
})

server.post("/createPrivate", middlewares.authMiddleware, async (req: Request, res: Response): Promise<void> => {
    const {userId} = req.body;

    try {
        if (await tables.chatWithUserExisting(req.user.id, userId)) {
            res.status(409).json({ok: false, error: 'Чат с этим пользователем уже существует.'})
            return;
        }

        const {secretKey, id} = await tables.createChat(req.user.id, userId, "PRIVATE");
        await tables.createChat(userId, req.user.id, "PRIVATE", secretKey);

        res.status(200).json({ok: true, chat: {id, secretKey}});
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false});
    }
});

export default server;