import "reflect-metadata";
import express, { Application, urlencoded, json } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import "./presentation/containers"; // Import repository container
import "./config/passportConfig"; // Ensure this is imported to configure passport
import passport from "passport";
import session from "express-session";

import routes from "./presentation/routes";
import errorHandler from "./presentation/middlewares/handlers/error.handler";
const app: Application = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
// Middleware
app.use(helmet());          
app.use(cors(corsOptions));
app.use(json({ limit: "5mb" }));
app.use(urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use(routes);

//error handler middlware
app.use(errorHandler);

export default app;
