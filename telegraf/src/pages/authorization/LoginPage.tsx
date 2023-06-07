import React, {useEffect, useState} from 'react';
import cls from "./Authorization.module.scss";
import storage from "../../utils/storage.ts";
import telegrafAPI from "../../api/telegrafAPI.ts";
import cookie from "../../utils/cookie.ts";
import {TAPIError} from "../../api/types.ts";
import FullscreenModal from "../../components/modal/FullScreenBlocker.tsx";
import {Link} from "react-router-dom";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const reg_data = storage(sessionStorage).pop('reg_data');

        if (reg_data && reg_data.username && reg_data.password) {
            setUsername(reg_data.username);
            setPassword(reg_data.password);
        }
    }, [])

    const onFormSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
        ev.preventDefault();
        setLoading(true);

        const loginRequest = async () => {
            try {
                const response = await telegrafAPI().login(username, password);
                console.log('res', response.data)

                cookie.setToken('access_token', response.data.token);
                storage().setToken('refresh_token', response.data.refreshToken);

                location.replace(location.origin + '/');

            } catch (error) {
                if (error instanceof TAPIError) {
                    setLoading(false);
                    setError(error.data?.error);
                    console.error(error);
                } else {
                    setLoading(false);
                    setError('Возможно сервер сейчас недоступен.');
                }
            }

            setLoading(false);
        }

        loginRequest();
    }

    return (
        <>
            <FullscreenModal isOpened={loading}/>
            <main className={cls.auth_page}>
                <form className={cls.auth_form} onSubmit={onFormSubmit}>
                    <h1 className={cls.caption}>Авторизация</h1>
                    <input type="text" id={'name'} className={cls.input_field} placeholder={'Имя пользователя'}  value={username} onChange={ev=>setUsername(ev.target.value)}/>
                    <input type="password" id={'password'} className={cls.input_field} placeholder={'Пароль'}  value={password} onChange={ev=>setPassword(ev.target.value)}/>
                    <div className={cls.buttons}>
                        <Link className={cls.switch_auth_type} to={'/register'}>Регистрация</Link>
                        <button type={"submit"} className={cls.submit_button}>Войти</button>
                    </div>
                    {
                        error && (
                            <div className={cls.error_container}>{error}</div>
                        )
                    }
                </form>
            </main>
        </>
    );
};

export default LoginPage;