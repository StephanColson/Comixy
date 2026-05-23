import { useState } from "react";
import Pagination from "rc-pagination";
import { Universes } from "../components/Universe.jsx";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function UniversePage(props) {
  const { universes, onSelectUniverse } = props;
  const [selectedLexicon, setSelectedLexicon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const displayUniverse = 20;

  const sortedUniverses = [...universes].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const filteredUniverses = selectedLexicon
    ? sortedUniverses.filter((s) =>
        s.title.toUpperCase().startsWith(selectedLexicon),
      )
    : sortedUniverses;

  const startIndex = (currentPage - 1) * displayUniverse;
  const endIndex = startIndex + displayUniverse;
  const paginatedUniverses = filteredUniverses.slice(startIndex, endIndex);

  function handleLexiconClick(letter) {
    setSelectedLexicon((prev) => (prev === letter ? null : letter));
    setCurrentPage(1);
  }

  return (
    <>
      <h2 className="text-center">All Universes</h2>

      <div className="d-flex flex-wrap justify-content-center gap-1 my-3">
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLexiconClick(letter)}
            className={`btn btn-sm ${selectedLexicon === letter ? "btn-warning" : "btn-outline-warning"}`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div>
        <Universes
          universes={paginatedUniverses}
          onSelectUniverse={onSelectUniverse}
        />
      </div>

      <Pagination
        className="my-3"
        align="center"
        current={currentPage}
        pageSize={displayUniverse}
        total={filteredUniverses.length}
        onChange={setCurrentPage}
      />
    </>
  );
}
