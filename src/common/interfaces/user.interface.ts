import { Types } from "mongoose";
import { SYS_GENDER, SYS_PROVIDER, SYS_ROLE } from "../../common";

export interface IUser{
    _id: Types.ObjectId;
    userName : string,
    email : string,
    phoneNumber : string,
    password : string,
    role : SYS_ROLE, 
    gender : SYS_GENDER | undefined,
    provider : SYS_PROVIDER,
    profilePic : string,
    confirmEmail: boolean;
}
