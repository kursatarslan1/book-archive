const express = require("express");
const app = express();
const port = 3000;

const userRoutes = require("./routes/user_routes");

app.use(express.json());

app.use("/bookarchive/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
