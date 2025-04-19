import { AuthService } from "./services/auth";
import { LikeService } from "./services/like";
import { PostSerives } from "./services/post";

export const authService = new AuthService();
export const postService = new PostSerives();
export const likeService = new LikeService();

export const APP_BASE_URL = "http://localhost:8000";
