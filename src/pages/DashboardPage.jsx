import { useAuth } from "../context/AuthContext.jsx";
import {
  GiBackup,
  GiBatMask,
  GiBlackBook,
  GiPapers,
  GiFlexibleLamp,
  GiPhotoCamera,
  GiShintoShrine,
  GiWireframeGlobe,
  GiBookshelf,
  GiCardJoker,
  GiInfinity,
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
      <h2 className="mb-4">Dashboard</h2>

      <div className="row g-3 mb-4">
        {STAT_META.map(({ key, label, Icon }) => (
          <div className="col-6 col-md-4 col-lg-3" key={key}>
            <div className="card h-100 text-center p-3">
              <Icon size={36} color="#d4a520" className="mb-2 mx-auto" />
              <div className="fs-2 fw-bold">{values[key]}</div>
              <div className="text-muted">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-3">
        <h5 className="mb-3">Data completeness</h5>
        {health.map(({ label, done, total }) => {
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          return (
            <div className="mb-3" key={label}>
              <div className="d-flex justify-content-between">
                <span>{label}</span>
                <span className="text-muted">
                  {done} / {total} ({pct}%)
                </span>
              </div>
              <div className="progress" style={{ height: "12px" }}>
                <div
                  className="progress-bar"
                  style={{ width: `${pct}%`, background: "#d4a520" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
