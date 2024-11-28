const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

module.exports = router;