import { Types } from "mongoose";
import { IPost } from "./post.interface";

export interface IComment {
    userId : Types.ObjectId;
    postId : Types.ObjectId | IPost[];
    parentId : Types.ObjectId | undefined; // reply
    content? : string;
    attachment? :string; // [urls]
    mentions?: Types.ObjectId[];
    reactionsCount:number;
}