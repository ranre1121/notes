import { useRef, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Expand } from "lucide-react";
import { motion } from "motion/react";
import { Shrink } from "lucide-react";

const Note = ({ note, isNew, notes, setNotes }) => {
  const textareaRef = useRef(null);
  const divRef = useRef(null);
  const [textContent, setTextContent] = useState(note.text);
  const [lastModified, setLastModified] = useState(note.lastModified);
  const [isExpanded, setIsExpanded] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const [distances, setDistances] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const handleExpand = () => {
    setZIndex(100); // bring to front immediately
    setIsExpanded(true);
  };

  const handleShrink = () => {
    setIsExpanded(false);
    // wait until animation finishes before lowering zIndex
    setTimeout(() => setZIndex(1), 500); // 500ms = your transition duration
  };

  const measure = () => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setDistances({
        top: rect.top,
        left: rect.left,
        right: window.innerWidth - rect.right,
        bottom: window.innerHeight - rect.bottom,
      });
    }
  };

  useEffect(() => {
    const handleUpdate = () => measure();

    measure(); // initial

    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate);

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate);
    };
  }, [notes]);

  {
    /** 
      TODO
      -color modification
      */
  }

  const position = () => {
    if (distances.right < 350 && distances.bottom < 350) {
      return "right-0 bottom-0";
    } else if (distances.bottom < 350) {
      return "bottom-0 left-0";
    } else if (distances.right < 350) {
      return "top-0 right-0";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const isSameDay =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
    const pad = (n) => String(n).padStart(2, "0");
    if (isSameDay) {
      return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } else {
      return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;
    }
  };

  useEffect(() => {
    if (isNew) {
      textareaRef.current.focus();
    }
  }, []);

  //PUT
  const handleChange = async (newText) => {
    try {
      const res = await fetch(`http://localhost:8000/api/notes/${note.id}`, {
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
      const res = await fetch(`http://localhost:8000/api/notes/${note.id}`, {
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
    <div className="size-[250px] relative">
      <motion.div
        ref={divRef}
        className={`group cursor-pointer border ${position()} flex absolute size-[250px] rounded-xl py-2 px-2 ${
          note.color
        }`}
        animate={{
          width: isExpanded ? "600px" : "250px",
          height: isExpanded ? "600px" : "250px",
          zIndex,
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full">
          <p className="font-bold">Title</p>
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
        </div>
        <div className="absolute top-2 right-2 gap-1.5 flex items-center text-gray-400">
          {isExpanded ? (
            <Shrink
              onClick={handleShrink}
              className="hover:text-blue-400 size-4"
            />
          ) : (
            <Expand
              className="hover:text-blue-400 size-4"
              onClick={handleExpand}
            />
          )}

          <Trash2
            className="hover:text-red-500 size-4"
            onClick={handleDelete}
          />
        </div>
        <p className="absolute bottom-1.5 left-1.5 text-xs text-gray-400">
          {formatDate(lastModified)}
        </p>
      </motion.div>
    </div>
  );
};

export default Note;
