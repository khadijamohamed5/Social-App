import { Types } from "mongoose";

export interface IPost {
    userId : Types.ObjectId;
    content? : string;
    attachments? :string[]; // [urls]
    reactionsCount : number;
    commentsCount : number;
    sharesCount : number;
}