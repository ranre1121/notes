import { useState, useEffect } from "react";
import CreateNote from "./components/CreateNote";
import Note from "./components/Note";
import { Funnel } from "lucide-react";
import { Check } from "lucide-react";

const sortingOptions = [
  {
    value: "newest",
    id: "newest",
    html: "newest",
    label: "Newest First",
  },
  {
    value: "oldest",
    id: "oldest",
    html: "oldest",
    label: "Oldest First",
  },
];

const App = () => {
  const [notes, setNotes] = useState([]);
  const [focusLatest, setFocusLatest] = useState(false);
  const [showSorting, setShowSorting] = useState(false);
  const [selectedSortingOption, setSelectedSortingOption] = useState("newest");

  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/notes");
      const json = await res.json();
      setNotes(json);
    } catch (error) {
      console.log(error);
    }
  };

  const sortNotes = () => {
    setFocusLatest(false);
    const sorted = [...notes].sort((a, b) =>
      selectedSortingOption === "newest"
        ? new Date(b.lastModified) - new Date(a.lastModified)
        : new Date(a.lastModified) - new Date(b.lastModified)
    );
    setNotes(sorted);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (selectedSortingOption) {
      sortNotes();
    }
  }, [selectedSortingOption]);

  return (
    <div
      className="flex flex-col py-[50px] px-[100px] gap-5 h-screen z-10 mb-10"
      onClick={() => {
        showSorting && setShowSorting(false);
      }}
    >
      <div className="flex gap-3 items-center">
        <h1 className="text-4xl font-semibold bg-gradient-to-r  from-yellow-200 to-yellow-300 w-fit px-1">
          Notes
        </h1>
        <div className="relative w-full ">
          <div
            className={`${
              showSorting && "bg-gray-100 border-gray-300"
            } w-fit p-2 rounded-md`}
          >
            <Funnel
              onClick={() => {
                setShowSorting((prev) => !prev);
              }}
              className="cursor-pointer"
            />
          </div>
          {showSorting && (
            <div
              className="absolute top-full left-0 mt-2 flex flex-col border border-gray-200 bg-white shadow-2xl py-2 rounded-md z-20"
              onClick={(e) => e.stopPropagation()}
            >
              {sortingOptions.map((option) => (
                <label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-blue-100 duration-200 ${
                    selectedSortingOption === option.value
                      ? "text-blue-700"
                      : "text-black"
                  }`}
                >
                  <input
                    type="radio"
                    id={option.value}
                    name="sorting"
                    value={option.value}
                    checked={selectedSortingOption === option.value}
                    onChange={(e) => setSelectedSortingOption(e.target.value)}
                    className="hidden"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-5 flex-wrap ">
        {notes.map((note) => (
          <Note
            note={note}
            key={note.id}
            fetchNotes={fetchNotes}
            setNotes={setNotes}
            notes={notes}
            focusLatest={focusLatest}
          />
        ))}
        <div onClick={() => setSelectedSortingOption(null)}>
          <CreateNote
            fetchNotes={fetchNotes}
            setNotes={setNotes}
            setFocusLatest={setFocusLatest}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
