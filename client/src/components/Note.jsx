import { useRef, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
const Note = ({ note, isNew, fetchNotes }) => {
  const textareaRef = useRef(null);
  const [textContent, setTextContent] = useState(note.text);

  useEffect(() => {
    if (isNew) {
      textareaRef.current.focus();
    }
  }, []);

  const handleChange = async (newText) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });

      if (!res.ok) {
        throw new Error("Failed to add post");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${note.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Could not delete");
      }
    } catch (error) {
      console.log(error);
    }
    fetchNotes();
  };

  return (
    <div
      className={`group cursor-pointer relative flex items-center justify-center size-[250px] rounded-xl px-4.5 py-4.5 ${note.color}`}
    >
      <textarea
        className="w-full h-full resize-none appearance-none cursor-pointer focus:outline-0"
        ref={textareaRef}
        onChange={(e) => {
          const newText = e.target.value;
          setTextContent(e.target.value);
          handleChange(newText);
        }}
        value={textContent}
      />
      <Trash2
        className="absolute top-2 right-2 size-4 text-gray-400 hover:text-red-500"
        onClick={handleDelete}
      />
    </div>
  );
};

export default Note;
