const express = require("express");
const router = express.Router();

const noteController = require("../controllers/note_controller");

router.use(express.json());

router.post("/create", noteController.CreateNote);
router.get("/note/:note_id", noteController.GetNotes);
router.put("/note", noteController.UpdateNote);
router.delete("/note/:note_id/:publisher_id", noteController.DeleteNote);

module.exports = router;
