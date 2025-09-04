import { useRef, useEffect, useState } from "react";

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

const Note = ({ note }) => {
  const textareaRef = useRef(null);
  const [color] = useState(randomColor());
  const [textContent, setTextContent] = useState(note.text);

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  const handleChange = async (e) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textContent }),
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
      className={`group flex items-center justify-center size-[250px] rounded-xl px-3 py-3 ${color}`}
    >
      <textarea
        className="w-full h-full resize-none appearance-none focus:outline-0"
        ref={textareaRef}
        onChange={(e) => {
          setTextContent(e.target.value);
          handleChange(e);
        }}
        value={textContent}
      />
    </div>
  );
};

export default Note;
