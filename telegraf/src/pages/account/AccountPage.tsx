import React, {useState, useEffect} from 'react';
import cls from "./Account.module.scss";
import FullscreenModal from "../../components/modal/FullScreenBlocker.tsx";
import {RootState} from "../../redux/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {deleteAccount, getAccountFields, getUser, logout} from "./AccountTools.ts";
import {useNavigate} from "react-router-dom";

const AccountPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);
    const [isDeleteAccountError, setIsDeleteAccountError] = useState<boolean>(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const account = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=> {
        if (!account) {
            getUser(dispatch).catch(r=>console.error(r));
        }
    }, [dispatch, account]);

    const data = account ? getAccountFields(account) : [];

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
                <button
                    className={cls.logout_button}
                    onClick={()=>logout(
                        setLoading,
                        setLogoutError,
                        dispatch,
                        navigate
                    )}
                >
                    {logoutError? 'Ошибка' : 'Выйти из аккаунта'}
                </button>

                <button
                    className={cls.delete_button}
                    onClick={()=>deleteAccount(
                        [deleteConfirmation, setDeleteConfirmation],
                        [loading, setLoading],
                        [isDeleteAccountError, setIsDeleteAccountError],
                        [confirmPassword, setConfirmPassword],
                        [error, setError], dispatch, navigate
                        )}
                >
                    {isDeleteAccountError? 'Ошибка' : ((deleteConfirmation) ? 'Подтвердить' : 'Удалить аккаунт')}
                </button>

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