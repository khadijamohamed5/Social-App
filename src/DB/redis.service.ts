import { redisClient } from "./redis.connect";

export async function setIntoCache(key : string, otp : string | number, expire : number){
    redisClient.set(key,otp,{ EX : expire })
}

export async function getFromCache(key : string){
    return redisClient.get(key)
}

export async function deleteFromCache(key : string){
    redisClient.del(key)
}