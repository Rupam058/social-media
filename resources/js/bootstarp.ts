import { AuthService } from "./services/auth";
import { PostSerives } from "./services/post";

export const authService = new AuthService();
export const postService = new PostSerives();

export const APP_BASE_URL = "http://localhost:8000";
