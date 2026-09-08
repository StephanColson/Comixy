import { useState, useRef, useEffect } from "react";

import {
  COMIC_CATALOG,
  COMIC_EDITIONS,
  NAV_SERIE_CATALOG,
  NAV_PERSON,
  NAV_PUBLISHER,
  NAV_COLLECTION,
} from "../App.jsx";

const MAX_PER_CATEGORY = 2;

export function GlobalSearch({
  navigateTo,
  setSelectedComicID,
  setSelectedSerieID,
  setSelectedUniverseID,
  setSelectedPersonID,
  setSelectedPublisherID,
  setSelectedCompendiumID,
  comics,
  series,
  universes,
  peoples,
  organizations,
  compendium,
}) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = submittedQuery.trim().toLowerCase();
  const hasQuery = q.length >= 2;

  function matches(text) {
    return !!text?.toLowerCase().includes(q);
  }

  function runSearch() {
    setSubmittedQuery(query);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setQuery("");
    setSubmittedQuery(""); // add
  }

  const comicResults = hasQuery
    ? (comics ?? []).filter((c) => matches(c.title)).slice(0, MAX_PER_CATEGORY)
    : [];
  const serieResults = hasQuery
    ? (series ?? []).filter((s) => matches(s.title)).slice(0, MAX_PER_CATEGORY)
    : [];
  const universeResults = hasQuery
    ? (universes ?? [])
        .filter((u) => matches(u.title))
        .slice(0, MAX_PER_CATEGORY)
    : [];
  const peopleResults = hasQuery
    ? (peoples ?? [])
        .filter((p) => matches(p.name) || p.alias?.some((a) => matches(a)))
        .slice(0, MAX_PER_CATEGORY)
    : [];
  const publisherResults = hasQuery
    ? (organizations ?? [])
        .filter((o) => matches(o.name))
        .slice(0, MAX_PER_CATEGORY)
    : [];
  const compendiumResults = hasQuery
    ? (compendium ?? [])
        .filter((c) => matches(c.title))
        .slice(0, MAX_PER_CATEGORY)
    : [];

  const totalResults =
    comicResults.length +
    serieResults.length +
    universeResults.length +
    peopleResults.length +
    publisherResults.length +
    compendiumResults.length;

  function goToComic(comic) {
    setSelectedComicID(comic.id);
    navigateTo(COMIC_EDITIONS);
    close();
  }
  function goToSerie(serie) {
    setSelectedSerieID(serie.id);
    navigateTo(COMIC_CATALOG);
    close();
  }
  function goToUniverse(universe) {
    setSelectedUniverseID(universe.id);
    navigateTo(NAV_SERIE_CATALOG);
    close();
  }
  function goToPerson(person) {
    setSelectedPersonID(person.id);
    navigateTo(NAV_PERSON);
    close();
  }
  function goToPublisher(publisher) {
    setSelectedPublisherID(publisher.id);
    navigateTo(NAV_PUBLISHER);
    close();
  }
  function goToCompendium(comp) {
    setSelectedCompendiumID(comp.id);
    navigateTo(NAV_COLLECTION);
    close();
  }

  return (
    <div style={{ display: "flex", gap: "0.4rem" }}>
      <input
        type="text"
        placeholder="Search everything..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") runSearch();
        }}
        style={{
          width: "100%",
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "6px",
          color: "#fff",
          padding: "0.4rem 0.75rem",
          fontSize: "0.85rem",
          outline: "none",
        }}
      />

      <button
        onClick={runSearch}
        style={{
          background: "none",
          border: "1px solid #d4a520",
          color: "#d4a520",
          borderRadius: "6px",
          padding: "0.4rem 0.75rem",
          fontSize: "0.85rem",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        Search
      </button>

      {isOpen && hasQuery && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.25rem)",
            left: 0,
            right: 0,
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "8px",
            maxHeight: "25rem",
            overflowY: "auto",
            zIndex: 2000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          {totalResults === 0 ? (
            <p style={{ color: "#555", padding: "0.75rem", margin: 0 }}>
              No results for "{query}"
            </p>
          ) : (
            <>
              <ResultGroup
                label="Comics"
                items={comicResults}
                onSelect={goToComic}
                getLabel={(c) => c.title}
              />
              <ResultGroup
                label="Series"
                items={serieResults}
                onSelect={goToSerie}
                getLabel={(s) => s.title}
              />
              <ResultGroup
                label="Universes"
                items={universeResults}
                onSelect={goToUniverse}
                getLabel={(u) => u.title}
              />
              <ResultGroup
                label="People"
                items={peopleResults}
                onSelect={goToPerson}
                getLabel={(p) => p.name}
              />
              <ResultGroup
                label="Publishers"
                items={publisherResults}
                onSelect={goToPublisher}
                getLabel={(o) => o.name}
              />
              <ResultGroup
                label="Collections"
                items={compendiumResults}
                onSelect={goToCompendium}
                getLabel={(c) => c.title}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResultGroup({ label, items, onSelect, getLabel }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p
        style={{
          color: "#888",
          textTransform: "uppercase",
          fontSize: "0.7rem",
          letterSpacing: "0.05em",
          padding: "0.5rem 0.75rem 0.25rem",
          margin: 0,
        }}
      >
        {label}
      </p>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item)}
          style={{
            padding: "0.4rem 0.75rem",
            fontSize: "0.85rem",
            color: "#fff",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          {getLabel(item)}
        </div>
      ))}
    </div>
  );
}
