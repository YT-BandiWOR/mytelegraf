export const origin_host = 'http://localhost:3000';

export const register_path = '/register';
export const login_path = '/login';
export const refresh_path = '/refresh';
export const me_path = '/me';
export const logout_path = '/logout';
export const delete_account_path = '/deleteAccount';

export const register_url = origin_host + register_path;
export const login_url = origin_host + login_path;
export const refresh_url = origin_host + refresh_path;
export const me_url = origin_host + me_path;
export const logout_url = origin_host + logout_path;
export const delete_account_url = origin_host + delete_account_path;

export default {
    origin_host,
    register_url,
    login_url,
    refresh_url,
    me_url,
    logout_url,
    delete_account_url,
}
