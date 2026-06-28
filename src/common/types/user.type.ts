import { HydratedDocument } from "mongoose";
import { IUser } from "../interfaces";

// Document = __v , _id, save  
// & = and = inhert
// export type UserDocument = IUser & Document 
export type UserDocument = HydratedDocument<IUser>;