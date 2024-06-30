const { Book } = require("../models/book_model");
const jwt = require('jsonwebtoken');
const checkTokenValidity = require("../helpers/check_token_validity");
const char_limit = 100;

async function CreateBook(req, res) {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const tokenValid = await checkTokenValidity(token);
    if (!tokenValid) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const { book } = req.body;
    
    if(book.book_name.length > char_limit){
        return res.status(400).json({ message: "Book name too long... "});
    }

    let user_id;
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error){
        return res.status(400).json({ message: 'Invalid token.' });
    }

    book.publisher_id = user_id;

    try {
        let photo_url;
        try {
            photo_url = await uploadPhoto(book.book_photo[0].base64, book.book_photo[0].path);
        } catch (error) {
            photo_url =
                "https://firebasestorage.googleapis.com/v0/b/evcil-dostum-cloud.appspot.com/o/1713905613292_f7hpl1.png?alt=media&token=0babda29-cf92-4950-8614-ec4fb4cc3f1a"; // başka bir projemden default profil fotoğrafı, cloud based storage
            console.log(error);
        }

        book.book_photo = photo_url;

        const bookResult = await Book.Create(book);

        if (!bookResult) {
            return res.status(400).json({ message: 'Book create failed... ' });
        }

        return res.json({ message: "Book created successfully. ", bookResult });
    } catch (error) {
        console.log("Error creating book: ", error);
        throw error;
    }
}

async function GetBook(req, res) {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const tokenValid = await checkTokenValidity(token);
    if (!tokenValid) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const book_id = parseInt(req.params.book_id, 10);

    let user_id;
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error){
        return res.status(400).json({ message: 'Invalid token.' });
    }

    if (isNaN(book_id)) {
        return res.status(400).json({ message: "Invalid book ID" });
    }

    try {
        const bookResult = await Book.GetBookById(user_id, book_id);
        if (!bookResult) {
            return res.status(400).json({ message: "An error occured getting book" });
        }

        return res.json({ bookResult });
    } catch (error) {
        console.log("An error occured getting book: ", error);
        throw error;
    }
}

async function GetBooks(req, res) {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const tokenValid = await checkTokenValidity(token);
    if (!tokenValid) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const { category } = req.params;

    let user_id;
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error){
        return res.status(400).json({ message: 'Invalid token.' });
    }

    try {
        const booksResult = await Book.GetBookByCategory(user_id, category);
        if (!booksResult) {
            return res.status(400).json({ message: "An error occured getting books" });
        }
        return res.json({ booksResult });
    } catch (error) {
        console.log("An error occured getting books: ", error);
        throw error;
    }
}

async function UpdateBook(req, res) {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const tokenValid = await checkTokenValidity(token);
    if (!tokenValid) {
        return res.status(400).json({ message: "Invalid token." });
    }

    let user_id;
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error){
        return res.status(400).json({ message: 'Invalid token.' });
    }

    const { book } = req.body; 

    if(user_id != book.publisher_id){
        return res.status(401).json({ message: "Unauthorized token." });
    }

    try {
        const bookResult = await Book.UpdateBookById(book);

        if (!bookResult) {
            return res.status(400).json({ message: "An error occured updating book" });
        }

        return res.json({ bookResult });
    } catch (error) {
        console.log("An error occured updating book: ", error);
        throw error;
    }
}

async function DeleteBook(req, res){
    const book_id = parseInt(req.params.book_id, 10);
    
    if (isNaN(book_id)) {
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
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error){
        return res.status(400).json({ message: 'Invalid token.' });
    }
    
    const getBook = await Book.GetBookById(user_id, book_id);
    
    if(user_id != getBook.publisher_id){
        return res.status(401).json({ message: "Unauthorized token" });
    }
    
    try{
        const bookDeleteResult = await Book.DeleteBookById(book_id);

        if(!bookDeleteResult){
            return res.status(400).json({ message: "An error occured deleting book" });
        }

        return res.json({ message: "Book deleted successfully. "});
    } catch (error){
        console.log("An error occured deleting books: ", error);
        throw error;
    }
}


module.exports = { CreateBook, GetBook, GetBooks, UpdateBook, DeleteBook };