import { Plus } from "lucide-react";
import { useState } from "react";

const noteColors = [
  "bg-yellow-100 text-yellow-800",
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-pink-100 text-pink-800",
  "bg-purple-100 text-purple-800",
  "bg-gray-100 text-gray-800",
];

const randomColor = () => {
  return noteColors[Math.floor(Math.random() * noteColors.length)];
};

const CreateNote = ({ fetchNotes, setLatestNoteId }) => {
  async function handleClick() {
    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color: randomColor() }),
      });

      if (!res.ok) throw new Error("Failed to add note");

      const newNote = await res.json();
      setLatestNoteId(newNote.id);

      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="group flex items-center justify-center size-[250px] border rounded-xl border-dashed border-gray-300 hover:border-cyan-600 duration-200 cursor-pointer"
      onClick={() => handleClick()}
    >
      <Plus className="text-gray-300 size-[50px] group-hover:text-cyan-600 duration-200" />
    </div>
  );
};

export default CreateNote;
