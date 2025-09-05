import { useRef, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
const Note = ({ note, isNew, setNotes }) => {
  const textareaRef = useRef(null);
  const [textContent, setTextContent] = useState(note.text);
  const [lastModified, setLastModified] = useState(note.lastModified);

  {
    /** 
    TODO
    -Last modified Date
    -Full screen mode
    -color modification
    */
  }

  useEffect(() => {
    if (isNew) {
      textareaRef.current.focus();
    }
  }, []);

  //PUT
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
      const json = await res.json();
      setLastModified(json.lastModified);
    } catch (error) {
      console.log(error);
    }
  };

  //DELETE
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${note.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Could not delete");
      }
      const json = await res.json();
      setNotes((prev) => prev.filter((p) => p.id !== json.id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`group cursor-pointer relative flex items-center justify-center size-[250px] rounded-xl p-5.5 ${note.color}`}
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
      <div className="absolute top-2 right-2 flex items-center text-gray-400">
        <Trash2 className="hover:text-red-500 size-4" onClick={handleDelete} />
      </div>
      <p className="absolute bottom-1.5 left-1.5 text-xs text-gray-400">
        {lastModified}
      </p>
    </div>
  );
};

export default Note;
