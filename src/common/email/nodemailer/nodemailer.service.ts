import { Transporter } from "nodemailer";
import { IMailProvider } from "../mail.interface";
import nodemailer from "nodemailer"

interface NodeMailerConfig{
    service : string,
    host : string, // host for gmail 
    port : number,
    auth : {
        user : string,
        pass : string
    }
}

export class NodeMailerProvider implements IMailProvider{
    private transporter: Transporter;

    constructor(config: NodeMailerConfig){
        this.transporter = nodemailer.createTransport({
            service : config.service,
            host : config.host, // host for gmail 
            port : config.port,
            auth : {
                user : config.auth.user,
                pass : config.auth.pass
            }
        })
    }




    async send(to: string, subject: string, html: string): Promise<void>{
        await this.transporter.sendMail({to,subject,html})
    }
}