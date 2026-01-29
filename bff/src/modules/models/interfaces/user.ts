import type UserStats from "./user_stats.js";
import type Storage from "./storage.js";

export default interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    recovery_password?: string;
    storage: Storage;
    stats: UserStats;
    has_game: boolean
}