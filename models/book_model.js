const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { Friendship } = require("./friendship_model");
const { Log } = require("./log_model");

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
      await Log.createLog(`Book created successfully, book_id: ${newBook.book_id}`, "Book", "book_model.js", "N");
      return newBook;
    } catch (error) {
      console.log("Error creating book: ", error);
      await Log.createLog(`Error creating book, error: ${error.message}`, "Book", "book_model.js", "Y");
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

      await Log.createLog(`Book retrieved successfully, book_id: ${book_id}`, "Book", "book_model.js", "N");
      return book;
    } catch (error) {
      console.log("Error getting book: ", error);
      await Log.createLog(`Error getting book, book_id: ${book_id}, error: ${error.message}`, "Book", "book_model.js", "Y");
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
      await Log.createLog(`Books retrieved by category: ${category}`, "Book", "book_model.js", "N");
      return book;
    } catch (error) {
      console.log('Error getting books by category: ', error);
      await Log.createLog(`Error getting books by category: ${category}, error: ${error.message}`, "Book", "book_model.js", "Y");
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
      await Log.createLog(`Book updated successfully, book_id: ${book.book_id}`, "Book", "book_model.js", "N");
      return updatedBook;
    } catch (error) {
      console.log("Error updating book: ", error);
      await Log.createLog(`Error updating book, book_id: ${book.book_id}, error: ${error.message}`, "Book", "book_model.js", "Y");
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
      await Log.createLog(`Book deleted successfully, book_id: ${book_id}`, "Book", "book_model.js", "N");
      return deleteBook;
    } catch (error) {
      console.error("Error deleting book: ", error);
      await Log.createLog(`Error deleting book, book_id: ${book_id}, error: ${error.message}`, "Book", "book_model.js", "Y");
      return false;
    }
  }
}

module.exports = { Book };