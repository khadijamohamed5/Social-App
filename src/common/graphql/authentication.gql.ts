import { getUserFromToken } from "../security/getUserFromToken";

export const isAuthenticatedGql = async (context: any) => {
    const authorization = context.headers.authorization;
    if (!authorization) {
        return { user: null };
    }

    const [prefix, token] = authorization.split(" ");
    if (prefix !== "Bearer" || !token) {
        return { user: null };
    }

    const user = await getUserFromToken(token);
    return { user };
};