import {Section} from "./Section.jsx";
import FlipMove from "react-flip-move";
import {Row} from "react-bootstrap";

function Universe(props){
    const {universe, onSelect} = props;

    return <>
        <div>
            <ul>
                <li onClick={() => onSelect(universe)}>
                    <span className="fs-4 pop-effect" role="button">{universe.title}</span>
                </li>
            </ul>
        </div>
    </>
}

export function Universes(props){
    const {universes, onSelectUniverse} = props;

    return <>
        <Section>
            <FlipMove typeName={Row} className="mt-2">
                {universes?.map(un => <div key={s.id}>
                    <Universe universe={un} onSelect={onSelectUniverse}/>
                </div>)}
            </FlipMove>
        </Section>
    </>
}