import { Types } from "mongoose";
import { SYS_REACTION } from "../../enums";

export interface AddReactionDto {
    id : Types.ObjectId,
    reaction : SYS_REACTION,
}
