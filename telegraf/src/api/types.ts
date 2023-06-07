export class TAPIResponse {
    data: Record<string, any>;
    status: number;

    constructor(data: Record<string, any>, status: number) {
        this.data = data;
        this.status = status;
    }
}

export class TAPIError {
    data: Record<string, any>;
    status: number;

    constructor(status: number, data: Record<string, any>) {
        this.data = data;
        this.status = status;
    }
}

export interface TelegrafAPIInterface {
    login: (username: string, password: string) => Promise<TAPIResponse>;
    register: (username: string, email: string, password: string) => Promise<TAPIResponse>;
    refresh: (refreshToken: string) => Promise<TAPIResponse>;
    me: () => Promise<TAPIResponse>;
    logout: () => Promise<TAPIResponse>;
    deleteAccount: (confirmPassword: string) => Promise<TAPIResponse>;
}