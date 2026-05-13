import { Section } from "../components/Section.jsx";
import { Editions } from "../components/Editions.jsx";

export function PublisherDetailsPage(props) {
  const { publisher, editions, onEditEdition, onSelectCompendium } = props;

  const publisherEditions =
    editions?.filter((ed) => ed.organizationID === publisher.id) ?? [];

  return (
    <>
      <Section>
        <h2 className="text-center">{publisher.name}</h2>
      </Section>

      <Editions
        editions={publisherEditions}
        onEditEdition={onEditEdition}
        onSelectCompendium={onSelectCompendium}
      />
    </>
  );
}
