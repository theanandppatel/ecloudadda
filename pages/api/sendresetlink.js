import Users from "../../models/Users"
import Token from "../../models/Token"
import connectDb from "../../middleware/mongoose"
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const handler = async (req, res) => {
    if (req.method == 'POST') {
        try {
            let user = await Users.findOne({ email: req.body.email })
            
            if(user){
                let token = await Token.findOne({ email: req.body.email });
                if(!token){
                    token = await new Token({
                        email: req.body.email,
                        token: crypto.randomBytes(64).toString("hex"),
                    }).save();
                }
                const url = `${process.env.NEXT_PUBLIC_HOST}/resetpassword?resettoken=${token.token}`
                let transporter = nodemailer.createTransport({
                    service: "​gmail",
                    port: 587,
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASS
                    }
                });

                //​Create the message object​
            let message = {
                from: process.env.EMAIL,
                to: user.email,
                subject: "Ecloud Adda Reset Password Link",
                html: `
                
                <p>Your Link for reset Password is ${url}</p>
                <br>
                <br>
                <br>
                <p>Thanks & Regards,
                <br>
                   Ecloud Adda</p>`
                //​ html: "<p>HTML version of the message</p>"​
            };

            //​Send mail​
            await transporter.sendMail(message, (err) => {
                if (err) {
                    success = false
                    res.status(400).json({ success:false, message: "There is Some Error occured to sent a email" })
                }
                else {
                    res.status(200).json({ success:true, message: "Reset link successfully sent to your email" })
                    return
                }
            })
            }else{
                res.status(400).json({ success:false, message: "User with given email does not exist" })
            }
        } catch (error) {
            res.status(400).json({success:false,message: "Some error occured, Try again!"})
        }
    }else{
        res.status(400).json({error:"This method is not allowed"})
    }
}

export default connectDb(handler)