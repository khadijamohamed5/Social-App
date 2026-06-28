export interface INotificationProvider {
    // token >> FCM 
    // data >> obj contain push notification data 
    send(token: string, data: {title : string, body : string}) : Promise<void>
}