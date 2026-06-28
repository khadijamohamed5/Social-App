import { Types } from "mongoose";
import { UserRepository } from "../../DB/models/user/user.repository";
import { deleteFromCache, getFromCache, setIntoCache } from "../../DB/redis.service";
import { BadRequestException, ConflictException, NotFoundException, compare, encrypt, generateAccessToken, generateOTP, hash, otpTemplate } from "../../common";
import { IMailProvider } from "../../common/email/mail.interface";
import { nodemailerProvider } from "../../common/email/nodemailer/init";
import { LoginDTO, ForgetPasswordDTO, SendOtpDTO, SignupDTO, VerifyAccountDTO, ChangePasswordDTO } from "./auth.dto";

// single tone design pattern >> mn kol class a3ml instance wahed bs  
class AuthService {
    
    constructor(
        private userRepository : UserRepository, 
        private mailProvider:IMailProvider
    ){}

    async signup(signupDTO : SignupDTO){ 
        const { email } = signupDTO;
        // check user exist 
        const userExist = await this.userRepository.getOne({ email })
        if(userExist) throw new ConflictException("user already exist")
        // hash pass >> bcrypt.utils
        signupDTO.password = await hash(signupDTO.password)
        // encryp phoneNum (first check if phoneNum exist in body) >> encryption.utils
        if (signupDTO.phoneNumber)
            signupDTO.phoneNumber = encrypt(signupDTO.phoneNumber) 
        // send otp >> otp utils 
        const otp = generateOTP()
        // send email >> email.utils
        await this.mailProvider.send(
            signupDTO.email,
            "confirm email",
            otpTemplate({
                otp: otp.toString(),
                title: "Verify Your Account",
                message: "Use the following OTP to verify your account:"
            })
        )

        // save otp into DB (cache >> 5 min w haytmsa77)(ttl)
        // make this service in redis.service.ts ( and call it )
        await setIntoCache(`Social-app-OTP:${signupDTO.email}`,otp, 3 * 60)

        // create user into redis
        await setIntoCache(`Social-app-User:${signupDTO.email}`, JSON.stringify(signupDTO), 3 * 24 * 60 * 60 ) 

    }

    async verifyAccount(verifyAccountDTO: VerifyAccountDTO){
        // check user data from cache 
        // call get redis service from redis 
        const userExist = await getFromCache(`Social-app-User:${verifyAccountDTO.email}`)
        if(!userExist) throw new NotFoundException("user not found")

        // if user exits
        // verify otp eixst 
        const otpExist = await getFromCache(`Social-app-OTP:${verifyAccountDTO.email}`)
        if(!otpExist) throw new BadRequestException("expire OTP")

        // if otp exist ( a3ml compare )
        if(otpExist != verifyAccountDTO.otp)
            throw new BadRequestException("invalid otp")

        // if all is correct ( make it real user in DataBase )
        const parsedUser = JSON.parse(userExist);
        parsedUser.confirmEmail = true; 
        await this.userRepository.create(parsedUser);

        // delete otp/user from cache (make it by service)
        await deleteFromCache(`Social-app-OTP:${verifyAccountDTO.email}`)
        await deleteFromCache(`Social-app-User:${verifyAccountDTO.email}`)

    }

    async sendOtp(sendOtpDto : SendOtpDTO){
        // check email exist into DB
        const userExistIntoDB = await this.userRepository.getOne({ email : sendOtpDto.email})

        // check email exist into cache
        const userExistIntoCache = await getFromCache(`Social-app-User:${sendOtpDto.email}`)

        // if not exist ? 
        if(!userExistIntoCache && !userExistIntoDB){ 
            throw new NotFoundException("user not found, Please signup")
        }

        // if exist >> check if otp valid // if have an otp 
        const otpExist = await getFromCache(`Social-app-OTP:${sendOtpDto.email}`);
        if(otpExist){
            throw new BadRequestException("already have a valid otp")
        }

        // if doesn't have an otp // generate anthor one
        const NewOTP = generateOTP()
        // send to gmail 

        await this.mailProvider.send(
            sendOtpDto.email,
            "confirm email",
            otpTemplate({
                otp: NewOTP.toString(),
                title: "OTP Re-send Request",
                message: "Use the following OTP to continue your verification process:"
            })
        )
        // set the new otp into cache
        await setIntoCache(`Social-app-OTP:${sendOtpDto.email}`, NewOTP, 3 * 60)
    }

    async forgetPassword(forgetPasswordDTO: ForgetPasswordDTO){
        //check email exist into DB
        const userExist = await this.userRepository.getOne({ email : forgetPasswordDTO.email})
        if(!userExist) throw new NotFoundException("user not found")

        // check otp valid 
        const otp = await getFromCache(`Social-app-OTP:${forgetPasswordDTO.email}`);
        if(otp != forgetPasswordDTO.otp) throw new BadRequestException("invalid OTP")

        // hash pass 
        forgetPasswordDTO.newPassword = await hash(forgetPasswordDTO.newPassword)

        // update pass 
        const result = await this.userRepository.updateOne(
            { email : forgetPasswordDTO.email},
            { password : forgetPasswordDTO.newPassword},
            )
        console.log(result)

        // delete otp/user from cache (make it by service)
        await deleteFromCache(`Social-app-OTP:${forgetPasswordDTO.email}`)

    }


    async login(loginDTO: LoginDTO){

        const userExist = await this.userRepository.getOne({ email: loginDTO.email });
        if(!userExist)throw new NotFoundException("invalid email or password");

        if(!userExist.confirmEmail) throw new BadRequestException("Please verify your account first");
        
        const isMatch = await compare(
            loginDTO.password,
            userExist.password
        );
    
        if(!isMatch) throw new BadRequestException("invalid email or password");
        
        const token = generateAccessToken({
            id: userExist._id,
            email: userExist.email,
            role: userExist.role
        });
        
        return { token };
    }

    async changePassword(userId: Types.ObjectId, changePasswordDTO: ChangePasswordDTO){
        // check user exist
        const userExist = await this.userRepository.getOne({ _id : userId });
        if(!userExist) throw new NotFoundException("user not found");
        
        //compare old password
        const isMatched = await compare(
            changePasswordDTO.oldPassword,
            userExist.password
        );
    
        if(!isMatched) throw new BadRequestException("incorrect old password");
        
    
        // hash new password
        const hashedPassword = await hash(changePasswordDTO.newPassword);
    
        // update password
        const result = await this.userRepository.updateOne(
            { _id : userId },
            { password: hashedPassword }
        );
    }


    async logout(token: string) {
        await setIntoCache(`BLACKLIST:${token}`, "true", 7 * 24 * 60 * 60);
    }
}


export default new AuthService(new UserRepository(), nodemailerProvider) // nodemailerProvider >> init el hwa el instance el 3amltoo