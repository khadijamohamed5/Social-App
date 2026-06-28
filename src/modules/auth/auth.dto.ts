// DTO >> Data To Object 

import z from "zod";
import { changePasswordSchema, forgetPasswordSchema, loginSchema, sendOtpSchema, signupSchema } from "./auth.validation";


// create dto mn el Zod validation 
export type SignupDTO = z.infer<typeof signupSchema> // infer >> genrate type 
export type SendOtpDTO = z.infer<typeof sendOtpSchema>
export type LoginDTO = z.infer<typeof loginSchema>
export type ForgetPasswordDTO = z.infer<typeof forgetPasswordSchema>
export type ChangePasswordDTO =z.infer<typeof changePasswordSchema>


export interface VerifyAccountDTO {
    otp : string;
    email : string;
}
