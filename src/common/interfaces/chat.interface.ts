import { Types } from "mongoose";
import { CHAT_TYPE } from "../enums";

export interface IChat {
    participants : Types.ObjectId[],
    chatType : CHAT_TYPE,
    admin? : Types.ObjectId[], // features
    groupImage? : string,
    groupName? : string,
    groupId : string  // send message to socketIds for each user
}