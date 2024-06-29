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
}

module.exports = { Password };
