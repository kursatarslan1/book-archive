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
}

module.exports = { User };
