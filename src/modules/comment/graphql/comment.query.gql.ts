import commentService from "../comment.service";
import { CommentTypeGql } from "./comment.type.gql";
import { Types }  from "mongoose"

export const CommentQueryGql = {
    comment :{
        type : CommentTypeGql,
        resolve : async ()=>{
            return await commentService.getComment(new Types.ObjectId(""))
        }
    }
}