import { Editions } from "../components/Editions.jsx";
import { useState } from "react";
import { EditEditionModal } from "../components/EditEditionModal.jsx";
import { Button } from "react-bootstrap";
import { deleteEdition } from "../api/editionInfo.js";

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
      <h2 className="text-center">
        {selectedSerie?.title}: {comic.title}
      </h2>
      <div className="d-flex justify-content-center align-items-center gap-2 my-3">
        <Button
          onClick={() => onAddEditions(comic)}
          className="btn btn-warning"
        >
          Add Editions
        </Button>
        <Button
          variant="outline-warning"
          onClick={() =>
            setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
          }
        >
          {sortOrder === "newest" ? "Newest → Oldest" : "Oldest → Newest"}
        </Button>
      </div>
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
