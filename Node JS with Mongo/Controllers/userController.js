const { error } = require("console");
const CustomError = require("../Utils/CustomError");
const userModel = require("./../Models/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const sendEmail = require("./../Utils/email");
const crypto = require("crypto");

const authController = require("./authControlles");

createSendResponse = (user, statusCode, res) => {
  console.log("test");
  const token = createToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

filterReqObj=(obj,...allowedFields)=>{
    const newObj={};
    Object.keys(obj).forEach(props=>{
        if(allowedFields.includes(props)){
            newObj[props]=obj[props]
        }
    })
    return newObj;

}

exports.updatePassword = async (req, res, next) => {
  console.log("in user");
  //get password from Db
  const user = await userModel.findById(req.user._id).select("+password");

  //compare password
  console.log(
    await user.comparePassword(req.body.currentPassword, user.password)
  );
  if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
    return next(
      new CustomError("The Current password you provided is wrong", 401)
    );
  }
  // set new password
  user.password = req.body.password;
  user.confirmpassword = req.body.confirmpassword;
  await user.save();
  //loign user and send jwt
  authController.createSendResponse(user, 201, res);
};

exports.updateUserDetail = async(req, res, next) => {
  if (req.body.password || req.body.confirmpassword) {
    return next(
      new CustomError("You can not update password using this endpoint", 400)
    );
  }
  const filterObj=filterReqObj(req.body,'name','email')
const updatedUser=await userModel.findByIdAndUpdate(req.user._id,filterObj,{runValidators:true,new:true})
res.status(200).json({
    status: "success",
    data: {
      user:updatedUser
    },
  });

};
