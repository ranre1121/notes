import { useRef, useEffect, useState } from "react";

const Note = ({ note }) => {
  const textareaRef = useRef(null);
  const [textContent, setTextContent] = useState(note.text);

  useEffect(() => {
    textareaRef.current.focus();
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

  return (
    <div
      className={`group flex items-center justify-center size-[250px] rounded-xl px-3 py-3 ${note.color}`}
    >
      <textarea
        className="w-full h-full resize-none appearance-none focus:outline-0"
        ref={textareaRef}
        onChange={(e) => {
          const newText = e.target.value;
          setTextContent(e.target.value);
          handleChange(newText);
        }}
        value={textContent}
      />
    </div>
  );
};

export default Note;
