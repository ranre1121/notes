import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();

//get all notes
router.get("/", protect, getNotes);

//create new note
router.post("/", protect, createNote);

//update
router.put("/:id", protect, updateNote);

//delete
router.delete("/:id", protect, deleteNote);

export default router;
