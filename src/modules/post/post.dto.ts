import { SYS_REACTION } from "../../common";
import { Types } from "mongoose";
// dto >> data transfer object 


export interface CreatePostDto{
    content? : string,
    attachments? : string[],
}

export interface AddReactionDto {
    postId : Types.ObjectId,
    reaction : SYS_REACTION,
}



