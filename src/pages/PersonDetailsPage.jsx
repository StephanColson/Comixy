import { Section } from "../components/Section.jsx";
import { Editions } from "../components/Editions.jsx";

export function PersonDetailsPage(props) {
  const {
    person,
    editions,
    comicContributors,
    roles,
    onEditEdition,
    onSelectCompendium,
    onSelectPublisher,
    organizations,
    compendium,
  } = props;

  const personContributions =
    comicContributors?.filter((cc) => cc.peopleID === person.id) ?? [];
  const uniqueEditionIDs = [
    ...new Set(personContributions.map((cc) => cc.editionID)),
  ];

  const personEditions = uniqueEditionIDs
    .map((editionID) => {
      const edition = editions?.find((ed) => ed.id === editionID);
      if (!edition) return null;

      const personRoles = personContributions
        .filter((cc) => cc.editionID === editionID)
        .map((cc) => {
          const role = roles?.find((r) => r.id === cc.roleID);
          return role?.type ?? "Unknown";
        });

      const publisher = organizations?.find(
        (org) => org.id === edition.organizationID,
      );
      const collection = compendium?.find((c) => c.id === edition.compendiumID);

      return {
        ...edition,
        publisherDisplay: publisher?.name || "Unknown",
        compendiumTitle: collection?.title ?? null,
        displayContributors: personRoles.map((role) => ({
          peopleName: person.name,
          roleName: role,
        })),
      };
    })
    .filter(Boolean);

  return (
    <>
      <Section>
        <h2 className="text-center">{person.name}</h2>
      </Section>

      {personEditions.length === 0 ? (
        <div className="text-center mt-3">No editions found</div>
      ) : (
        <Editions
          editions={personEditions}
          onEditEdition={onEditEdition}
          onSelectCompendium={onSelectCompendium}
          onSelectPublisher={onSelectPublisher}
        />
      )}
    </>
  );
}
