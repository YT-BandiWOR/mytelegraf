import {ReactSetStateType, ReactStatePairType} from "../../components/header/types.ts";
import telegrafAPI from "../../api/telegrafAPI.ts";
import storage from "../../utils/storage.ts";
import cookie from "../../utils/cookie.ts";
import {TAPIError} from "../../api/types.ts";
import {logoutUser, setUser} from "../../redux/userSlice.ts";
import {Dispatch, AnyAction} from "@reduxjs/toolkit";
import {AccountDataFieldInterface} from "./type.ts";
import {DbUser} from "../../types.ts";
import {NavigateFunction} from "react-router-dom";

export const deleteAccount = (deleteConfirmationState: ReactStatePairType<boolean>, loadingState: ReactStatePairType<boolean>,
                              isDeleteAccountErrorState: ReactStatePairType<boolean>, confirmPasswordState: ReactStatePairType<string>,
                              errorState: ReactStatePairType<string | null>, dispatch: Dispatch<AnyAction>, navigate: NavigateFunction) => {
    if (!deleteConfirmationState[0]) {
        deleteConfirmationState[1](true);
        return;
    }

    loadingState[1](true);
    const deleteAccountRequest = async () => {
        try {
            await telegrafAPI().deleteAccount(confirmPasswordState[0]);
            storage().remove('refresh_token');
            cookie.remove('access_token');
            dispatch(logoutUser());
            navigate('/');
        } catch (error) {
            isDeleteAccountErrorState[1](true);
            loadingState[1](false);
            confirmPasswordState[1]('');
            deleteConfirmationState[1](false);

            if (error instanceof TAPIError) {
                errorState[1](error.data?.message);
            } else {
                errorState[1]('Возможно сервер сейчас недоступен.')
            }
        }
    }

    deleteAccountRequest().catch(r=>console.error(r));
}

export const logout = (setLoading: ReactSetStateType<boolean>, setLogoutError: ReactSetStateType<string | null>,
                       dispatch: Dispatch<AnyAction>, navigate: NavigateFunction) => {
    setLoading(true);

    const logoutRequest = async () => {
        try {
            await telegrafAPI().logout();
            storage().remove('refresh_token');
            cookie.remove('access_token');
            dispatch(logoutUser());
            navigate('/');

        } catch (reqError) {
            setLogoutError('Не удалось выйти из аккаунта.');
            setLoading(false);
        }
    }

    logoutRequest().catch(r=>console.error(r));
}

export const getUser = async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    try {
        const fetchedUser = await telegrafAPI().me(); // Замените на фактический вызов вашего метода получения пользователя
        dispatch(setUser(fetchedUser.data.user));

    } catch (error) {
        console.error('Ошибка при получении пользователя:', error);
    }
}

export const getAccountFields = (account: DbUser): AccountDataFieldInterface[] => {
    return [
        {name: 'ID Аккаунта', value: `${account.id}`, type: 'id'},
        {name: 'Имя пользователя', value: account.username, type: 'username'},
        {name: 'Почта', value: account.email, type: 'email'},
        {name: 'Роль', value: account.role, type: 'role'},
        {name: 'Хеш-Пароля', value: account.password, type: 'password'},
        {name: 'Токен обновления', value: account.refreshToken, type: 'refreshToken'},
        {name: 'Авторизован', value: (account.loggedIn) ? 'Да' : 'Нет', type: 'loggedIn'},
        {name: 'Регистрация', value: (account.registrationTime) ? new Date(Number(account.registrationTime)).toLocaleString() : 'Неизвестно', type: 'registrationTime'},
    ]
}

export default {
    deleteAccount,
    logout,
    getUser,
    getAccountFields
}