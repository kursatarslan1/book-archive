const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Note {
    static async Create(note){
        try{
            const newNote = await prisma.NOTES.create({
                data: {
                    book_id: note.book_id,
                    publisher_id: note.publisher_id,
                    content: note.content,
                    sharing: note.sharing
                },
            });
            return newNote;
        } catch (error){
            console.log("Error creating note: ", error);
            return false;
        }
    }

    static async GetNotesByBookId(book_id){
        try{
            const notes = await prisma.NOTES.findMany({
                where: {
                    book_id: book_id,
                },
            });
            return notes;
        } catch (error){
            console.log("Error getting notes by book id: ", error);
            return false;
        }
    }

    static async UpdateNoteByNoteId(note){
        try{
            const updateNote = await prisma.NOTES.update({
                where: {
                    note_id: note.note_id,
                },
                data: {
                    content: note.content,
                    sharing: note.sharing,
                },
            });
            return updateNote;
        } catch (error){
            console.log("An error occured updating note by note id: ", error);
            return false;
        }
    }

    static async DeleteNoteByNoteId(note_id){
        try {
            const deleteNote= await prisma.NOTES.delete({
              where: {
                note_id: note_id,
              },
            });
            return deleteNote;
          } catch (error) {
            console.error("Error deleting note: ", error);
            return false;
          }
    }
}

module.exports = { Note };