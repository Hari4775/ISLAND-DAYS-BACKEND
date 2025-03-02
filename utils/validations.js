const validator= require("validator");

const validateSignupData = (req)=>{
    console.log(req.body,"req bodu")
    const {
        fristName,
        lastName,
        phone,
        age,
        gender,
        email,
        password, 
        aadarNumber,
        aadarPhotoURL,
        pccPhotoURL,
        photoURL,
        guardiaFristName,
        gurardianLastName, 
        guradianphone}= req.body;

    if(!fristName){
        throw new Error("name is not valid")
    }
   if(!validator.isMobilePhone(phone,'en-IN')){
    throw new Error("invalid phone number entered")
    }

    if(!age){
        throw new Error("age is required")
    }
    if(!validator.isEmail(email)){
        throw new Error("Email is not valid")
    }
    if (!validator.isStrongPassword(password)){
        throw  new Error("Please enter a strong Password")
    }

    if(!validator.isMobilePhone(guradianphone,'en-IN')){
        throw new Error("invalid phone number entered")
        }
    
}

const validationProfileData =(req)=>{
    const allowedEditFields = ["email","phone","age","gender","password","aadarnumber","aadarPhotoURL","pccPhotoURL",
        "photoURL","guardiaFristName","gurardianLastName","guradianphone"];
        const isEditAllowed = Object.keys(req.body).every(field=>allowedEditFields.includes(field));
        return isEditAllowed
}
module.exports = {validateSignupData,validationProfileData}