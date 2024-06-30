const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Password {
  static async create(user_id, password_hash) {
    try {
      const newPassword = await prisma.PASSWORDS.create({
        data: {
          password_hash: password_hash,
          user_id: user_id,
        },
      });
      return newPassword;
    } catch (error) {
      console.log("Error creating password: ", error);
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
      return userId;
    } catch (error){
      console.log('error getting user id: ', error);
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
}

module.exports = { Password };
