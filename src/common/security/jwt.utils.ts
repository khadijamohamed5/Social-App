import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../config";

export const generateAccessToken = (payload: object) => {
    return jwt.sign(
        payload,
        ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: "7d"
        }
    );
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(
        token,
        ACCESS_TOKEN_SECRET as string
    );
};