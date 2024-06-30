const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { Friendship } = require("./friendship_model");

class Book {
  static async Create(book) {
    try {
      const newBook = await prisma.BOOKS.create({
        data: {
          book_name: book.book_name,
          book_photo: book.book_photo,
          section: book.section,
          category: book.category,
          shelf_number: book.shelf_number,
          row_number: book.row_number,
          author: book.author,
          page_count: book.page_count,
          publisher_id: book.publisher_id
        }
      });
      return newBook;
    } catch (error) {
      console.log("Error creating book: ", error);
      return false;
    }
  }

  static async GetBookById(user_id, book_id) {
    try {
      const friendUserIdList = await Friendship.GetFriendUserIdList(user_id);

      if (friendUserIdList.length === 0) {
        friendUserIdList.push(user_id);
      }
      
      const book = await prisma.BOOKS.findUnique({
        where: {
          book_id: book_id,
        },
        include: {
          notes: {
            where: {
              OR: [
                { sharing: 'P' }, 
                {
                  sharing: 'F',
                  publisher_id: {
                    in: friendUserIdList, 
                  },
                },
                {
                  sharing: 'S',
                  publisher_id: user_id, 
                },
              ],
            },
          },
        },
      });

      return book;
    } catch (error) {
      console.log("Error getting book: ", error);
      throw error;
    }
  }

  static async GetBookByCategory(user_id, category) {
    try {
      const book = await prisma.BOOKS.findUnique({
        where: {
          category: category,
        },
        include: {
          notes: {
            where: {
              OR: [
                { sharing: 'P' }, // Public notes
                {
                  sharing: 'F',
                  publisher_id: user_id, // Friend notes
                },
                {
                  sharing: 'S',
                  publisher_id: user_id, // Private notes visible only to the creator
                },
              ],
            },
          },
        },
      });
      return book;
    } catch (error) {
      console.log('Error getting books by category: ', error);
      return false;
    }
  }

  static async UpdateBookById(book) {
    try {
      const updatedBook = await prisma.BOOKS.update({
        where: {
          book_id: book.book_id,
        },
        data: {
          book_name: book.book_name,
          book_photo: book.book_photo,
          section: book.section,
          category: book.category,
          shelf_number: book.shelf_number,
          row_number: book.row_number,
        },
      });
      return updatedBook;
    } catch (error) {
      console.log("Error updating book: ", error);
      return false;
    }
  }

  static async DeleteBookById(book_id) {
    try {
      await prisma.NOTES.deleteMany({
        where: {
          book_id: book_id,
        },
      });

      const deleteBook = await prisma.BOOKS.delete({
        where: {
          book_id: book_id,
        },
      });
      return deleteBook;
    } catch (error) {
      console.error("Error deleting book: ", error);
      return false;
    }
  }
}

module.exports = { Book };