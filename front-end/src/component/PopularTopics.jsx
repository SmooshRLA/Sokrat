import React, { useState, useRef, useEffect } from "react";

export default function PopularTopics({ onSearch }) {
  const topics = [
    "Quantum Mechanics","Machine Learning","Cooking Basics","Psychology 101",
    "Game Development","Blockchain Technology","Graphic Design",
    "Electromagnetism","Blacksmith","Equilibrium","HTML","Animation",
    "Character Writing","Voice Acting","Mechanical Engineering","Calculus",
    "Norse Mythology","Anatomy","Philosophy","Data Analysis","Technological History",
    "Data Systems","Business","War and Peace by Leo Tolstoy","Shrek 2",
    "The Making of the Atomic Bomb by Richard Rhodes","Art","Super heroes","X-Men",
    "Arkham Asylum","Greek Mythology","Pepper Potts","Woody The Woodpecker",
    "The Great Gatsby by F. Scott Fitzgerald","Historic Battles","Trigonometry",
    "Radical Equations","Holocaust","Quantum Electrodynamics","Technology","William Shakespeare",
    "Electric Current","New Testament","Economy Systems","Optics","Finite Element Analysis (FEA)",
    "Literary Devices","Technology","Graphinh","AI","Roman Empire",
    "Derivatives","Complex Numbers","Black Holes","Albert Einstein","Comedy",
    "How to make an Indie Game","Mobile Devices","Thanksgiving","Western Fables","Thanos",
    "Astronomy","Antibiotics","Nintendo History","Computer Hardware Engineering","DC Comics",
    "Charles Dickens","Music","Uno Strategies","Nanoparticles","Nuclear and Particle Physics",
    "Food Web","Sparta","Civil War","Meteorology","Computational Physics","Solar System",
    "3D Graphing"
  ];
const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const formRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setSuggestions([]);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const filtered = topics
      .filter((t) => t.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 8);

    setSuggestions(filtered);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((idx) => Math.min(idx + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((idx) => Math.max(idx - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        submit(suggestions[activeIndex]);
      } else {
        submit(query);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  function submit(finalQuery) {
    const trimmed = (finalQuery || "").trim();
    if (!trimmed) return;
    setSuggestions([]);
    setActiveIndex(-1);
    onSearch(trimmed);
  }

  return (
    <form
      ref={formRef}
      className="search-form search-box"
      onSubmit={(e) => {
        e.preventDefault();
        submit(query);
      }}
      role="search"
    >
      <input
        className="search-input"
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search any topic..."
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `sugg-${activeIndex}` : undefined}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions" role="listbox">
          {suggestions.map((s, i) => (
            <li
              id={`sugg-${i}`}
              role="option"
              key={s + i}
              className={"suggestion-item" + (i === activeIndex ? " active" : "")}
              onMouseDown={(ev) => {
                ev.preventDefault();
                submit(s);
              }}
            >
              {(() => {
                const q = query.trim();
                const idx = s.toLowerCase().indexOf(q.toLowerCase());
                if (idx >= 0 && q !== "") {
                  return (
                    <>
                      {s.slice(0, idx)}
                      <strong>{s.slice(idx, idx + q.length)}</strong>
                      {s.slice(idx + q.length)}
                    </>
                  );
                }
                return s;
              })()}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}