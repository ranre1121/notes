import { useRef, useEffect } from "react";

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

const NewNote = ({ notes }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current.focus();
  }, [notes]);

  return (
    <div
      className={`group flex items-center justify-center size-[250px] rounded-xl px-3 py-3 ${randomColor()}`}
    >
      <textarea
        className="w-full h-full resize-none appearance-none focus:outline-0"
        ref={textareaRef}
      />
    </div>
  );
};

export default NewNote;
