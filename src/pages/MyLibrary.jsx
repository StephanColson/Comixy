// src/pages/MyLibrary.jsx
import { useEffect, useState } from "react";
import {
  GiBookshelf,
  GiBookmarklet,
  GiBookCover,
  GiHearts,
} from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import {
  getUserOwnedEditions,
  getUserRead,
  getUserFavourites,
  getUserWishlist,
  setUserLibraryEntry,
  useEditionCollectionData,
} from "../api/editionInfo";
import { useComicCollectionData } from "../api/comicInfo";
import { useSerieCollectionData } from "../api/serieInfo";

export const conditions = [
  { value: "New", label: "New", color: "#4caf50" },
  { value: "Mint", label: "Mint", color: "#8bc34a" },
  { value: "Very Good", label: "Very Good", color: "#d4a520" },
  { value: "Good", label: "Good", color: "#ff9800" },
  { value: "Fair", label: "Fair", color: "#ff5722" },
  { value: "Poor", label: "Poor", color: "#f44336" },
];

const condition_colour = Object.fromEntries(
  conditions.map(({ value, color }) => [value, color]),
);

const TABS = [
  { key: "owned", label: "On My Shelf", icon: <GiBookshelf size={16} /> },
  { key: "read", label: "Read", icon: <GiBookCover size={16} /> },
  { key: "favourites", label: "Favourites", icon: <GiHearts size={16} /> },
  { key: "wishlist", label: "Wishlist", icon: <GiBookmarklet size={16} /> },
];

export function MyLibraryPage({ onCardClick }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    Promise.all([
      getUserOwnedEditions(currentUser.uid).then(setOwnedEntries),
      getUserRead(currentUser.uid).then(setReadEntries),
      getUserFavourites(currentUser.uid).then(setFavouriteEntries),
      getUserWishlist(currentUser.uid).then(setWishlistEntries),
    ]).then(() => setLoading(false));
  }, [currentUser]);

  const { editions } = useEditionCollectionData();
  const { comics } = useComicCollectionData();
  const { series } = useSerieCollectionData();

  const [ownedEntries, setOwnedEntries] = useState([]);
  const [readEntries, setReadEntries] = useState([]);
  const [favouriteEntries, setFavouriteEntries] = useState([]);
  const [wishlistEntries, setWishlistEntries] = useState([]);

  const [activeTab, setActiveTab] = useState("owned");
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState("all");

  const collectionsReady = !!editions && !!comics && !!series;
  const isLoading = loading || !collectionsReady;

  function buildCards(entries) {
    return entries
      .map((entry) => {
        const edition = editions?.find((e) => e.id === entry.editionId);
        if (!edition) return null;
        const comic = comics?.find((c) => c.id === edition.comicID);
        const serie = series?.find((s) => s.id === comic?.serieID);
        return { edition, comic, serie, entry };
      })
      .filter(Boolean);
  }

  const ownedCards = buildCards(ownedEntries);
  const readCards = buildCards(readEntries);
  const favouriteCards = buildCards(favouriteEntries);
  const wishlistCards = buildCards(wishlistEntries);

  const counts = {
    owned: ownedEntries.length,
    read: readEntries.length,
    favourites: favouriteEntries.length,
    wishlist: wishlistEntries.length,
  };

  function getActiveCards() {
    switch (activeTab) {
      case "owned":
        return ownedCards;
      case "read":
        return readCards;
      case "favourites":
        return favouriteCards;
      case "wishlist":
        return wishlistCards;
      default:
        return [];
    }
  }

  function applyFilters(cards) {
    let filtered = cards;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ({ comic, serie, edition }) =>
          comic?.title?.toLowerCase().includes(q) ||
          serie?.title?.toLowerCase().includes(q) ||
          edition?.format?.toLowerCase().includes(q),
      );
    }
    if (conditionFilter !== "all") {
      filtered = filtered.filter(
        ({ edition }) => edition.condition === conditionFilter,
      );
    }
    return filtered;
  }

  const activeCards = applyFilters(getActiveCards());
  const isWishlist = activeTab === "wishlist";

  const serieProgress =
    series
      ?.map((serie) => {
        const serieComics = comics?.filter((c) => c.serieID === serie.id) ?? [];
        if (serieComics.length === 0) return null;
        const ownedComicIDs = new Set(
          ownedEntries
            .map((entry) => {
              const edition = editions?.find((e) => e.id === entry.editionId);
              return edition?.comicID ?? null;
            })
            .filter(Boolean),
        );
        const ownedCount = serieComics.filter((c) =>
          ownedComicIDs.has(c.id),
        ).length;
        if (ownedCount === 0) return null;
        return { serie, ownedCount, totalCount: serieComics.length };
      })
      .filter(Boolean) ?? [];

  return (
    <>
      <div className="text-center" style={{ color: "#d4a520" }}>
        <h1>My Library</h1>
        <p style={{ color: "#888" }}>
          Personal collection of {currentUser?.displayName}
        </p>
      </div>

      {/* Stat boxes / tab switchers */}
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
        {TABS.map((tab) => (
          <StatBox
            key={tab.key}
            icon={tab.icon}
            label={tab.label.toUpperCase()}
            value={counts[tab.key]}
            active={activeTab === tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setConditionFilter("all");
              setSearchQuery("");
            }}
          />
        ))}
      </div>

      {/* Serie progress — owned tab only */}
      {activeTab === "owned" && serieProgress.length > 0 && (
        <>
          <p
            style={{
              color: "#888",
              textTransform: "uppercase",
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              padding: "0 2rem",
            }}
          >
            Serie Progress
          </p>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              paddingRight: "0.5rem",
            }}
          >
            <div style={{ padding: "0 2rem", marginTop: "0.4rem" }}>
              {serieProgress.map(({ serie, ownedCount, totalCount }) => {
                const pct = (ownedCount / totalCount) * 100;
                const barColor = pct === 100 ? "#4caf50" : "#d4a520";
                return (
                  <div
                    key={serie.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        width: "150px",
                        color: "#fff",
                        fontSize: "0.9rem",
                        flexShrink: 0,
                      }}
                    >
                      {serie.title}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        background: "#2a2a2a",
                        borderRadius: "4px",
                        height: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          background: barColor,
                          height: "100%",
                          borderRadius: "4px",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "#888",
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      {ownedCount} / {totalCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "1.5rem 2rem 0.75rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search title, serie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "6px",
            color: "#fff",
            padding: "0.4rem 0.75rem",
            fontSize: "0.85rem",
            flex: "1",
            minWidth: "160px",
            outline: "none",
          }}
        />

        {/* Condition dropdown — only relevant on owned tab */}
        {activeTab === "owned" && (
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "6px",
              color:
                conditionFilter === "all"
                  ? "#888"
                  : (condition_colour[conditionFilter] ?? "#fff"),
              padding: "0.4rem 0.75rem",
              fontSize: "0.85rem",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="all">All conditions</option>
            {conditions.map((c) => (
              <option key={c.value} value={c.value} style={{ color: c.color }}>
                {c.label}
              </option>
            ))}
          </select>
        )}

        <span style={{ color: "#555", fontSize: "0.8rem", marginLeft: "auto" }}>
          {activeCards.length} result{activeCards.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Cards */}
      <div style={{ padding: "0 2rem 2rem" }}>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "0.5rem",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : activeCards.length === 0 ? (
          <p style={{ color: "#555", marginTop: "1rem" }}>
            {getActiveCards().length === 0
              ? `Nothing in ${TABS.find((t) => t.key === activeTab)?.label ?? activeTab} yet.`
              : "No results match your filters."}
          </p>
        ) : isWishlist ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginTop: "0.5rem",
            }}
          >
            {activeCards.map(({ edition, comic, serie, entry }) => (
              <WishlistCard
                key={edition.id}
                edition={edition}
                comic={comic}
                serie={serie}
                onCardClick={onCardClick ? () => onCardClick(comic?.id) : null}
                onMarkOwned={async () => {
                  await setUserLibraryEntry(edition.id, currentUser.uid, {
                    ...entry,
                    owned: true,
                    wishlist: false,
                  });
                  getUserWishlist(currentUser.uid).then(setWishlistEntries);
                  getUserOwnedEditions(currentUser.uid).then(setOwnedEntries);
                }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "0.5rem",
            }}
          >
            {activeCards.map(({ edition, comic, serie }) => (
              <ShelfCard
                key={edition.id}
                edition={edition}
                comic={comic}
                serie={serie}
                onClick={onCardClick ? () => onCardClick(comic?.id) : null}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function StatBox({ icon, label, value, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: `1px solid ${active ? "#d4a520" : "#333"}`,
        borderRadius: "1rem",
        padding: "2rem",
        flex: 1,
        color: active ? "#d4a520" : "#888",
        cursor: "pointer",
        background: active ? "#1a1500" : "transparent",
        transition: "all 0.2s ease",
      }}
    >
      {icon}
      <h2
        style={{
          margin: "0.5rem 0 0.25rem",
          color: active ? "#d4a520" : "#fff",
        }}
      >
        {value}
      </h2>
      <p style={{ margin: 0, fontSize: "0.8rem" }}>{label}</p>
    </div>
  );
}

function ShelfCard({ edition, comic, serie, onClick }) {
  const cover = edition.imgURLs?.[0];
  const condition = edition.condition ?? null;
  const conditionColor = condition_colour[condition] ?? "#555";

  return (
    <div
      onClick={onClick}
      style={{
        width: "140px",
        background: "#1a1a1a",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #333",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.2s ease, transform 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (!onClick) return;
        e.currentTarget.style.borderColor = "#d4a520";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#333";
        e.currentTarget.style.transform = "translateY(0)";
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
        {condition && (
          <span
            style={{
              display: "inline-block",
              padding: "0.1rem 0.5rem",
              borderRadius: "999px",
              border: `1px solid ${conditionColor}`,
              fontSize: "0.7rem",
              color: conditionColor,
              fontWeight: "bold",
              marginBottom: "0.25rem",
            }}
          >
            {condition}
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

function WishlistCard({ edition, comic, serie, onMarkOwned, onCardClick }) {
  const cover = edition.imgURLs?.[0];
  return (
    <div
      onClick={onCardClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        background: "#1a1a1a",
        borderRadius: "8px",
        padding: "0.75rem",
        border: "1px solid #333",
        cursor: onCardClick ? "pointer" : "default",
        transition: "border-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (onCardClick) e.currentTarget.style.borderColor = "#d4a520";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#333";
      }}
    >
      {cover ? (
        <img
          src={cover}
          alt={comic?.title}
          style={{
            width: "50px",
            height: "65px",
            objectFit: "cover",
            borderRadius: "4px",
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: "50px",
            height: "65px",
            background: "#2a2a2a",
            borderRadius: "4px",
            flexShrink: 0,
          }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.75rem",
            color: "#888",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {serie?.title}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "#fff",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {comic?.title}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMarkOwned();
        }}
        style={{
          background: "none",
          border: "1px solid #d4a520",
          color: "#d4a520",
          borderRadius: "6px",
          padding: "0.3rem 0.6rem",
          fontSize: "0.8rem",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        Mark owned
      </button>
    </div>
  );
}

function SkeletonCard() {
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
      <div
        style={{
          width: "100%",
          height: "180px",
          background:
            "linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }}
      />
      <div
        style={{
          padding: "0.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
        }}
      >
        <div
          style={{
            height: "10px",
            width: "60%",
            borderRadius: "4px",
            background: "#2a2a2a",
            animation: "shimmer 1.4s infinite",
            backgroundSize: "200% 100%",
            backgroundImage:
              "linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%)",
          }}
        />
        <div
          style={{
            height: "12px",
            width: "90%",
            borderRadius: "4px",
            background: "#2a2a2a",
            animation: "shimmer 1.4s infinite",
            backgroundSize: "200% 100%",
            backgroundImage:
              "linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%)",
          }}
        />
        <div
          style={{
            height: "10px",
            width: "40%",
            borderRadius: "4px",
            background: "#2a2a2a",
            animation: "shimmer 1.4s infinite",
            backgroundSize: "200% 100%",
            backgroundImage:
              "linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%)",
          }}
        />
      </div>
    </div>
  );
}
