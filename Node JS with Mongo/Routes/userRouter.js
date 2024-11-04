const express = require("express");
const userController = require("./../Controllers/userController");
const authController = require("./../Controllers/authControlles");


const router = express.Router();






router.route("/getAllUsers/").get(userController.getAllUser);

router.route("/updatePassword/").patch(authController.protect,userController.updatePassword);


router.route("/updateUserDetail/").patch(authController.protect,userController.updateUserDetail);

router.route("/deleteUser/").delete(authController.protect,userController.deleteUser);


module.exports = router;