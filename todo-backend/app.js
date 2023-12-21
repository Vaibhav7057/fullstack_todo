import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import bodyParser from "body-parser";
import flash from "connect-flash";
import handleError from "./middlewares/error.js";

const app = express();

app.set("view engine", "ejs");
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: "klfasv$2g598fasj*@jdfh",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use(cookieParser()); //"klfasv$2g598fasj*@jdfh"
app.use(flash());

import userRouter from "./routes/user.routes.js";
import todosRouter from "./routes/todos.routes.js";

app.use("/api/user", userRouter);
app.use("/api/todos", todosRouter);

app.use(handleError);
export default app;
