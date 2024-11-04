const express = require("express");
const authController = require("./../Controllers/authControlles");

const router = express.Router();

router.route("/signup").post(authController.signUp);

router.route("/login").post(authController.login);

router.route("/forgetPassword").post(authController.forgetPassword);

router.route("/resetPassword/:token").patch(authController.resetPassword);



module.exports = router;
