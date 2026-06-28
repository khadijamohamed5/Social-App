import { Types } from "mongoose";

export interface CreateCommentDTO {
    // userId (token) , postId (params), parentId (params)
    content? : string;
    attachment? : string;
    mentions? : Types.ObjectId[];
}