import { useRef, useEffect } from "react";

const NewNote = ({ notes }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current.focus();
  }, [notes]);

  return (
    <div className="group flex items-center justify-center size-[250px] bg-yellow-100 rounded-xl px-3 py-3">
      <textarea
        className="w-full h-full resize-none appearance-none focus:outline-0"
        ref={textareaRef}
      />
    </div>
  );
};

export default NewNote;
