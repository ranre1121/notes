import express from "express";
import cors from "cors";
import logger from "./middleware/logger.js";
import notes from "./routes/authNotes.js";
import auth from "./routes/authRoutes.js";

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Logger middleware
app.use(logger);

//notes route
app.use("/api/notes", notes);

//auth route
app.use("/api/auth", auth);

app.listen(port, () => console.log(`Server running on port ${port}`));
