const { error } = require("console");
const CustomError = require("../Utils/CustomError");
const userModel = require("./../Models/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRE,
  });
};

exports.signUp = async (req, res, next) => {
  try {
    const newuser = await userModel.create(req.body);

    const token = createToken(newuser._id);
    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newuser,
      },
    });
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
    const token = createToken(user._id);

    res.status(201).json({
      status: "success",
      data: { token },
    });
  } catch (err) {
    const error = new CustomError(err.message, 404);
  }
};

exports.protect = async (req, res, next) => {
  try {
    //1 fetch token from header
    const tokenfromheader = req.headers.authorization;
    let token;
    if (tokenfromheader && tokenfromheader.startsWith("bearer")) {
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
   if( user.isPasswordChanged(decordedToken.iat)){
    return next( new CustomError("the password is changed recently", 401))
   }

    //5 allow user to access route

    next();
  } catch (err) {
    console.log("here");
    const error = new CustomError(err.message, 400);
    return next(error);
  }
};
