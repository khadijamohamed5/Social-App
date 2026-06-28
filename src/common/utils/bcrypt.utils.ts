import bcrypt from "bcrypt";

export async function hash(password : string){
    return await bcrypt.hash(password, 12);
}

export async function compare(password : string, hashpassword : string){
    return await bcrypt.compare(password, hashpassword)
}