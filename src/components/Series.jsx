import { Section } from "./Section.jsx";
import { Row } from "react-bootstrap";

function Serie(props) {
  const { serie, onSelect } = props;

  return (
    <>
      <div>
        <ul>
          <li onClick={() => onSelect(serie)}>
            <span className="fs-4 pop-effect" role="button">
              {serie.title}
            </span>
          </li>
        </ul>
      </div>
    </>
  );
}

export function Series(props) {
  const { series, onSelectSerie } = props;

  return (
    <>
      <Section>
        <Row className="mt-2 animation-list">
          {series?.map((s) => (
              <Serie key={s.id} serie={s} onSelect={onSelectSerie} />
          ))}
        </Row>
      </Section>
    </>
  );
}
