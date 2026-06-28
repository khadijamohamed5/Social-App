export interface ICloudProvider{
    // aws >> s3 >> return Key from path (not return URL)
    uploadFile(file: Express.Multer.File , path: string) : Promise<string> // string >> as key 
    deleteFile(key:string): Promise<Boolean | undefined>
    getFile(key:string) : Promise<NodeJS.ReadableStream | undefined>
}

