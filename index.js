import path, { dirname } from "path";
import { fileURLToPath } from "url";

import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import dotenvConfig from "./util/dotenvConfig.js";
import { db, sessionPool } from "./util/dbConnect.js";
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

app.use(bodyParser.urlencoded({ extended: false }));
const pgSession = connectPgSimple(session);
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    store: new pgSession({
      pool: sessionPool,
      tableName: "sessions",
      createTableIfMissing: true,
    }),
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

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
