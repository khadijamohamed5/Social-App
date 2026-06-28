import { RedisClientType, createClient } from "@redis/client";
import { ICacheProvider } from "../cache.interface";

interface RedisConfig {
    url: string,
}


export class RedisCachProvider implements ICacheProvider{
    private redisClient: RedisClientType;

    constructor(config: RedisConfig){
        this.redisClient = createClient(config)
        this.redisClient.connect().catch((err: any)=>{
            console.log(err)
        })
    }

    async delete(key: string): Promise<void> {
        await this.redisClient.del(key)
    }

    async get(key: string): Promise<string | null > {
        return await this.redisClient.get(key)
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if(ttlSeconds){
            await this.redisClient.set(key, value, {EX: ttlSeconds})
            return;
        }
        await this.redisClient.set(key, value)
    }
    async addToSet(key: string,value: string): Promise<void> {
        await this.redisClient.sAdd(key,value);
    }
    async getAllFromSet(key: string): Promise<string[]> {
        return await this.redisClient.sMembers(key);
    }
    async rmSet(key: string,value: string): Promise<void> {
        await this.redisClient.sRem(key,value);
    }


}