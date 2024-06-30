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
        "https://firebasestorage.googleapis.com/v0/b/evcil-dostum-cloud.appspot.com/o/1713905613292_f7hpl1.png?alt=media&token=0babda29-cf92-4950-8614-ec4fb4cc3f1a"; // başka bir projemden default profil fotoğrafı, cloud based storage
      console.log(error);
    }

    const userResult = await User.create(
      first_name,
      last_name,
      email,
      phone_number,
      photo_url
    );

    if(!userResult){
      return res.status(400).json({ message: 'User create failed... '});
    }

    const hashed_password = await bcrypt.hash(password, 10);
    const password_result = await Password.create(userResult.user_id, hashed_password);

    if(!password_result){
      // oluşturulan user kaydını sil
      await User.DeleteUserById(userResult.user_id);
      return res.status(400).json({ message: 'User create failed... '});
    }

    const token = jwt.sign({ userResult }, process.env.JWT_SECRET);

    return res.json({ message: "User created successfully.", token });
  } catch (error) {
    console.log("Error register: " + error);
    res.status(500).json({ error: "User not created" });
  }
}

async function login(req, res){
  const { email, password } = req.body;
  
  try{
    const user = await User.FindByEmail(email);

    if(!user){
      return res.status(400).json({ message: 'User not found.' });
    }

    const passwordRecord = await Password.FindByUserId(user.user_id);

    if(!passwordRecord){
      return res.status(400).json({ message: 'Password error '});
    }

    const passwordMatch = await bcrypt.compare(password, passwordRecord.password_hash);

    if(!passwordMatch){
      return res.status(400).json({ message: 'Password error '});
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET);

    res.json({ message: 'Login success', token });
  } catch (error){
    console.error("Login error: " + error);
    res.status(500).json({ error: "Login unsuccessful" });
  }
}

async function UpdateUser(req, res){
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const tokenValid = await checkTokenValidity(token);
    if (!tokenValid) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const { user } = req.body;

    let user_id;
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error){
        return res.status(400).json({ message: 'Invalid token.' });
    }

    if (isNaN(user.user_id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    if(user_id != user.user_id){
      return res.status(401).json({ message: "Unauthorized token." });
    }

    try{
      const updateResult = await User.UpdateUser(user);
      if(!updateResult){
        return res.status(400).json({ message: "An error occured updating user." });
      }
      return res.json({ updateResult });
    } catch (error){
      console.log("An error occured updating user: ", error);
      return false;
    }
}

async function DeleteUser(req, res){
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const tokenValid = await checkTokenValidity(token);
    if (!tokenValid) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const current_user_id  = parseInt(req.params.current_user_id, 10);

    let user_id;
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error){
        return res.status(400).json({ message: 'Invalid token.' });
    }

    if (isNaN(current_user_id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    if(user_id != current_user_id){
      return res.status(401).json({ message: "Unauthorized token." });
    }

    try{
      const deleteResult = await User.DeleteUserById(current_user_id);
      if(!deleteResult){
        return res.status(400).json({ message: "An error occured deleting user." });
      }
      return res.json({ deleteResult });
    } catch (error){
      console.log("An error occured delete user: ", error);
      return false;
    }
}

module.exports = { register, login, UpdateUser, DeleteUser };
