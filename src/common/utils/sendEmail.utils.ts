import nodemailer from "nodemailer"
import dotenv from "dotenv";
import { SEND_MAIL_PASS, SEND_MAIL_USER } from "../../config";
import { MailOptions } from "nodemailer/lib/json-transport";
dotenv.config();


export const sendMail = async ({to, subject, html} : MailOptions)=>{
    const transporter = nodemailer.createTransport({
        service : "gmail",
        host : "smtp.gmail.com", // host for gmail 
        port : 587,
        auth : {
            user : SEND_MAIL_USER,
            pass : SEND_MAIL_PASS
        }
    })
    await transporter.sendMail({
        from : SEND_MAIL_USER,
        to,
        subject,
        html,
    })
}

