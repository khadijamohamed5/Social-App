import {FirebasePushNotificationProvider} from "./firebase.service"
import * as fs from "node:fs"
import path from "node:path"

const config = 
    JSON.parse(
        fs.readFileSync(
            path.resolve(__dirname,"../../../config/social-app-813b5-firebase-adminsdk-fbsvc-0f16e8355c.json")
            ) as unknown as string // buffer >> string 
    )
export const firebasePushNotificationProvider = new FirebasePushNotificationProvider(config)