
//isValid function that return middleware 3amlt keda 3alshan hakhaleha function btakhod elSchema 
import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { BadRequestException } from "..";

export const isValid = (schema : ZodObject) => {
    return async ( req : Request, res : Response, next : NextFunction )=>{
        const result = await schema.safeParseAsync(req.body);
        if(result.success == false ){
            //prepare error
            const errorMessage = result.error.issues.map((issue)=>({
                path : issue.path[0] as string , // propertyKey 
                message : issue.message,
            }))
            throw new BadRequestException("validation error", errorMessage)
        }
        next()
    }
}
