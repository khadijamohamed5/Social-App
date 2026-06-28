import { type NextFunction, type Request, type Response, Router } from "express";
import { isAuthenticated, isValid } from "../../common/middlewares";
import authService from "./auth.service";
import { signupSchema, verifyAccountSchema, sendOtpSchema, forgetPasswordSchema, loginSchema, changePasswordSchema } from "./auth.validation";

const authRouter = Router();

authRouter.post("/signup", isValid(signupSchema), async (req: Request, res: Response, next: NextFunction)=>{
    await authService.signup(req.body)
    return res.status(201).json({
        message : "user created successfully, Verify your account by OTP",
        success : true,
    })
})

authRouter.post("/verify-account", isValid(verifyAccountSchema), async (req: Request, res: Response, next: NextFunction)=>{
    await authService.verifyAccount(req.body)
    return res.status(200).json({
        message : "your Account verified successfully",
        success : true,
    })
})

authRouter.post("/send-otp", isValid(sendOtpSchema), async (req: Request, res: Response, next: NextFunction)=>{
    await authService.sendOtp(req.body)
    return res.status(200).json({
        message : "re-send OTP successfully",
        success : true,
    })
})

authRouter.patch("/forget-password", isValid(forgetPasswordSchema), async (req: Request, res: Response, next: NextFunction)=>{
    await authService.forgetPassword(req.body)
    return res.status(200).json({
        message : "reset Password successfully",
        success : true,
    })
})

authRouter.post("/login", isValid(loginSchema),async (req: Request, res: Response, next: NextFunction) => {
    const data = await authService.login(req.body);
    return res.status(200).json({
        message: "login successfully",
        success: true,
        data
    });
});

authRouter.patch("/change-password", isValid(changePasswordSchema), isAuthenticated, async ( req: Request, res: Response, next: NextFunction)=>{
    await authService.changePassword(req.user._id, req.body);

    return res.status(200).json({
        message: "password changed successfully",
        success: true
    });
});


authRouter.post("/logout", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization!.split(" ")[1];
    await authService.logout(token as string);

    return res.status(200).json({ success: true, message: "Logged out successfully"});
    }
);

export default authRouter;