import { ZodObject } from "zod";
import { BadRequestException } from "..";

export const isValidGql = async (schema : ZodObject, args :any) => {
    const result = await schema.safeParseAsync(args);
    if(!result.success){
        //prepare error
        const errorMessage = result.error.issues.map((issue)=>({
            path : issue.path[0] as string , // propertyKey 
            message : issue.message,
        }))
        throw new BadRequestException("validation error", errorMessage)
    }
    return result.data;
}