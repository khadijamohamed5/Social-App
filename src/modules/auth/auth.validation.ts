import z from "zod"
import { generalFields } from "../../common"

export const signupSchema = z.object({
    email : generalFields.email,
    gender : generalFields.gender,
    password : generalFields.password,
    userName : generalFields.userName,
    phoneNumber : generalFields.phoneNumber
})

export const loginSchema = z.object({
    email: generalFields.email,
    password: generalFields.password
});

export const forgetPasswordSchema = z.object({
    email: generalFields.email,
    otp: z.string(),
    newPassword: generalFields.password
});

export const changePasswordSchema = z.object({
    oldPassword: generalFields.password,
    newPassword: generalFields.password
});

export const sendOtpSchema = z.object({
    email: generalFields.email
});

export const verifyAccountSchema = z.object({
    email: generalFields.email,
    otp: z.string().length(6, "OTP must be 6 digits")
});
