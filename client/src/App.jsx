import { useState, useEffect } from "react";
import CreateNote from "./components/CreateNote";
import NewNote from "./components/NewNote";

const App = () => {
  const [notes, setNotes] = useState([]);

  return (
    <div className="flex flex-col py-[50px] px-[100px] gap-10">
      <h1 className="text-4xl font-semibold">Notes</h1>
      <div className="flex gap-10 flex-wrap">
        {notes.map((note, index) => (
          <div key={index}>{note}</div>
        ))}
        <CreateNote setNotes={setNotes} notes={notes} />
      </div>
    </div>
  );
};

export default App;
