const { Note } = require("../models/note_model");
const jwt = require('jsonwebtoken');
const checkTokenValidity = require("../helpers/check_token_validity");
const { Log } = require('../models/log_model');

async function CreateNote(req, res) {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: "Invalid token." });
        }

        const tokenValid = await checkTokenValidity(token);
        if (!tokenValid) {
            return res.status(400).json({ message: "Invalid token." });
        }

        const { note } = req.body;

        let user_id;
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            user_id = decodedToken.user.user_id;
        } catch (error) {
            return res.status(400).json({ message: 'Invalid token.' });
        }

        note.publisher_id = user_id;

        if (note.content.length > 255) {
            return res.status(400).json({ message: "Content too long... " });
        }

        const noteResult = await Note.Create(note);

        if (!noteResult) {
            await Log.createLog(`An error occured creating note for user_id: ${user_id}`, "Note", "note_controller.js", "Y");
            return res.status(400).json({ message: "An error occured creating note. " });
        }

        await Log.createLog(`Note created successfully for user_id: ${user_id}`, "Note", "note_controller.js", "N");
        return res.json({ message: "Note created successfully", noteResult });
    } catch (error) {
        console.log("Error creating note: ", error);
        await Log.createLog(`An error occured creating note, error: ${error.message}`, "Note", "note_controller.js", "Y");
    }
}

async function GetNotes(req, res) {
    const { book_id } = req.params;

    try {
        const notesResult = await Note.GetNotesByBookId(book_id);
        if (!notesResult) {
            await Log.createLog(`An error occured getting notes for book_id: ${book_id}`, "Note", "note_controller.js", "Y");
            return res.status(400).json({ message: "An error occured getting note" });
        }
        await Log.createLog(`Notes fetched successfully for book_id: ${book_id}`, "Note", "note_controller.js", "N");
        return res.json({ notesResult });
    } catch (error) {
        console.log("An error occured getting notes: ", error);
        await Log.createLog(`An error occured getting notes, error: ${error.message}`, "Note", "note_controller.js", "Y");
    }
}

async function UpdateNote(req, res) {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: "Invalid token." });
        }

        const tokenValid = await checkTokenValidity(token);
        if (!tokenValid) {
            return res.status(400).json({ message: "Invalid token." });
        }

        const { note } = req.body;

        let user_id;
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            user_id = decodedToken.user.user_id;
        } catch (error) {
            return res.status(400).json({ message: 'Invalid token.' });
        }

        if (note.publisher_id != user_id) {
            return res.status(401).json({ message: 'Unauthorizated token.' });
        }

        const noteResult = await Note.UpdateNoteByNoteId(note);

        if (!noteResult) {
            await Log.createLog(`An error occured updating note by note_id: ${note.note_id}`, "Note", "note_controller.js", "Y");
            return res.status(400).json({ message: "An error occured updating book" });
        }

        await Log.createLog(`Note updated successfully by note_id: ${note.note_id}`, "Note", "note_controller.js", "N");
        return res.json({ noteResult });
    } catch (error) {
        console.log("An error occured updating note by note id: ", error);
        await Log.createLog(`An error occured updating note by note_id, error: ${error.message}`, "Note", "note_controller.js", "Y");
    }
}

async function DeleteNote(req, res) {
    const note_id = parseInt(req.params.note_id, 10);
    const publisher_id = parseInt(req.params.publisher_id, 10);

    if (isNaN(note_id)) {
        return res.status(400).json({ message: "Invalid book ID" });
    }

    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const tokenValid = await checkTokenValidity(token);
    if (!tokenValid) {
        return res.status(400).json({ message: "Invalid token." });
    }

    let user_id;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }

    if (publisher_id != user_id) {
        return res.status(401).json({ message: 'Unauthorizated token.' });
    }

    try {
        const noteDeleteResult = await Note.DeleteNoteByNoteId(note_id);

        if (!noteDeleteResult) {
            await Log.createLog(`An error occured deleting note by note_id: ${note_id}`, "Note", "note_controller.js", "Y");
            return res.status(400).json({ message: "An error occured deleting note" });
        }

        await Log.createLog(`Note deleted successfully by note_id: ${note_id}`, "Note", "note_controller.js", "N");
        return res.json({ message: "Note deleted successfully." });
    } catch (error) {
        console.log("An error occured deleting books: ", error);
        await Log.createLog(`An error occured deleting note by note_id, error: ${error.message}`, "Note", "note_controller.js", "Y");
    }
}

module.exports = { CreateNote, GetNotes, UpdateNote, DeleteNote };