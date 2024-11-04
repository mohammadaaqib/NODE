const express = require("express");
const userController = require("./../Controllers/userController");
const authController = require("./../Controllers/authControlles");


const router = express.Router();




console.log("in user route")


router.route("/updatePassword/").patch(authController.protect,userController.updatePassword);


router.route("/updateUserDetail/").patch(authController.protect,userController.updateUserDetail);

router.route("/deleteUser/").delete(authController.protect,userController.deleteUser);


module.exports = router;