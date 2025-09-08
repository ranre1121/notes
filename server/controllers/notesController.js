let notes = [];

//get all notes
//GET /api/notes
const getNotes = (req, res) => {
  const limit = parseInt(req.query.limit);

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
  );

  if (!isNaN(limit) && limit > 0) {
    return res.status(200).json(sortedNotes.slice(0, limit));
  }

  res.json(sortedNotes);
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

// PUT /api/notes/:id
const updateNote = (req, res, next) => {
  const id = parseInt(req.params.id);
  const note = notes.find((note) => note.id === id);

  if (!note) {
    const error = new Error(`A note with the id of ${id} was not found`);
    error.status = 404;
    return next(error);
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
