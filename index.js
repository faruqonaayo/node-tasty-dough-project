import path, { dirname } from "path";
import { fileURLToPath } from "url";

import express from "express";
import bodyParser from "body-parser";

import dotenvConfig from "./util/dotenvConfig.js";
import db from "./util/dbConnect.js";
import adminRoutes from "./routes/admin.js";
import errorRoutes from "./routes/error.js";
import generalRoutes from "./routes/general.js";

const app = express();

dotenvConfig;
const PORT = process.env.PORT || 3000;
db.connect(() => {
  console.log("Server is connected to database");
});

app.set("view engine", "ejs");
app.set("views", "views");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(dirname(__filename));

app.use(express.static(path.resolve(__dirname, "public")));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

app.use("/admin", adminRoutes);
app.use(generalRoutes);
app.use(errorRoutes);

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
});
