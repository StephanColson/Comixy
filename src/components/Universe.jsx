import { Section } from "./Section.jsx";
import { Row } from "react-bootstrap";

function Universe(props) {
  const { universe, onSelect } = props;

  return (
    <>
      <div>
        <ul>
          <li onClick={() => onSelect(universe)}>
            <span className="fs-4 pop-effect" role="button">
              {universe.title}
            </span>
          </li>
        </ul>
      </div>
    </>
  );
}

export function Universes(props) {
  const { universes, onSelectUniverse } = props;

  return (
    <>
      <Section>
        <Row className="mt-2  animation-list">
          {universes?.map((un) => (
            <div key={un.id}>
              <Universe universe={un} onSelect={onSelectUniverse} />
            </div>
          ))}
        </Row>
      </Section>
    </>
  );
}
