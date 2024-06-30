const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { Log } = require("./log_model");

class User {
  static async create(first_name, last_name, email, phone_number, user_photo) {
    try {
      const newUser = await prisma.USERS.create({
        data: {
          first_name: first_name,
          last_name: last_name,
          email: email,
          phone_number: phone_number,
          user_photo: user_photo,
        },
      });
      await Log.createLog(`User created successfully, user_id: ${newUser.user_id}`, "User", "user_model.js", "N");
      return newUser;
    } catch (error) {
      console.log("Error creating user: ", error);
      await Log.createLog(`Error creating user: ${error.message}`, "User", "user_model.js", "Y");
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
      await Log.createLog(`User found by email, email: ${email}`, "User", "user_model.js", "N");
      return user;
    } catch (error) {
      console.log("Error executing findByEmail query: ", error);
      await Log.createLog(`Error executing findByEmail query: ${error.message}`, "User", "user_model.js", "Y");
      throw error;
    }
  }

  static async UpdateUser(user){
    try{
      const updateUser = await prisma.USERS.update({
        where: {
          user_id: user.user_id,
        },
        data: {
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          user_photo: user.user_photo,
        },
      });
      await Log.createLog(`User updated successfully, user_id: ${user.user_id}, old data: ${JSON.stringify(oldUser)}, new data: ${JSON.stringify(user)}`, "User", "user_model.js", "N");
      return updateUser;
    } catch (error){
      console.log("An error occured updating user: ", error);
      await Log.createLog(`An error occurred updating user: ${error.message}`, "User", "user_model.js", "Y");

      return false;
    }
  }

  static async DeleteUserById(userId) {
    try {
      await prisma.FRIENDSHIPS.deleteMany({
        where: {
          OR: [
            { user_id1: userId },
            { user_id2: userId },
          ],
        },
      });

      await prisma.PASSWORDS.deleteMany({
        where: {
          user_id: userId,
        },
      });

      await prisma.NOTES.deleteMany({
        where:{
          publisher_id: userId,
        },
      });

      const deletedUser = await prisma.USERS.delete({
        where: {
          user_id: userId,
        },
      });
      await Log.createLog(`User deleted successfully, user_id: ${userId}, old data: ${JSON.stringify(oldUser)}`, "User", "user_model.js", "N");
      return deletedUser;
    } catch (error) {
      console.error("Error deleting user: ", error);
      await Log.createLog(`Error deleting user: ${error.message}`, "User", "user_model.js", "Y");
      throw error;
    }
  }
  
}

module.exports = { User };
