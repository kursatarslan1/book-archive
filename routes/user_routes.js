const express = require("express");
const router = express.Router();

const userController = require("../controllers/user_controller");

router.use(express.json());

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/user", userController.UpdateUser);
router.delete("/user/:current_user_id", userController.DeleteUser);

module.exports = router;
