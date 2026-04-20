import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { sendEmail } from "../servics/mail.servics.js";


export async function register(req,res){
    const {username,email,password} = req.body

    const isUserAlreadyexist = await userModel.findOne({
        $or: [{email},{username}]
    })

    if(isUserAlreadyexist){
        return res.status(400).json({
            message:'user with this email or username already exist',
            success:false,
            err: "user already exist"
        })



    }

   

    const user =  await userModel.create({username,email,password})

     const emailverificationtoken = jwt.sign({
        email:user.email,
    },process.env.JWT_SECRECT)

    try {
        await sendEmail({
            to:email,
            subject:"welcome to Perplexcity",
            html:`
                   <p>Hi ${username},</p>
                   <p>Thank you for registering at <strong>Perplexcity <strong>. We are exixted to have you on this <p/>
                   <p> please verify your email by clicking the link below </p>
                   <a href="http://localhost:3000/api/auth/verify-email?token=${emailverificationtoken}">Verify email</a>
                   <p> Best regards <br> the Perplexcity team <br>

            `

        })
    } catch (emailError) {
        console.error('Email sending failed:', emailError.message)
    }

    res.status(201).json({
        message:"User registerd sucessfully",
        sucess:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

export async function login(req,res){
       const {email,password} = req.body

       const user = await userModel.findOne({email})
       console.log(user)

       if(!user){
        return res.status(400).json({
                message:"invalid email or password",
                success:false,
                err:"User not found",
        })
       }

       const ispasswordmatched = await user.comparePassword(password)

       if(!ispasswordmatched){
           return res.status(400).json({
                     message:"invalid emailor password",
                     success:false,
                     err:"invalid password"
           })
       }

       if(!user.verified){
          return res.status(400).json({
                  message:"please verify your email before logging in ",
                  success:false,
                  err:"email not verified"
          })
       }

       const token = jwt.sign({
            id:user._id,
            username:user.username

       },process.env.JWT_SECRECT,{expiresIn:'10d'})

       res.cookie("token",token)
       res.status(200).json({
           message:"login successfully",
           success:true,
           user:{
              id:user._id,
              username:user.username,
              email:user.email,
           }

       })


}

export async function getMe(req,res){
    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password")

    if(!user){
        return res.status(400).json({
            message:"user not found ",
            success:false,
            err:"user not found"
        })
    }

    res.status(200).json({
        message:"user details fetched successfully",
        success:true,
        user
    })
}

export  async function verifyEmail(req,res){
    const {token} = req.query

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRECT)

    const user = await userModel.findOne({email:decoded.email})

    if(!user){
        res.status(400).json({
            message:"Invalid Tokken",
            success: false,
            err:"user not Found",
        })
    }

    user.verified = true
    await user.save()

    const html = `
                   <h1>Email verified successfully </h1>
                   <p>Your email has been verifed successfully .Ypu can log into your account</p>
                   <a href="http://localhost:3000/api/auth/login">Go To Login </a>
    `

      return res.send(html)
        
    } catch (err) {
        return res.status(400).json({
                   message:"invalid token or expirey token ",
                   success: false,
                   err:err.message
        })
       

        
    }
    
}
