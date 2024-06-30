const express = require("express");
const app = express();
const port = 3000;

const baseURL = "/bookarchive";

const userRoutes = require("./routes/user_routes");
const bookRoutes = require("./routes/book_routes");
const noteRoutes = require("./routes/note_routes");
const friendshipRoutes = require("./routes/friendship_routes");

require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.set("trust proxy", true);

app.use(express.json({ extended: true, limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(baseURL + "/users", userRoutes);
app.use(baseURL + "/books", bookRoutes);
app.use(baseURL + "/notes", noteRoutes);
app.use(baseURL + "/friendship", friendshipRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
