import { useRef, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Expand } from "lucide-react";
import { motion } from "motion/react";
import { Shrink } from "lucide-react";

{
  /** 
  TODO:
  -filters
  -color modification
  -backend save
  -authorization
  
   */
}

const Note = ({ note, isNew, setNotes }) => {
  const textAreaRef = useRef(null);
  const divRef = useRef(null);
  const titleRef = useRef(null);
  const [textAreaContent, setTextAreaContent] = useState(note.text);
  const [titleContent, setTitleContent] = useState(note.title);
  const [lastModified, setLastModified] = useState(note.lastModified);
  const [isExpanded, setIsExpanded] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const [position, setPosition] = useState(null);
  const [distances, setDistances] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

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

  //PUT
  const handleChange = async (newText) => {
    try {
      const res = await fetch(`http://localhost:8000/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText, title: titleContent }),
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

  useEffect(() => {
    const handleUpdate = () => measure();

    measure(); // initial

    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate);

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate);
    };
  }, []);

  {
    /** 
      TODO
      -color modification
      */
  }

  const cornerSetter = () => {
    if (distances.right < 330 && distances.bottom < 330) {
      return "right-0 bottom-0";
    } else if (distances.bottom < 330) {
      return "bottom-0 left-0";
    } else if (distances.right < 330) {
      return "top-0 right-0";
    }
  };

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  useEffect(() => {
    if (!isExpanded) return;
    const corner = cornerSetter();
    setPosition(corner);
  }, [isExpanded]);

  return (
    <div className="size-[250px] relative">
      <motion.div
        ref={divRef}
        className={`group cursor-pointer border ${position} flex absolute size-[250px] rounded-xl py-2 px-2 ${note.color}`}
        animate={{
          width: isExpanded ? "600px" : "250px",
          height: isExpanded ? "600px" : "250px",
          zIndex,
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full">
          <input
            type="text"
            className="font-bold focus:outline-0"
            ref={titleRef}
            placeholder="Title"
            onChange={(e) => {
              const newText = e.target.value;
              setTitleContent(e.target.value);
              handleChange(newText);
            }}
            value={titleContent}
          />
          <textarea
            className="w-full h-full resize-none appearance-none cursor-pointer focus:outline-0"
            placeholder="Note"
            ref={textAreaRef}
            onChange={(e) => {
              const newText = e.target.value;
              setTextAreaContent(e.target.value);
              handleChange(newText);
            }}
            value={textAreaContent}
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
