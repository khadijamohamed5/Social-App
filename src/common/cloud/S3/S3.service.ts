import { S3_BUCKET_NAME } from "../../../config";
import { ICloudProvider } from "../cloud.interface";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"


interface S3Config{
    region : string,
    credentials : {
        accessKeyId : string;
        secretAccessKey : string;
    }
}


export class S3CloudProvider implements ICloudProvider{
    private readonly s3Client : S3Client;

    constructor(config: S3Config ){
        this.s3Client = new S3Client({
            region : config.region,
            credentials : config.credentials
        })
    }

    // way 1 
    async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
        // npm @aws-sdk/lib-storage >> support larg storage 
        const upload = new Upload({
            client : this.s3Client,
            params : {
                Bucket : S3_BUCKET_NAME,
                Key : `social-app/${path}/${Date.now()}_${file.originalname}`,
                ACL : "private",
                ContentType : file.mimetype,
                Body : file.buffer
            }
        })

        // emit >> chunck of file >> emit httpUploadProgress >> {loaded, total, ...}
        upload.on('httpUploadProgress',(progress)=>{ // interface in type.d.ts
            console.log(progress);
        })

        const {Key} = await upload.done();
        return Key as string;

    }


    async deleteFile(key: string): Promise<Boolean | undefined> {
        let command = new DeleteObjectCommand({
            Key : key,
            Bucket : S3_BUCKET_NAME
        })
        const {DeleteMarker} = await this.s3Client.send(command)
        return DeleteMarker;
    }


    async getFile(key: string): Promise<NodeJS.ReadableStream | undefined> {
        let command = new GetObjectCommand({
            Key : key,
            Bucket : S3_BUCKET_NAME
        })
        const {Body}= await this.s3Client.send(command)
        return Body as NodeJS.ReadableStream
    }
}