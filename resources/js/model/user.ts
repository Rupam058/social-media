export interface UserMeta {
    username: string;
    name: string;
    avatar: string | null;
}

export interface ProfileResponse {
    id: string;
    username: string;
    description: string | null;
    name: string;
    avatar: string | null;
    banner: string | null;
}
