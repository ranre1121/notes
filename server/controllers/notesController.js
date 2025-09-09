import { users } from "../data/users.js"; // wherever your users array is stored

// GET /api/notes
const getNotes = (req, res) => {
  const user = users.find((u) => u.username === req.user.username);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const limit = parseInt(req.query.limit);

  const sortedNotes = [...user.notes].sort(
    (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
  );

  if (!isNaN(limit) && limit > 0) {
    return res.status(200).json(sortedNotes.slice(0, limit));
  }

  res.json(sortedNotes);
};

// POST /api/notes
const createNote = (req, res) => {
  const user = users.find((u) => u.username === req.user.username);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const note = {
    id: user.notes.length > 0 ? user.notes[user.notes.length - 1].id + 1 : 1,
    text: "",
    title: "",
    color: req.body.color || "bg-yellow-100 text-yellow-800",
    lastModified: new Date().toISOString(),
  };

  user.notes.push(note);
  res.status(201).json(note);
};

// PUT /api/notes/:id
const updateNote = (req, res) => {
  const user = users.find((u) => u.username === req.user.username);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const id = parseInt(req.params.id);
  const note = user.notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({ message: `Note with id ${id} not found` });
  }

  let contentChanged = false;

  if (req.body.title !== undefined) {
    note.title = req.body.title;
    contentChanged = true;
  }

  if (req.body.text !== undefined) {
    note.text = req.body.text;
    contentChanged = true;
  }

  if (req.body.color !== undefined) {
    note.color = req.body.color;
  }

  if (contentChanged) {
    note.lastModified = new Date().toISOString();
  }

  res.status(200).json(note);
};

// DELETE /api/notes/:id
const deleteNote = (req, res) => {
  const user = users.find((u) => u.username === req.user.username);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const id = parseInt(req.params.id);
  const note = user.notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({ message: `Note with id ${id} not found` });
  }

  user.notes = user.notes.filter((n) => n.id !== id);

  res.status(202).json(note);
};

export { getNotes, createNote, updateNote, deleteNote };
