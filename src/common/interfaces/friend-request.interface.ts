import { Types } from "mongoose";

// da interface l friends request 
export interface IFriendRequest { 
    sender : Types.ObjectId,
    receiver : Types.ObjectId
}