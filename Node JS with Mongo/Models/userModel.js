const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter name feild"],
  },
  email: {
    type: String,
    required: [true, "Please Enter email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please enter a password."],
    minlength: 8,
  },
  confirmpassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "Password & Confirm Password does not match",
    },
  },
  passwordChnagedAt:Date
});

userSchema.pre("save", async function (next) {
    console.log("in hook")
  if (!this.isModified) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmpassword = undefined;
  next();
});
userSchema.methods.comparePassword= async (password,DBPassword)=>{

 return await   bcrypt.compare(password,DBPassword)

}

userSchema.methods.isPasswordChanged=  function(jwtTime){
   if(this.passwordChnagedAt){
    const passChnagedTimestamp=parseInt(this.passwordChnagedAt.getTime()/1000,10);
    return jwtTime<passChnagedTimestamp;

   }
   return false;
   
}


const User = mongoose.model("User", userSchema);
module.exports = User;
