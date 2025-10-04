export type TAccount = {
    email: string;
    password: string;
}


export interface TRegisterPayload extends TAccount {
    name: string
}

export type TLoginPayload = {
    email: string;
    password: string
    role: "Buyer" | "Seller" | "ADMIN",
}

export type TJwtUser = {
    email: string,
    role?: "Buyer" | "Seller" | "ADMIN",
}