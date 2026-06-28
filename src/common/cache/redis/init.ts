import { REDIS_URL } from "../../../config";
import { RedisCachProvider } from "./redis.service";

export const redisCacheProvider = new RedisCachProvider({
    url : REDIS_URL
})