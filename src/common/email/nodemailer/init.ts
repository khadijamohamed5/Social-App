import { SEND_MAIL_PASS, SEND_MAIL_USER } from "../../../config";
import { NodeMailerProvider } from "./nodemailer.service";

export const nodemailerProvider = new NodeMailerProvider({
    service : "gmail",
    host : "smtp.gmail.com", // host for gmail 
    port : 587,
    auth : {
        user : SEND_MAIL_USER,
        pass : SEND_MAIL_PASS
    }
})