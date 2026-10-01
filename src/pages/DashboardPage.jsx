import { useAuth } from "../context/AuthContext.jsx";
import {
  GiBatMask,
  GiBlackBook,
  GiFlexibleLamp,
  GiPhotoCamera,
  GiCardJoker,
  GiSpiderWeb,
  GiDeathStar,
} from "react-icons/gi";

const STAT_META = [
  { key: "comics", label: "Comics", Icon: GiBlackBook },
  { key: "editions", label: "Editions", Icon: GiCardJoker },
  { key: "series", label: "Series", Icon: GiSpiderWeb },
  { key: "universes", label: "Universes", Icon: GiDeathStar },
  { key: "images", label: "Images", Icon: GiPhotoCamera },
  { key: "peoples", label: "People", Icon: GiBatMask },
  { key: "publishers", label: "Publishers", Icon: GiFlexibleLamp },
];

export function DashboardPage({
  comics,
  editions,
  series,
  universes,
  peoples,
  organizations,
}) {
  const { role } = useAuth();

  if (role !== "admin" && role !== "mod") {
    return (
      <p className="text-center mt-5">You don't have access to this page.</p>
    );
  }

  const loading = [
    comics,
    editions,
    series,
    universes,
    peoples,
    organizations,
  ].some((list) => list === undefined);
  if (loading) return <div className="text-center mt-5">Loading...</div>;

  const values = {
    comics: comics.length,
    editions: editions.length,
    series: series.length,
    universes: universes.length,
    images: editions.reduce((sum, e) => sum + (e.imgURLs?.length ?? 0), 0),
    peoples: peoples.length,
    publishers: organizations.length,
  };

  const comicIDsWithEdition = new Set(editions.map((e) => e.comicID));
  const serieIDsWithComic = new Set(comics.map((c) => c.serieID));

  const health = [
    {
      label: "Editions with cover",
      done: editions.filter((e) => e.imgURLs?.length > 0).length,
      total: editions.length,
    },
    {
      label: "Comics with an edition",
      done: comics.filter((c) => comicIDsWithEdition.has(c.id)).length,
      total: comics.length,
    },
    {
      label: "Series with comics",
      done: series.filter((s) => serieIDsWithComic.has(s.id)).length,
      total: series.length,
    },
  ];

  return (
    <div className="container py-4">
      <div className="text-center mb-4" style={{ color: "#d4a520" }}>
        <h1>Dashboard</h1>
        <p style={{ color: "#888" }}>Overview of the catalog</p>
      </div>

      <div className="row g-3 mb-4">
        {STAT_META.map(({ key, label, Icon }) => (
          <div className="col-6 col-md-4 col-lg-3" key={key}>
            <div
              className="h-100 text-center"
              style={{
                border: "1px solid #d4a520",
                borderRadius: "1rem",
                padding: "1.5rem",
                color: "#d4a520",
                background: "#1a1500",
              }}
            >
              <Icon size={36} color="#d4a520" className="mx-auto" />
              <h2 style={{ margin: "0.5rem 0 0.25rem", color: "#d4a520" }}>
                {values[key]}
              </h2>
              <p style={{ margin: 0, fontSize: "0.8rem" }}>
                {label.toUpperCase()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          border: "1px solid #d4a520",
          borderRadius: "1rem",
          padding: "1.5rem",
          background: "#1a1500",
        }}
      >
        <p
          style={{
            color: "#d4a520",
            textTransform: "uppercase",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            marginBottom: "1rem",
          }}
        >
          Data completeness
        </p>
        {health.map(({ label, done, total }) => {
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          const barColor = pct === 100 ? "#4caf50" : "#d4a520";
          return (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  width: "180px",
                  color: "#d4a520",
                  fontSize: "0.9rem",
                  flexShrink: 0,
                }}
              >
                {label}
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
                  color: "#d4a520",
                  fontSize: "0.85rem",
                  flexShrink: 0,
                  width: "110px",
                  textAlign: "right",
                }}
              >
                {done} / {total} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
