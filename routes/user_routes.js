const express = require("express");
const router = express.Router();

const userController = require("../controllers/user_controller");

router.use(express.json());

router.post("/register", userController.register);

module.exports = router;
