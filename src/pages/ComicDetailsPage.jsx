import { Editions } from "../components/Editions.jsx";
import { useState } from "react";
import { EditEditionModal } from "../components/EditEditionModal.jsx";
import { Button } from "react-bootstrap";
import { deleteEdition } from "../api/editionInfo.js";
import { useAppConfig } from "../api/appConfigInfo.js";

export function ComicDetailsPage(props) {
  const {
    comic,
    organizations,
    peoples,
    roles,
    comicContributors,
    editions,
    series,
    onAddEditions,
    compendium,
    selectedSerie,
    onSelectCompendium,
    onSelectPublisher,
    onSelectPerson,
    universes,
  } = props;

  const [editingEdition, setEditingEdition] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  const { config } = useAppConfig();
  const bannerURL = config?.comicDetailsBannerURL;

  if (!comic) return <div>No Comic Selected</div>;

  function handleEditEdition(edition) {
    setEditingEdition(edition);
    setShowEditModal(true);
  }

  const comicEditions = editions
    ?.filter((ed) => ed.comicID === comic.id)
    .map((ed) => {
      const publisherDisplays = (ed.organizationIDs ?? [])
        .map((id) => organizations?.find((org) => org.id === id))
        .filter(Boolean)
        .map((org) => ({ id: org.id, name: org.name }));

      const compendiumDisplays = (ed.compendiumIDs ?? [])
        .map((id) => compendium?.find((c) => c.id === id))
        .filter(Boolean)
        .map((c) => ({ id: c.id, title: c.title }));

      const contributors = comicContributors
        ?.filter((cc) => cc.editionID === ed.id)
        .map((cc) => {
          const person = peoples?.find((p) => p.id === cc.peopleID);
          const role = roles?.find((r) => r.id === cc.roleID);

          return {
            peopleName: person?.name || "Unknown",
            roleName: role?.type || "Unknown",
            peopleID: cc.peopleID,
          };
        });

      return {
        ...ed,
        publisherDisplays,
        displayContributors: contributors || [],
        compendiumDisplays,
        spine: ed.spine ?? null,
      };
    })
    .sort((a, b) => {
      const yearA = a.printYear ?? 0;
      const yearB = b.printYear ?? 0;
      return sortOrder === "oldest" ? yearA - yearB : yearB - yearA;
    });

  return (
    <>
      <div
        style={{
          position: "relative",
          borderRadius: "12px",
          overflow: "hidden",
          margin: "0 1.5rem 1.5rem",
          borderLeft: "4px solid #d4a520",
        }}
      >
        {bannerURL ? (
          <img
            src={bannerURL}
            alt=""
            style={{
              width: "100%",
              height: "320px",
              objectFit: "cover",
              objectPosition: "60% 25%",
              display: "block",
            }}
          />
        ) : (
          <div style={{ minHeight: "320px", background: "#1a1a1a" }} />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.2) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "1.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "0.4rem",
          }}
        >
          <div style={{ color: "#888", fontSize: "0.85rem" }}>
            {selectedSerie?.title} / Book {comic.bookNumber} / {comic.title}
          </div>

          <h2 style={{ color: "#fff", margin: 0 }}>
            {selectedSerie?.title}: {comic.bookNumber} {comic.title}
          </h2>

          <div className="d-flex align-items-center gap-2 mt-2">
            <Button
              onClick={() => onAddEditions(comic)}
              className="btn btn-warning"
            >
              Add Editions
            </Button>
            <Button
              variant="outline-warning"
              onClick={() =>
                setSortOrder((prev) =>
                  prev === "newest" ? "oldest" : "newest",
                )
              }
            >
              {sortOrder === "newest" ? "Newest → Oldest" : "Oldest → Newest"}
            </Button>
          </div>
        </div>
      </div>

      <div className="comic-editions-wide" style={{ margin: "0 1.5rem" }}>
        <Editions
          editions={comicEditions}
          onEditEdition={handleEditEdition}
          onSelectCompendium={onSelectCompendium}
          onSelectPublisher={onSelectPublisher}
          onSelectPerson={onSelectPerson}
          onDeleteEdition={async (edition) => {
            await deleteEdition(edition, comicContributors);
          }}
        />
      </div>

      {showEditModal && (
        <EditEditionModal
          edition={editingEdition}
          editions={editions}
          universes={universes}
          comic={comic}
          series={series}
          compendium={compendium}
          organizations={organizations}
          peoples={peoples}
          roles={roles}
          comicContributors={comicContributors}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
