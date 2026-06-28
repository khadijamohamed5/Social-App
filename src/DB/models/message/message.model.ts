import { Schema, model } from "mongoose";
import { IChat } from "../../../common/interfaces/chat.interface";
import { CHAT_TYPE } from "../../../common";
import { IMessage } from "../../../common/interfaces/message.interface";

const schema = new Schema<IMessage>({
    content : String,
    sender : { type : Schema.Types.ObjectId, ref : "User", required : true },
    chat : { type : Schema.Types.ObjectId, ref : "Chat", required : true },
    readBy: [{ user: { type: Schema.Types.ObjectId, ref: "User" }, readAt: { type: Date, default: Date.now } }],
    deleteFor: [{ user: { type: Schema.Types.ObjectId, ref: "User" }, deleteAt: { type: Date, default: Date.now } }]
},{ 
    timestamps : { createdAt : true }
})

export const Message = model("Message", schema)