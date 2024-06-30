const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { Log } = require("./log_model");

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
            await Log.createLog(`Note created successfully, note_id: ${newNote.note_id}`, "Note", "note_model.js", "N");
            return newNote;
        } catch (error){
            console.log("Error creating note: ", error);
            await Log.createLog(`Error creating note, error: ${error.message}`, "Note", "note_model.js", "Y");
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
            await Log.createLog(`Retrieved notes by book_id: ${book_id}`, "Note", "note_model.js", "N");
            return notes;
        } catch (error){
            console.log("Error getting notes by book id: ", error);
            await Log.createLog(`Error getting notes by book id: ${book_id}, error: ${error.message}`, "Note", "note_model.js", "Y");
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
            await Log.createLog(`Note updated successfully, note_id: ${note.note_id}`, "Note", "note_model.js", "N");
            return updateNote;
        } catch (error){
            console.log("An error occured updating note by note id: ", error);
            await Log.createLog(`An error occurred updating note by note id: ${note.note_id}, error: ${error.message}`, "Note", "note_model.js", "Y");
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
            await Log.createLog(`Note deleted successfully, note_id: ${note_id}`, "Note", "note_model.js", "N");
            return deleteNote;
          } catch (error) {
            console.error("Error deleting note: ", error);
            await Log.createLog(`Error deleting note, note_id: ${note_id}, error: ${error.message}`, "Note", "note_model.js", "Y");
            return false;
          }
    }
}

module.exports = { Note };