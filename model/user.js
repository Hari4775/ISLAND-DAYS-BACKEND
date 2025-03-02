const mongoose = require("mongoose");
const validate = require("validator");
const jwt = require("jsonwebtoken");
const env = require("dotenv")
const bcrypt =require("bcrypt");

env.config()

const jwtSecret = process.env.jwtKEY;

const userSchema = new mongoose.Schema({
    fristName:{
        type:String,
    },
    lastName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validate.isEmail(value)){
                throw new Error("invalid mail id entered")
            }
        }
    },
    phone:{
        type:String,
        required:true,
        validate(value){
            if(!validate.isMobilePhone(value,'en-IN')){
                throw new Error("invalid phone number entered")
            }
        }
    },
    age:{
        type:String
    },
   
    gender:{
        type:String,
        enum:{
            values:["male","female","others"],
            message:`{VALUE} is not a valid gender type`
        } 
    },

    password:{
        type:String,
        required:true,
    },
    aadarNumber:{
        type:String,
    
    },
    aadarPhotoURL:{
        type:String
    },
    pccPhotoURL:{
        type:String
    },

    photoURL:{
        type:String,
        
    },
    guardiaFristName:{
        type:String,
        require:true
    },
    gurardianLastName:{
        type:String,
    },
    guradianphone:{
        type:String,
        validate(value){
            if(!validate.isMobilePhone(value,'en-IN')){
                throw new Error("invalid phone number entered")
            }
        }

    },

})

userSchema.methods.getJWT = async function (){
    const user = this;
    const token = await jwt.sign({_id:user._id},jwtSecret,{expiresIn:'7d'})
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash)
    return isPasswordValid;
}
module.exports =mongoose.model("users",userSchema);