import { Section } from "./Section.jsx";
import FlipMove from "react-flip-move";
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
        <FlipMove typeName={Row} className="mt-2">
          {series?.map((s) => (
              <Serie key={s.id} serie={s} onSelect={onSelectSerie} />
          ))}
        </FlipMove>
      </Section>
    </>
  );
}
