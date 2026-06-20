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

export function MyLibraryPage() {
  const { currentUser } = useAuth();
  const { editions } = useEditionCollectionData();
  const { comics } = useComicCollectionData();
  const { series } = useSerieCollectionData();

  const [ownedEntries, setOwnedEntries] = useState([]);
  const [readEntries, setReadEntries] = useState([]);
  const [favouriteEntries, setFavouriteEntries] = useState([]);
  const [wishlistEntries, setWishlistEntries] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    getUserOwnedEditions(currentUser.uid).then(setOwnedEntries);
    getUserRead(currentUser.uid).then(setReadEntries);
    getUserFavourites(currentUser.uid).then(setFavouriteEntries);
    getUserWishlist(currentUser.uid).then(setWishlistEntries);
  }, [currentUser]);

  const ownedCards = ownedEntries
    .map((entry) => {
      const edition = editions?.find((e) => e.id === entry.editionId);
      if (!edition) return null;
      const comic = comics?.find((c) => c.id === edition.comicID);
      const serie = series?.find((s) => s.id === comic?.serieID);
      return { edition, comic, serie, entry };
    })
    .filter(Boolean);

  const wishlistCards = wishlistEntries
    .map((entry) => {
      const edition = editions?.find((e) => e.id === entry.editionId);
      if (!edition) return null;
      const comic = comics?.find((c) => c.id === edition.comicID);
      const serie = series?.find((s) => s.id === comic?.serieID);
      return { edition, comic, serie, entry };
    })
    .filter(Boolean);

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
        <StatBox
          icon={<GiBookCover size={48} />}
          label="READ"
          value={readEntries.length}
        />
        <StatBox
          icon={<GiHearts size={48} />}
          label="FAVOURITES"
          value={favouriteEntries.length}
        />
        <StatBox
          icon={<GiBookmarklet size={48} />}
          label="WISHLIST"
          value={wishlistEntries.length}
        />
      </div>

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

      <p
        style={{
          color: "#888",
          textTransform: "uppercase",
          fontSize: "0.8rem",
          letterSpacing: "0.1em",
          padding: "0 2rem",
          marginTop: "2rem",
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
        {serieProgress.length > 0 && (
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
        )}
      </div>

      {wishlistCards.length > 0 && (
        <div style={{ padding: "0 2rem", marginTop: "2rem" }}>
          <p
            style={{
              color: "#888",
              textTransform: "uppercase",
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
            }}
          >
            Wishlist
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {wishlistCards.map(({ edition, comic, serie, entry }) => (
              <WishlistCard
                key={edition.id}
                edition={edition}
                comic={comic}
                serie={serie}
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
        </div>
      )}
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
  const condition = edition.condition ?? null;
  const conditionColor = condition_colour[condition] ?? "#555";

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

function WishlistCard({ edition, comic, serie, onMarkOwned }) {
  const cover = edition.imgURLs?.[0];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        background: "#1a1a1a",
        borderRadius: "8px",
        padding: "0.75rem",
        border: "1px solid #333",
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
        onClick={onMarkOwned}
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
