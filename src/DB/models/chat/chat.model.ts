import { Schema, model } from "mongoose";
import { IChat } from "../../../common/interfaces/chat.interface";
import { CHAT_TYPE } from "../../../common";

const schema = new Schema<IChat>({
    participants : { type : [Schema.Types.ObjectId], ref : "User", required : true },
    chatType : { type : String , enum : CHAT_TYPE, default : CHAT_TYPE.private },
    admin : { type : [Schema.Types.ObjectId], ref : "User", required : function (this){
        return this.chatType == CHAT_TYPE.group 
    }},
    groupImage: { type: String },
    groupName: { type: String },
    groupId: { type: String, required: function (this) {
        return this.chatType === CHAT_TYPE.group;
    }}
    
},{ 
    timestamps : true
})

export const Chat = model("Chat", schema)