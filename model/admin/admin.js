const mongoose =require("mongoose");
const validate = require("validator");
const jwt =require("jsonwebtoken");
const env =require("dotenv");
const bcrypt = require("bcrypt");

env.config();


const jwtSecret = process.env.adminJWTkey;

const adminSchema = new mongoose.Schema({
   name:{ type:String,required:true},
   email:{ type:String, lowercase:true,
        required:true,unique:true, trim:true,
        validate(value){
            if(!validate.isEmail(value)){
                throw new Error("invalid mail id entered")
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
 
    phone:{
        type:String, unique:true,
        validate(value){
            if(!validate.isMobilePhone(value,'en-IN')){
                throw new Error("invalid phone number entered")
            }
        }
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    profileImageURL:{
        type:String,
    },


})


adminSchema.methods.getJWT = async function (){
    const admin = this;
    const token = await jwt.sign({_id:admin._id},"ADMINislandays$HEZTA@2024",{expiresIn:'30d'})
    console.log(token,"token")
    return token;
}

adminSchema.methods.validatePassword = async function(passwordInputByUser){
    const admin = this;
    const passwordHash = admin.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash)
    return isPasswordValid;
}

const Admin = mongoose.model("Admin",adminSchema);
module.exports = Admin;