import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import dotenvConfig from "./util/dotenvConfig.js";
import { db, sessionPool } from "./util/dbConnect.js";
import adminRoutes from "./routes/admin.js";
import errorRoutes from "./routes/error.js";
import generalRoutes from "./routes/general.js";
import authRoutes from "./routes/auth.js";
import autoDel from "./middleware/autoSessionsDelete.js";

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
const accesLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accesLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const pgSession = connectPgSimple(session);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.resolve(__dirname, "public")));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

app.use(autoDel);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use(generalRoutes);
app.use(errorRoutes);

// 500 internal server error
app.use((error, req, res, next) => {
  console.log(error.statusCode);
  console.log(error.message);
  res
    .status(error.statusCode)
    .render("error-views/500", { auth: req.isAuthenticated() });
});

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
});
