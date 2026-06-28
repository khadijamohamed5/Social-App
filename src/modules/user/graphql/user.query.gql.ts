import userService from "../user.service";
import { UserTypeGql } from "./user.type.gql";
import { Types }  from "mongoose"

export const UserQueryGql = {
    user :{
        type : UserTypeGql,
        resolve : async ()=>{
            return await userService.getProfile(new Types.ObjectId(""))
        }
    }
}