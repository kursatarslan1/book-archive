const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user_model");
const { Password } = require("../models/password_model");
const checkTokenValidity = require("../helpers/check_token_validity");

async function register(req, res) {
  const { first_name, last_name, email, password, phone_number, user_photo } =
    req.body;

  try {
    const existingUser = await User.FindByEmail(email);

    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists." });
    }

    let photo_url;

    try {
      photo_url = await uploadPhoto(user_photo[0].base64, user_photo[0].path);
    } catch (error) {
      photo_url =
        "https://firebasestorage.googleapis.com/v0/b/evcil-dostum-cloud.appspot.com/o/1713905613292_f7hpl1.png?alt=media&token=0babda29-cf92-4950-8614-ec4fb4cc3f1a";
      console.log(error);
    }

    const userResult = await User.create(
      first_name,
      last_name,
      email,
      phone_number,
      photo_url
    );
    const hashed_password = await bcrypt.hash(password, 10);
    await Password.create(userResult.user_id, hashed_password);

    const token = jwt.sign({ userResult }, process.env.JWT_SECRET);

    res.json({ message: "User created successfully.", token });
  } catch (error) {
    console.log("Error register: " + error);
    res.status(500).json({ error: "User not created" });
  }
}

module.exports = { register };
