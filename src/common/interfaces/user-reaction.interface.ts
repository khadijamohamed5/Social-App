import { Types } from "mongoose";
import { ON_MODEL, SYS_REACTION } from "../enums";

export interface IUserReaction{
    userId : Types.ObjectId,
    refId : Types.ObjectId, // postId, CommentId, reelId, storyId
    onModel : ON_MODEL, // Enum
    reaction : SYS_REACTION, 
}