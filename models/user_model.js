const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
      return newUser;
    } catch (error) {
      console.log("Error creating user: ", error);
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
      return user;
    } catch (error) {
      console.log("Error executing findByEmail query: ", error);
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
      return updateUser;
    } catch (error){
      console.log("An error occured updating user: ", error);
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
      return deletedUser;
    } catch (error) {
      console.error("Error deleting user: ", error);
      throw error;
    }
  }
  
}

module.exports = { User };
