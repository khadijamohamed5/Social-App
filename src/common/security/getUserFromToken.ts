import { verifyAccessToken } from "./jwt.utils";
import { userRepository } from "../../DB/models/user/user.repository";

export const getUserFromToken = async (token: string) => {
    const payload = verifyAccessToken(token) as { id: string };

    const user = await userRepository.getOne({
        _id: payload.id
    });

    return user;
};