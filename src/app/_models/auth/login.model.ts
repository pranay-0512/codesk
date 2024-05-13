export class LoginModel { 
    email!: string;
    password!: string;
}

export class LoginResponseModel {
    user?: {
        role: string;
        isEmailVerified: boolean;
        name: string;
        email: string;
        id: string;
    }
    tokens?: {
        access: {
            token: string;
            expires: string;
        }
        refresh: {
            token: string;
            expires: string;
        }
    }
    code?: number;
    message?: string;
}

