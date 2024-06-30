const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { Log } = require("./log_model");

class Password {
  static async create(user_id, password_hash) {
    try {
      const newPassword = await prisma.PASSWORDS.create({
        data: {
          password_hash: password_hash,
          user_id: user_id,
        },
      });
      await Log.createLog(`Password created successfully for user_id: ${user_id}`, "Password", "password_model.js", "N");
      return newPassword;
    } catch (error) {
      console.log("Error creating password: ", error);
      await Log.createLog(`Error creating password for user_id: ${user_id}, error: ${error.message}`, "Password", "password_model.js", "Y");
      return false;
    }
  }

  static async FindByUserId(user_id){
    try{
      const userId = await prisma.PASSWORDS.findFirst({
        where: {
          user_id: user_id,
        },
      });
      await Log.createLog(`Password found for user_id: ${user_id}`, "Password", "password_model.js", "N");
      return userId;
    } catch (error){
      console.log('error getting user id: ', error);
      await Log.createLog(`Error getting password for user_id: ${user_id}, error: ${error.message}`, "Password", "password_model.js", "Y");
      return false;
    }
  }

  static async FindByEmail(email) {
    try {
      const user = await prisma.USERS.findFirst({
        where: {
          email: email,
        },
      });
      await Log.createLog(`User found by email: ${email}`, "Password", "password_model.js", "N");
      return user;
    } catch (error) {
      console.log("Error executing findByEmail query: ", error);
      await Log.createLog(`Error executing findByEmail query for email: ${email}, error: ${error.message}`, "Password", "password_model.js", "Y");
      throw error;
    }
  }
}

module.exports = { Password };
