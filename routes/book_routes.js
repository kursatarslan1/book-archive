const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book_controller");

router.use(express.json());

router.post("/create", bookController.CreateBook);
router.get("/book/:book_id", bookController.GetBook);
router.get("/books/:category", bookController.GetBooks);
router.put("/book", bookController.UpdateBook);
router.delete("/book/:book_id", bookController.DeleteBook);

module.exports = router;
