import { useState } from "react";
import { Button } from "react-bootstrap";
import { Section } from "../components/Section.jsx";
import { Editions } from "../components/Editions.jsx";
import { EditEditionModal } from "../components/EditEditionModal.jsx";

export function CompendiumPage(props) {
  const {
    compendium,
    allCompendiums,
    editions,
    comics,
    series,
    universes,
    organizations,
    roles,
    peoples,
    comicContributors,
    onDeleteEdition,
    onSelectCompendium,
    onSelectPublisher,
    onSelectPerson,
    onSelectComic,
    onSelectSerie,
  } = props;

  const [editingEdition, setEditingEdition] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  if (!compendium) return <div>No Collection Selected</div>;

  function handleEditEdition(edition) {
    setEditingEdition(edition);
    setShowEditModal(true);
  }

  const compendiumEditions = editions
    ?.filter((ed) => ed.compendiumID === compendium.id)
    .map((ed) => {
      const publisher = organizations?.find(
        (org) => org.id === ed.organizationID,
      );

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

      const comic = comics?.find((c) => c.id === ed.comicID);
      const serie = series?.find((s) => s.id === comic?.serieID);

      return {
        ...ed,
        publisherDisplay: publisher?.name || "Unknown",
        displayContributors: contributors || [],
        compendiumTitle: compendium.title,
        spine: ed.spine ?? null,
        comicTitle: comic?.title ?? null,
        serieTitle: serie?.title ?? null,
        serieID: serie?.id ?? null,
      };
    })
    .sort((a, b) => {
      const numA = a.numberInCollection ?? "";
      const numB = b.numberInCollection ?? "";
      // no number set → push to the end, regardless of sort direction
      if (!numA && !numB) return 0;
      if (!numA) return 1;
      if (!numB) return -1;
      const result = numA.localeCompare(numB, undefined, { numeric: true });
      return sortOrder === "asc" ? result : -result;
    });

  const editingComic = editingEdition
    ? comics?.find((c) => c.id === editingEdition.comicID)
    : null;

  return (
    <>
      <Section className="text-center mb-3">
        <h2 className="text-center">{compendium.title}</h2>
        {compendium.description && (
          <p className="text-muted fst-italic">{compendium.description}</p>
        )}
      </Section>

      <div className="d-flex justify-content-center mb-3">
        <Button
          variant="outline-warning"
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          Collection Nr.: {sortOrder === "asc" ? "Low → High" : "High → Low"}
        </Button>
      </div>

      <Editions
        editions={compendiumEditions}
        onEditEdition={handleEditEdition}
        onDeleteEdition={onDeleteEdition}
        onSelectCompendium={onSelectCompendium}
        onSelectPublisher={onSelectPublisher}
        onSelectPerson={onSelectPerson}
        onSelectComic={onSelectComic}
        onSelectSerie={onSelectSerie}
      />

      {showEditModal && (
        <EditEditionModal
          edition={editingEdition}
          editions={editions}
          universes={universes}
          comic={editingComic}
          series={series}
          compendium={allCompendiums}
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
