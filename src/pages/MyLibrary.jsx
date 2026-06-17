import { useEffect, useState } from "react";
import {
  GiBookshelf,
  GiBookmarklet,
  GiBookCover,
  GiHearts,
} from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import { getUserOwnedEditions } from "../api/editionInfo";
import { useEditionCollectionData } from "../api/editionInfo";
import { useComicCollectionData } from "../api/comicInfo";
import { useSerieCollectionData } from "../api/serieInfo";

export function MyLibraryPage() {
  const { currentUser } = useAuth();
  const { editions } = useEditionCollectionData();
  const { comics } = useComicCollectionData();
  const { series } = useSerieCollectionData();

  const [ownedEntries, setOwnedEntries] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    getUserOwnedEditions(currentUser.uid).then(setOwnedEntries);
  }, [currentUser]);

  // Join owned entries with edition/comic/serie data
  const ownedCards = ownedEntries
    .map((entry) => {
      const edition = editions?.find((e) => e.id === entry.editionId);
      if (!edition) return null;
      const comic = comics?.find((c) => c.id === edition.comicID);
      const serie = series?.find((s) => s.id === comic?.serieID);
      return { edition, comic, serie, entry };
    })
    .filter(Boolean);

  return (
    <>
      <div className="text-center" style={{ color: "#d4a520" }}>
        <h1>My Library</h1>
        <p style={{ color: "#888" }}>
          Personal collection of {currentUser?.displayName}
        </p>
      </div>

      {/* Stat counters */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          justifyContent: "center",
          textAlign: "center",
          margin: "2rem",
        }}
      >
        <StatBox
          icon={<GiBookshelf size={48} />}
          label="OWNED"
          value={ownedEntries.length}
        />
        <StatBox icon={<GiBookCover size={48} />} label="READ" value={0} />
        <StatBox icon={<GiHearts size={48} />} label="FAVOURITES" value={0} />
        <StatBox
          icon={<GiBookmarklet size={48} />}
          label="WISHLIST"
          value={0}
        />
      </div>

      {/* On My Shelf */}
      <div style={{ padding: "0 2rem" }}>
        <p
          style={{
            color: "#888",
            textTransform: "uppercase",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
          }}
        >
          On My Shelf
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {ownedCards.map(({ edition, comic, serie }) => (
            <ShelfCard
              key={edition.id}
              edition={edition}
              comic={comic}
              serie={serie}
            />
          ))}
          {ownedCards.length === 0 && (
            <p style={{ color: "#555" }}>No owned editions yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div
      style={{
        border: "solid",
        borderRadius: "1rem",
        padding: "2rem",
        flex: 1,
        color: "#d4a520",
      }}
    >
      {icon}
      <h2>{value}</h2>
      <p style={{ margin: 0, fontSize: "0.8rem", color: "#888" }}>{label}</p>
    </div>
  );
}

function ShelfCard({ edition, comic, serie }) {
  const cover = edition.imgURLs?.[0];
  const conditionColor =
    {
      Mint: "#4caf50",
      Good: "#d4a520",
      Worn: "#ff9800",
      Damaged: "#f44336",
    }[edition.condition] ?? "#555";

  return (
    <div
      style={{
        width: "140px",
        background: "#1a1a1a",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #333",
      }}
    >
      {cover ? (
        <img
          src={cover}
          alt={comic?.title}
          style={{ width: "100%", height: "180px", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "180px",
            background: "#2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#555",
          }}
        >
          No image
        </div>
      )}
      <div style={{ padding: "0.5rem" }}>
        {edition.condition && (
          <span
            style={{
              fontSize: "0.7rem",
              color: conditionColor,
              fontWeight: "bold",
            }}
          >
            {edition.condition}
          </span>
        )}
        <p style={{ margin: 0, fontSize: "0.75rem", color: "#888" }}>
          {serie?.title}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {comic?.title}
        </p>
        <p style={{ margin: 0, fontSize: "0.75rem", color: "#888" }}>
          #{comic?.bookNumber}
        </p>
      </div>
    </div>
  );
}
