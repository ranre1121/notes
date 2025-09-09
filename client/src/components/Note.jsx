import { useRef, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Expand } from "lucide-react";
import { motion } from "motion/react";
import { Shrink } from "lucide-react";
import { Pipette } from "lucide-react";

{
  /** 
  TODO:
  -search
  -backend save
  -authorization
  
   */
}

const colors = {
  "bg-yellow-100": [
    "bg-yellow-500",
    "bg-yellow-100 text-yellow-800 border-yellow-500 border placeholder:text-yellow-800",
  ],
  "bg-blue-100": [
    "bg-blue-500",
    "bg-blue-100 text-blue-800 border-blue-500 border placeholder:text-blue-800",
  ],
  "bg-green-100": [
    "bg-green-500",
    "bg-green-100 text-green-800 border-green-500 border placeholder:text-green-800",
  ],
  "bg-pink-100": [
    "bg-pink-500",
    "bg-pink-100 text-pink-800 border-pink-500 border placeholder:text-pink-800",
  ],
  "bg-purple-100": [
    "bg-purple-500",
    "bg-purple-100 text-purple-800 border-purple-500 border placeholder:text-purple-800",
  ],
  "bg-gray-100": [
    "bg-gray-500",
    "bg-gray-100 text-gray-800 border-gray-500 placeholder:text-gray-800",
  ],
};

const Note = ({ note, setNotes, focusLatest }) => {
  const textAreaRef = useRef(null);
  const divRef = useRef(null);
  const titleRef = useRef(null);
  const [textAreaContent, setTextAreaContent] = useState(note.text);
  const [titleContent, setTitleContent] = useState(note.title);
  const [lastModified, setLastModified] = useState(note.lastModified);
  const [noteColor, setNoteColor] = useState(note.color);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showColors, setShowColors] = useState(false);
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
  const handleChange = async ({ newTitle, newText, newColor }) => {
    try {
      const token = localStorage.getItem("token");
      const updateData = {};
      if (newTitle !== undefined) updateData.title = newTitle;
      if (newText !== undefined) updateData.text = newText;
      if (newColor !== undefined) updateData.color = newColor;

      const res = await fetch(`http://localhost:8080/api/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        throw new Error("Failed to update note");
      }

      const json = await res.json();
      setLastModified(json.lastModified);
    } catch (error) {
      console.error(error);
    }
  };

  //DELETE
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/notes/${note.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
    if (focusLatest) {
      titleRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!isExpanded) return;
    const corner = cornerSetter();
    setPosition(corner);
  }, [isExpanded]);

  return (
    <div
      className="size-[250px] relative"
      onClick={() => {
        setShowColors(false);
      }}
    >
      <motion.div
        ref={divRef}
        className={`group cursor-pointer border ${position} flex absolute size-[250px] rounded-xl py-2 px-2 ${noteColor}`}
        animate={{
          width: isExpanded ? "600px" : "250px",
          height: isExpanded ? "600px" : "250px",
          zIndex,
        }}
        transition={{ duration: 0.5 }}
      >
        <div className={`w-full`}>
          <input
            type="text"
            className={`font-bold focus:outline-0 `}
            ref={titleRef}
            placeholder="Title"
            onChange={(e) => {
              const newText = e.target.value;
              setTitleContent(e.target.value);
              handleChange({ newTitle: newText });
            }}
            value={titleContent}
          />

          <textarea
            className={`w-full h-full resize-none appearance-none cursor-pointer focus:outline-0 `}
            placeholder="Note"
            ref={textAreaRef}
            onChange={(e) => {
              const newText = e.target.value;
              setTextAreaContent(e.target.value);
              handleChange({ newText });
            }}
            value={textAreaContent}
          />
        </div>
        <div className="absolute top-2 right-2 gap-1.5 flex items-center text-gray-400">
          <div className="relative gap-3 flex flex-col items-center">
            <Pipette
              className={`size-4 hover:text-violet-500 ${
                showColors && "text-violet-500"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setShowColors(showColors ? false : true);
              }}
            />
            {showColors && (
              <div
                className="flex absolute flex-col gap-1 top-full mt-2 outline-2 outline-gray-400 bg-white p-1 rounded-md"
                onClick={(e) => {
                  e.stopPropagation;
                }}
              >
                {Object.keys(colors).map((color) => (
                  <div
                    className={`w-5 h-5 rounded-full ${colors[color][0]} relative flex items-center justify-center`}
                    onClick={() => {
                      const newColor = colors[color][1];
                      setNoteColor(newColor);
                      handleChange({ newColor });
                    }}
                  >
                    {noteColor.split(" ")[0] === color && (
                      <div
                        className={`bg-white w-2 h-2 absolute rounded-full`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
