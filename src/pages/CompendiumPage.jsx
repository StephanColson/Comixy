import { Section } from "../components/Section.jsx";
import { Editions } from "../components/Editions.jsx";

export function CompendiumPage(props) {
  const {
    compendium,
    editions,
    onEditEdition,
    comics,
    series,
    organizations,
    roles,
    peoples,
    comicContributors,
  } = props;

  const compendiumEditions =
    editions?.filter((ed) => ed.compendiumID === compendium.id) ?? [];

  return (
    <>
      <Section className="text-center mb-3">
        <h2 className="text-center">{compendium.title}</h2>
        {compendium.description && (
          <p className="text-muted fst-italic">{compendium.description}</p>
        )}
      </Section>

      <Editions editions={compendiumEditions} onEditEdition={onEditEdition} />
    </>
  );
}
