import {Section} from "./Section.jsx";
import FlipMove from "react-flip-move";
import {Row} from "react-bootstrap";

function Serie(props){
    const {serie, onSelect} = props;

    return <>
        <div>
            <ul>
                <li onClick={() => onSelect(serie)}>
                    <h3 className="fs-4">{serie.title}</h3>
                </li>
            </ul>
        </div>
    </>
}

export function Series(props){
    const {series, onSelectSerie} = props;

    return <>
        <Section>
            <FlipMove typeName={Row} className="mt-2">
                {series?.map(s => <div key={s.id}>
                    <Serie serie={s} onSelect={onSelectSerie}/>
                </div>)}
            </FlipMove>
        </Section>
    </>
}