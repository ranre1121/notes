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
    id: notes.length + 1,
    text: "",
  };
  notes.push(note);
  res.status(201).json(notes);
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

  note.text = req.body.text;
  res.status(200).json(notes);
};

export { getNotes, createNote, updateNote };
