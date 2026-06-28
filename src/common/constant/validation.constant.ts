import z from "zod";
import { SYS_GENDER } from "../enums";

export const generalFields = {
    email : z.email().regex(/^\w{1,100}@(gmail|yahoo|icloud){1}(.com|.edu|.eg|.net|.su){1,3}$/),
    gender : z.enum(SYS_GENDER).optional(),
    password : z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    userName : z.string({ message : "userName is required"}).min(2).max(20),
    phoneNumber : z.string().regex(/^(00201|01|\+201)[0125]{1}[0-9]{8}$/)
}