import { Plus } from "lucide-react";
import Note from "./Note";

const CreateNote = ({ fetchNotes }) => {
  async function handleClick() {
    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to add note");

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
