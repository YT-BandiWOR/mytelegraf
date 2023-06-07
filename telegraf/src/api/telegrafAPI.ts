import axios, {AxiosError, AxiosResponse} from "axios";
import createAxiosContext from "./createAxiosContext";
import cookie from "../utils/cookie.ts";
import storage from "../utils/storage.ts";
import apiConstants from "../constants/apiConstants";
import {TelegrafAPIInterface, TAPIError, TAPIResponse} from "./types.ts";


const telegrafAPI = (): TelegrafAPIInterface => {
    const tryUpdateToken = async (): Promise<void> => {
        const storageTool = storage(localStorage);
        const token = cookie.get('access_token');
        const refreshToken = storageTool.get('refresh_token');

        if (!token && refreshToken) {
            let response: TAPIResponse | null;

            try {
                response = await refresh(refreshToken);
            } catch (error) {
                storageTool.remove('refresh_token');
                cookie.remove('access_token');
                throw error;
            }

            if (!response?.data?.token) {
                storageTool.remove('refresh_token');
                cookie.remove('access_token');
                throw new TAPIError(401, {error: "Сервер не вернул валидный токен доступа."});
            }

            cookie.setToken('access_token', response.data.token);
        } else if (!(token && refreshToken)) {
            throw new TAPIError(401, {error: 'Необходима авторизация.'});
        }
    };

    const register = async (username: string, email: string, password: string): Promise<TAPIResponse> => {
        try {
            const response: AxiosResponse = await axios.post(apiConstants.register_url, {
                username,
                email,
                password
            });

            return new TAPIResponse(response.data, response.status);
        } catch (error) {
            if (error instanceof AxiosError) {
                const response = error.response;
                if (!response) {
                    throw error;
                }
                throw new TAPIError(response.status, response.data);
            }
            throw error;
        }
    };

    const login = async (username: string, password: string): Promise<TAPIResponse> => {
        try {
            const response: AxiosResponse = await axios.post(apiConstants.login_url, {
                username,
                password
            });
            return new TAPIResponse(response.data, response.status);
        } catch (error) {
            if (error instanceof AxiosError) {
                const response = error.response;
                if (!response) {
                    throw error;
                }
                throw new TAPIError(response.status, response.data);
            }
            throw error;
        }
    };

    const refresh = async (refreshToken: string): Promise<TAPIResponse> => {
        try {
            const response: AxiosResponse = await axios.request(createAxiosContext({
                url: apiConstants.refresh_url,
                body: {
                    refreshToken
                }
            }));
            return new TAPIResponse(response.data, response.status);
        } catch (error) {
            if (error instanceof AxiosError) {
                const response = error.response;
                if (!response) {
                    throw error;
                }
                throw new TAPIError(response.status, response.data);
            }
            throw error;
        }
    };

    const me = async (): Promise<TAPIResponse> => {
        try {
            await tryUpdateToken();
            const token = cookie.get('access_token');

            const response: AxiosResponse = await axios.request(createAxiosContext({
                url: apiConstants.me_url,
                method: 'GET',
                token
            }));

            return new TAPIResponse(response.data, response.status);
        } catch (error) {
            if (error instanceof AxiosError) {
                const response = error.response;
                if (!response) {
                    throw error;
                }
                throw new TAPIError(response.status, response.data);
            }
            throw error;
        }
    };

    const logout = async (): Promise<TAPIResponse> => {
        try {
            await tryUpdateToken();
            const token = cookie.get('access_token');
            const refreshToken = storage(localStorage).get('refresh_token');

            const response: AxiosResponse = await axios.request(createAxiosContext({
                url: apiConstants.logout_url,
                method: 'POST',
                token,
                body: {
                    refreshToken
                }
            }));
            return new TAPIResponse(response.data, response.status);
        } catch (error) {
            if (error instanceof AxiosError) {
                const response = error.response;
                if (!response) {
                    throw error;
                }
                throw new TAPIError(response.status, response.data);
            }
            throw error;
        }
    };

    const deleteAccount = async (confirmPassword: string): Promise<TAPIResponse> => {
        try {
            await tryUpdateToken();
            const token = cookie.get('access_token');
            const refreshToken = storage().get('refresh_token');

            const response: AxiosResponse = await axios.request(createAxiosContext({
                url: apiConstants.delete_account_url,
                method: 'POST',
                token,
                body: {
                    refreshToken,
                    password: confirmPassword
                }
            }));

            return new TAPIResponse(response.data, response.status);

        } catch (error) {
            if (error instanceof AxiosError) {
                const response = error.response;
                if (!response) {
                    throw error;
                }
                throw new TAPIError(response.status, response.data);
            }
            throw error;
        }
    }

    return {
        login,
        register,
        refresh,
        me,
        logout,
        deleteAccount
    };
};

export default telegrafAPI;
