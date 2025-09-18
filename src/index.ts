import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const Port = process.env.PORT || 3000;

app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200", "http://localhost:5173"],
  })
);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.listen(Port, () => console.log(`App is listening on ${Port}...`));
