import React, {useState} from 'react';
import cls from "./Account.module.scss";
import {AccountDataField, AccountPageInterface} from "./type.ts";
import storage from "../../utils/storage.ts";
import cookie from "../../utils/cookie.ts";
import telegrafAPI from "../../api/telegrafAPI.ts";
import FullscreenModal from "../../components/modal/FullScreenBlocker.tsx";
import {TAPIError} from "../../api/types.ts";

const AccountPage: React.FC<AccountPageInterface> = ({account}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);
    const [isDeleteAccountError, setIsDeleteAccountError] = useState<boolean>(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const data: AccountDataField[] = account ? [
        {name: 'ID Аккаунта', value: `${account.id}`, type: 'id'},
        {name: 'Имя пользователя', value: account.username, type: 'username'},
        {name: 'Почта', value: account.email, type: 'email'},
        {name: 'Роль', value: account.role, type: 'role'},
        {name: 'Хеш-Пароля', value: account.password, type: 'password'},
        {name: 'Токен обновления', value: account?.refreshToken, type: 'refreshToken'},
        {name: 'Авторизован', value: (account.loggedIn) ? 'Да' : 'Нет', type: 'loggedIn'},
        {name: 'Регистрация', value: (account.registrationTime) ? new Date(Number(account.registrationTime)).toLocaleString() : 'Неизвестно', type: 'registrationTime'},
    ] : [];

    const deleteAccount = () => {
        if (!deleteConfirmation) {
            setDeleteConfirmation(true);
            return;
        }

        setLoading(true);
        const deleteAccountRequest = async () => {
            try {
                await telegrafAPI().deleteAccount(confirmPassword);
                storage().remove('refresh_token');
                cookie.remove('access_token');
                location.replace('/');
            } catch (error) {
                setIsDeleteAccountError(true);
                setLoading(false);
                setConfirmPassword('');
                setDeleteConfirmation(false);

                if (error instanceof TAPIError) {
                    setError(error.data?.message);
                } else {
                    setError('Возможно сервер сейчас недоступен.')
                }
            }
        }

        deleteAccountRequest();
    }

    const logout = () => {
        setLoading(true);

        const logoutRequest = async () => {
            try {
                await telegrafAPI().logout();
                storage().remove('refresh_token');
                cookie.remove('access_token');
                location.replace('/');

            } catch (reqError) {
                setLogoutError('Не удалось выйти из аккаунта.');
                setLoading(false);
            }
        }

        logoutRequest();
    }

    if (loading) return <FullscreenModal isOpened={true}/>
    return (
        <div className={cls.page}>
            <article>
                <h1>Мой аккаунт</h1>
                {
                    account ? (
                        data.map((value, index)=>(
                            <section key={index}>
                                <span>{value.name}</span>
                                <input type="text" value={value.value}/>
                            </section>
                        ))
                    ) : (
                        <div className={cls.requireAuth}>Необходима авторизация</div>
                    )
                }
                <hr/>
                <button className={cls.logout_button} onClick={logout}>{logoutError? 'Ошибка' : 'Выйти из аккаунта'}</button>
                <button className={cls.delete_button} onClick={deleteAccount}>{isDeleteAccountError? 'Ошибка' : ((deleteConfirmation) ? 'Подтвердить' : 'Удалить аккаунт')}</button>
                {
                    deleteConfirmation && (
                        <div className={cls.confirm_action}>
                            <input
                                type="password"
                                placeholder={"Введите пароль"}
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                            />
                            <button onClick={()=>setDeleteConfirmation(false)}>X</button>
                        </div>
                    )
                }

                {
                    error && (
                        <div className={cls.error_container}>{error}</div>
                    )
                }

            </article>
        </div>
    );
};

export default AccountPage;