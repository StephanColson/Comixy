import {
  GiBookshelf,
  GiBookmarklet,
  GiBookCover,
  GiHearts,
} from "react-icons/gi";

export function MyLibraryPage() {
  return (
    <>
      <div className="text-center" style={{ color: "#d4a520" }}>
        <h1>My Library</h1>
      </div>
      <div>
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
          <div
            style={{
              border: "solid",
              borderRadius: "1rem",
              padding: "2rem",
              flex: 1,
              color: "#d4a520",
            }}
          >
            <GiBookshelf size={48} />
            <h2>Owned</h2>
          </div>

          <div
            style={{
              border: "solid",
              borderRadius: "1rem",
              padding: "2rem",
              flex: 1,
              color: "#d4a520",
            }}
          >
            <GiBookCover size={48} />
            <h2>Read</h2>
          </div>

          <div
            style={{
              border: "solid",
              borderRadius: "1rem",
              padding: "2rem",
              flex: 1,
              color: "#d4a520",
            }}
          >
            <GiBookmarklet size={48} />
            <h2>Wishlist</h2>
          </div>

          <div
            style={{
              border: "solid",
              borderRadius: "1rem",
              padding: "2rem",
              flex: 1,
              color: "#d4a520",
            }}
          >
            <GiHearts size={48} />
            <h2>Favorites</h2>
          </div>
        </div>
      </div>
    </>
  );
}
