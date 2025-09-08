import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";
const router = express.Router();

//get all notes
router.get("/", getNotes);

//create new note
router.post("/", createNote);

//update
router.put("/:id", updateNote);

//delete
router.delete("/:id", deleteNote);

export default router;
