let notes = [];

//get all notes
//GET /api/notes
const getNotes = (req, res) => {
  const limit = parseInt(req.query.limit);
  if (!isNaN(limit) && limit > 0) {
    return res.status(200).json(notes.slice(0, limit));
  }
  res.json(notes);
};

//create a note
//POST /api/notes
const createNote = (req, res) => {
  const note = {
    id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1,
    text: "",
    title: "",
    color: req.body.color || "bg-yellow-100 text-yellow-800",
    lastModified: new Date().toISOString(),
  };
  notes.push(note);
  res.status(201).json(note);
};

//change a note
//PUT /api/notes/:id
const updateNote = (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find((note) => note.id === id);

  if (!note) {
    const error = new Error(`A note with the id of ${id} was not found`);
    error.status = 404;
    return next(error);
  }
  note.lastModified = new Date().toISOString();
  note.title = req.body.title;
  note.text = req.body.text;
  res.status(200).json(note);
};

//delete a note
//DELETE /api/notes/:id
const deleteNote = (req, res, next) => {
  const id = parseInt(req.params.id);
  const note = notes.find((note) => note.id === id);
  if (!note) {
    const error = new Error(`A note with the id of ${id} was not found`);
    error.status = 404;
    return next(error);
  }

  notes = notes.filter((note) => note.id !== id);
  res.status(202).json(note);
};

export { getNotes, createNote, updateNote, deleteNote };
