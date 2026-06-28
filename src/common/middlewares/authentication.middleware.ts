import type { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "..";
import { getUserFromToken } from "../security/getUserFromToken";
import { getFromCache } from "../../DB/redis.service";

export const isAuthenticated =async (req : Request, res : Response, next : NextFunction) => {
    // get auth from req 
    const authorization = req.headers.authorization;
    // check token 
    if (!authorization) {
        throw new UnAuthorizedException("Missing token");
    }
    const [prefix, token] = authorization.split(" ");

    if (prefix !== "Bearer" || !token) {
        throw new UnAuthorizedException("Invalid token format");
    }

    const blacklisted = await getFromCache(`BLACKLIST:${token}`);
    if (blacklisted) throw new UnAuthorizedException("Token has been revoked");
    

    const user = await getUserFromToken(token);
    if (!user) throw new UnAuthorizedException("User not found");
    

    req.user = user;
    // inject user into req 
    // 3amlt re-open l "Request interface" 
    next();
};

