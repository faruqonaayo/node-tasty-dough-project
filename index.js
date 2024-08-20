import express from "express";
import bodyParser from "body-parser";

import dotenvConfig from "./util/dotenvConfig.js";
import db from "./util/dbConnect.js";
import adminRoutes from "./routes/admin.js";

const app = express();

dotenvConfig;
const PORT = process.env.PORT || 3000;
db.connect(() => {
  console.log("Server is connected to database");
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/admin", adminRoutes);

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
});
