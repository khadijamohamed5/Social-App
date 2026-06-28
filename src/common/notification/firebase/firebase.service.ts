import { INotificationProvider } from "../notification.interface";
import admin from "firebase-admin"

export class FirebasePushNotificationProvider implements INotificationProvider{
    private firebaseClient: admin.app.App

    constructor(config : any){
        this.firebaseClient = admin.initializeApp({
            credential: admin.credential.cert(config)
        });
    }


    async send(token: string, data: { title: string; body: string; }): Promise<void> {
        await this.firebaseClient.messaging().send({token,data})
    }

}