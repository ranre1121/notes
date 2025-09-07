import { useState, useEffect } from "react";
import CreateNote from "./components/CreateNote";
import Note from "./components/Note";
import { Funnel } from "lucide-react";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [latestNoteId, setLatestNoteId] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/notes");
      const json = await res.json();
      setNotes(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="flex flex-col py-[50px] px-[100px] gap-5">
      <h1 className="text-4xl font-semibold ">Notes</h1>
      <div className="flex gap-5 items-center ">
        <Funnel className="mt-1" />
      </div>
      <div className="flex gap-5 flex-wrap ">
        {notes.map((note) => (
          <Note
            note={note}
            key={note.id}
            isNew={note.id === latestNoteId}
            fetchNotes={fetchNotes}
            setNotes={setNotes}
            notes={notes}
          />
        ))}
        <CreateNote
          fetchNotes={fetchNotes}
          setLatestNoteId={setLatestNoteId}
          setNotes={setNotes}
        />
      </div>
    </div>
  );
};

export default App;
