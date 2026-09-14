import { useState } from "react";

export function ComicFiltersSidebar({
  editions,
  organizations,
  compendium,
  peoples,
  onApply,
}) {
  const formatOptions = Array.from(
    new Set(
      (editions ?? []).flatMap((e) => [e.format, e.printType]).filter(Boolean),
    ),
  ).sort();

  const languageOptions = Array.from(
    new Set((editions ?? []).map((e) => e.language).filter(Boolean)),
  ).sort();

  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedPublisherIDs, setSelectedPublisherIDs] = useState([]);
  const [selectedCompendiumIDs, setSelectedCompendiumIDs] = useState([]);
  const [language, setLanguage] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [bookNumberQuery, setBookNumberQuery] = useState("");
  const [personSearch, setPersonSearch] = useState("");
  const [selectedPersonIDs, setSelectedPersonIDs] = useState([]);

  function toggleInList(value, list, setList) {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  const personMatches =
    personSearch.trim().length >= 2
      ? (peoples ?? []).filter((p) =>
          p.name?.toLowerCase().includes(personSearch.trim().toLowerCase()),
        )
      : [];

  const selectedPeople = (peoples ?? []).filter((p) =>
    selectedPersonIDs.includes(p.id),
  );

  function handleApply() {
    onApply({
      formats: selectedFormats,
      publisherIDs: selectedPublisherIDs,
      compendiumIDs: selectedCompendiumIDs,
      language: language || null,
      yearFrom: yearFrom !== "" ? Number(yearFrom) : null,
      yearTo: yearTo !== "" ? Number(yearTo) : null,
      bookNumberQuery: bookNumberQuery.trim().toLowerCase(),
      personIDs: selectedPersonIDs,
    });
  }

  function handleClear() {
    setSelectedFormats([]);
    setSelectedPublisherIDs([]);
    setSelectedCompendiumIDs([]);
    setLanguage("");
    setYearFrom("");
    setYearTo("");
    setBookNumberQuery("");
    setPersonSearch("");
    setSelectedPersonIDs([]);
    onApply(null);
  }

  const sectionStyle = { borderTop: "1px solid #333", padding: "0.6rem 0" };
  const labelStyle = {
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: "#d4a520",
    marginBottom: "0.4rem",
    display: "block",
  };
  const inputStyle = {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "6px",
    color: "#fff",
    padding: "0.3rem 0.5rem",
    fontSize: "0.8rem",
    outline: "none",
  };
  const checkboxLabelStyle = {
    fontSize: "0.8rem",
    color: "#ccc",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  };

  return (
    <div
      style={{
        width: "220px",
        flexShrink: 0,
        background: "#111",
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "1rem",
        alignSelf: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: "bold", color: "#fff" }}>Filters</span>
        <span
          onClick={handleClear}
          style={{ fontSize: "0.75rem", color: "#d4a520", cursor: "pointer" }}
        >
          Clear all
        </span>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Format / Print type</span>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
        >
          {formatOptions.map((f) => (
            <label key={f} style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={selectedFormats.includes(f)}
                onChange={() =>
                  toggleInList(f, selectedFormats, setSelectedFormats)
                }
              />
              {f}
            </label>
          ))}
          {formatOptions.length === 0 && (
            <span style={{ fontSize: "0.75rem", color: "#555" }}>None yet</span>
          )}
        </div>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Publisher</span>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
        >
          {(organizations ?? []).map((o) => (
            <label key={o.id} style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={selectedPublisherIDs.includes(o.id)}
                onChange={() =>
                  toggleInList(
                    o.id,
                    selectedPublisherIDs,
                    setSelectedPublisherIDs,
                  )
                }
              />
              {o.name}
            </label>
          ))}
          {(organizations ?? []).length === 0 && (
            <span style={{ fontSize: "0.75rem", color: "#555" }}>None yet</span>
          )}
        </div>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Language</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={inputStyle}
        >
          <option value="">Any language</option>
          {languageOptions.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Print year</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <input
            type="number"
            placeholder="From"
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="To"
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Book number</span>
        <input
          type="text"
          placeholder='e.g. "12" or "1a"'
          value={bookNumberQuery}
          onChange={(e) => setBookNumberQuery(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Collection</span>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
        >
          {(compendium ?? []).map((c) => (
            <label key={c.id} style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={selectedCompendiumIDs.includes(c.id)}
                onChange={() =>
                  toggleInList(
                    c.id,
                    selectedCompendiumIDs,
                    setSelectedCompendiumIDs,
                  )
                }
              />
              {c.title}
            </label>
          ))}
          {(compendium ?? []).length === 0 && (
            <span style={{ fontSize: "0.75rem", color: "#555" }}>None yet</span>
          )}
        </div>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Person</span>
        <input
          type="text"
          placeholder="Search contributor..."
          value={personSearch}
          onChange={(e) => setPersonSearch(e.target.value)}
          style={inputStyle}
        />

        {personMatches.length > 0 && (
          <div
            style={{
              marginTop: "0.4rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            {personMatches.slice(0, 6).map((p) => (
              <label key={p.id} style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={selectedPersonIDs.includes(p.id)}
                  onChange={() =>
                    toggleInList(p.id, selectedPersonIDs, setSelectedPersonIDs)
                  }
                />
                {p.name}
              </label>
            ))}
          </div>
        )}

        {selectedPeople.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.3rem",
              marginTop: "0.5rem",
            }}
          >
            {selectedPeople.map((p) => (
              <span
                key={p.id}
                onClick={() =>
                  toggleInList(p.id, selectedPersonIDs, setSelectedPersonIDs)
                }
                style={{
                  background: "#1a1500",
                  color: "#d4a520",
                  fontSize: "0.7rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  cursor: "pointer",
                  border: "1px solid #d4a520",
                }}
              >
                {p.name} ✕
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleApply}
        style={{
          marginTop: "0.75rem",
          width: "100%",
          background: "none",
          border: "1px solid #d4a520",
          color: "#d4a520",
          borderRadius: "6px",
          padding: "0.4rem",
          fontSize: "0.85rem",
          cursor: "pointer",
        }}
      >
        Apply filters
      </button>
    </div>
  );
}
