import { Plus } from "lucide-react";
import NewNote from "./NewNote";

const CreateNote = ({ setNotes, notes }) => {
  return (
    <div
      className="group flex items-center justify-center size-[250px] border rounded-xl border-dashed border-gray-300 hover:border-cyan-600 duration-200 cursor-pointer"
      onClick={() => setNotes((prev) => [...prev, <NewNote notes={notes} />])}
    >
      <Plus className="text-gray-300 size-[50px] group-hover:text-cyan-600 duration-200" />
    </div>
  );
};

export default CreateNote;
