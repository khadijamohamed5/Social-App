import { Schema, model } from "mongoose";
import { IFriendRequest } from "../../../common";

const schema = new Schema<IFriendRequest>({
    sender : { type : Schema.Types.ObjectId, ref : "User", required : true },
    receiver : { type : Schema.Types.ObjectId, ref : "User", required : true }
},{ 
    timestamps : { createdAt : true }
})

export const friendRequest = model("friendRequest", schema)