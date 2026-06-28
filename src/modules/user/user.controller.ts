import { NextFunction, Request, Response, Router } from "express";
import { multerUploadFile } from "../../common";
import userService from "./user.service";
import { Types } from "mongoose";
import { isAuthenticated } from "../../common/middlewares";

const userRouter = Router();

// auth
// multer >> file >> originalName , mimetype
userRouter.post('/profile-pic', isAuthenticated ,multerUploadFile().single('profile-pic'), async (req : Request, res : Response, next : NextFunction) => {
    const data = await userService.uploadProfilePic(
        req.file as Express.Multer.File,
        req.user._id, // auth
    )
    return res.status(200).json({message:"sucess", data})
})

userRouter.get('/', isAuthenticated, async (req : Request, res : Response, next : NextFunction) => {
    const {user, friends } = await userService.getProfile(req.user._id)
    // console.log({user, friends})
    return res.status(200).json({message:"sucess", data: {user, friends}})
})

export default userRouter; 
