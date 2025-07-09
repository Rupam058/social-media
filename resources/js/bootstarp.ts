import { AuthService } from "./services/auth";
import { CommentService } from "./services/comment";
import { FollowService } from "./services/follow";
import { LikeService } from "./services/like";
import { PostSerives } from "./services/post";
import { UserService } from "./services/user";

export const authService = new AuthService();
export const postService = new PostSerives();
export const likeService = new LikeService();
export const commentService = new CommentService();
export const userService = new UserService();
export const followService = new FollowService();

// export const APP_BASE_URL = "http://localhost:8000";
// export const APP_BASE_URL = process.env.APP_BASE_URL;
export const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
export const DEFAULT_AVATAR = `${APP_BASE_URL}/defaults/default.jpg`;
export const DEFAULT_BANNER = `${APP_BASE_URL}/defaults/banner.png`;
