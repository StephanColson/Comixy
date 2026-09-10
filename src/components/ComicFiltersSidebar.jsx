import { useState } from "react";

export function ComicFiltersSidebar({ editions, organizations, onApply }) {
  const formatOptions = Array.from(
    new Set(
      (editions ?? []).flatMap((e) => [e.format, e.printType]).filter(Boolean),
    ),
  ).sort();

  const languageOptions = Array.from(
    new Set((editions ?? []).map((e) => e.language).filter(Boolean)),
  ).sort();

  const [selectedFormats, setSelectedFormats] = useState([]);
  const [publisherID, setPublisherID] = useState("");
  const [language, setLanguage] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [bookNumberQuery, setBookNumberQuery] = useState("");
  const [spineQuery, setSpineQuery] = useState("");
  const [personQuery, setPersonQuery] = useState("");

  function toggleFormat(value) {
    setSelectedFormats((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function handleApply() {
    onApply({
      formats: selectedFormats,
      publisherID: publisherID || null,
      language: language || null,
      yearFrom: yearFrom !== "" ? Number(yearFrom) : null,
      yearTo: yearTo !== "" ? Number(yearTo) : null,
      bookNumberQuery: bookNumberQuery.trim().toLowerCase(),
      spineQuery: spineQuery.trim().toLowerCase(),
      personQuery: personQuery.trim().toLowerCase(),
    });
  }

  function handleClear() {
    setSelectedFormats([]);
    setPublisherID("");
    setLanguage("");
    setYearFrom("");
    setYearTo("");
    setBookNumberQuery("");
    setSpineQuery("");
    setPersonQuery("");
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
            <label
              key={f}
              style={{
                fontSize: "0.8rem",
                color: "#ccc",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <input
                type="checkbox"
                checked={selectedFormats.includes(f)}
                onChange={() => toggleFormat(f)}
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
        <select
          value={publisherID}
          onChange={(e) => setPublisherID(e.target.value)}
          style={inputStyle}
        >
          <option value="">Any publisher</option>
          {(organizations ?? []).map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
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
        <span style={labelStyle}>Spine</span>
        <input
          type="text"
          placeholder="Spine text contains..."
          value={spineQuery}
          onChange={(e) => setSpineQuery(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Person</span>
        <input
          type="text"
          placeholder="Contributor name..."
          value={personQuery}
          onChange={(e) => setPersonQuery(e.target.value)}
          style={inputStyle}
        />
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
