import crypto from "node:crypto"; //built-in module
import dotenv from "dotenv";

dotenv.config(); // <--- 2. التشغيل

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("FATAL ERROR: ENCRYPTION_KEY must be exactly 32 characters in .env file");
}

export function encrypt(plaintext : string){
    // createCipheriv ( algor / key / iv )
    const iv = crypto.randomBytes(16) // iv >> Initialization vector >> random value ( more secure ) ( length /2 )
    const cipher = crypto.createCipheriv(
        'aes-256-cbc', // key >> AES-256 = 32 bytes  ((32 * 8 = 256))
        Buffer.from(ENCRYPTION_KEY as string), // buffer >> ( string -> to -> byte ) " to encrypt data "
        iv, 
    );

    let encryptedData = cipher.update(plaintext, "utf-8", "hex")
    encryptedData += cipher.final("hex")

    return `${iv.toString("hex")}:${encryptedData}`;
}

export function decrypt(encryptedData : string){
    const [iv, encryptedValue] = encryptedData.split(":");
    const ivBufferLike = Buffer.from(iv as string, "hex");

    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY as string),
        ivBufferLike,
    );

    let decryptedVlaue = decipher.update(encryptedValue as string, "hex", "utf-8");
    decryptedVlaue += decipher.final("utf-8");
    return decryptedVlaue;
}