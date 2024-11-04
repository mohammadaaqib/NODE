
const CustomError = require("../Utils/CustomError");
const userModel = require("./../Models/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const sendEmail = require("./../Utils/email");
const crypto = require("crypto");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRE,
  });
};

createSendResponse=(user,statusCode,res)=>{
    jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRE,
      });
    const token = createToken(user._id);
    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        user
      },
    });

} 

exports.signUp = async (req, res, next) => {
  try {
    const newuser = await userModel.create(req.body);

    createSendResponse(newuser,200,res)
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      const error = new CustomError(
        "Please provide email and password for login !",
        400
      );
      return next(error);
    }
    const user = await userModel.findOne({ email });
    // const isMatch = await user.comparePassword(password, user.password);

    if (!user || !(await user.comparePassword(password, user.password))) {
      const error = new CustomError("Email or user is not correct", 400);
      return next(error);
    }


    createSendResponse(user,201,res)
  } catch (err) {
    const error = new CustomError(err.message, 404);
  }
};

exports.protect = async (req, res, next) => {
  try {
    //1 fetch token from header
    const tokenfromheader = req.headers.authorization;
    let token;
    if (tokenfromheader && tokenfromheader.startsWith("Bearer")) {
      token = tokenfromheader.split(" ")[1];
    }
    if (!token) {
      next(new CustomError("You are not logged in", 401));
    }
    //2 verify token
    const decordedToken = await util.promisify(jwt.verify)(
      token,
      process.env.SECRET_STR
    );
    console.log(decordedToken);

    //3 check if user exists
    const user = await userModel.findById(decordedToken.id);

    if (!user) {
      next(
        new CustomError("the user with the given token does not exist", 401)
      );
    }

    //4 if user change password after token issued
    if (user.isPasswordChanged(decordedToken.iat)) {
      return next(new CustomError("the password is changed recently", 401));
    }

    //5 allow user to access route
    req.user = user;
    next();
  } catch (err) {
    const error = new CustomError(err.message, 400);
    return next(error);
  }
};

exports.restrict = (role) => {
  return (req, res, next) => {
    if (role !== req.user.role) {
      next(
        new CustomError(
          "You do not have permission to performe this action",
          403
        )
      );
    }
    next();
  };
};

exports.forgetPassword = async (req, res, next) => {
  //1 get user

  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    next(new CustomError("Please enter email", 401));
  }
  //2 generate reset passeord token
  const resetToken = user.createResetPasswordToken();
  console.log("reset")
  await user.save({ validateBeforeSave: false });
  console.log(await user.save({ validateBeforeSave: false }))

  //3 semd email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `We have recived a password reset request.  Please use the below link to reset your password \n\n${resetUrl} \n\n This reset password link will be valid only for 10 mint`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password change request",
      message: message,
    });
    res.status(200).json({
      status: "Success",
      message: "Password reset link send to the user email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({ validateBeforeSave: false });
    next(
      new CustomError(
        "There was an error sending password reset email. Please try again later",
        500
      )
    );
  }
};

exports.resetPassword = async (req, res, next) => {
    // check token is correct and not expire
    const token =crypto.createHash('sha256').update(req.params.token).digest('hex')
const user = await userModel.findOne({passwordResetToken:token,passwordResetTokenExpires:{$gt:Date.now()}})

if(!user){
  return   next(new CustomError('Token is invalid or has expire',400))
}
// save new password in db 
user.password=req.body.password;
user.confirmpassword=req.body.confirmpassword;
user.passwordResetToken=undefined;
user.passwordResetTokenExpires=undefined;
user.passwordChnagedAt=Date.now();

user.save();
// login in user 

createSendResponse(user,201,res)



};


