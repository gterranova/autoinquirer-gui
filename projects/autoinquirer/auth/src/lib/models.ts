export interface LocalData {
    uid: string;
    token: string;
}

export interface Group {
    name: string;
}

export interface User {
    email: string;
    _id?: string;
    superuser?: boolean;
    password?: string
}

export interface NewUser extends User {
    passwordConfirm?: string
}

export interface UserActivation {
    code: string;
    error?: string;
}
