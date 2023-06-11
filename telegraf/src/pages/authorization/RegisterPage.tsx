import React, {useState} from 'react';
import cls from "./Authorization.module.scss";
import {TAPIError} from "../../api/types.ts";
import telegrafAPI from "../../api/telegrafAPI.ts";
import storage from "../../utils/storage.ts";
import FullScreenModal from "../../components/modal/FullScreenBlocker.tsx";
import {Link, useNavigate} from "react-router-dom";

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const onFormSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
        ev.preventDefault();

        if (password !== repeatPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (!username || !email || !password || !repeatPassword) {
            setError('Заполните все поля ввода.');
            return;
        }

        setLoading(true);

        const registerRequest = async () => {
            try {
                await telegrafAPI().register(username, email, password);

                storage(sessionStorage).set('reg_data', {username, password});
                setLoading(false);
                navigate('/login');
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
        }

        registerRequest().catch(r=>console.error(r));
    }

    return (
        <main className={cls.auth_page}>
            <FullScreenModal isOpened={loading}/>
            <form className={cls.auth_form} onSubmit={onFormSubmit}>
                <h1 className={cls.caption}>Регистрация</h1>
                <input type="text" id={'name'} className={cls.input_field} placeholder={'Имя пользователя'} value={username} onChange={ev => setUsername(ev.target.value)} />
                <input type="email" id={'email'} className={cls.input_field} placeholder={'Электронная почта'} value={email} onChange={ev => setEmail(ev.target.value)} />
                <input type="password" id={'password'} className={cls.input_field} placeholder={'Ваш пароль'} value={password} onChange={ev => setPassword(ev.target.value)} />
                <input type="password" id={'repeatPassword'} className={cls.input_field} placeholder={'Повтор пароля'} value={repeatPassword} onChange={ev => setRepeatPassword(ev.target.value)} />
                <div className={cls.buttons}>
                    <Link className={cls.switch_auth_type} to={'/login'}>Войти</Link>
                    <button type={"submit"} className={cls.submit_button}>Регистрация</button>
                </div>
                {
                    error && (
                        <div className={cls.error_container}>{error}</div>
                    )
                }
            </form>
        </main>
    );
};

export default RegisterPage;