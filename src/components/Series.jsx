import {Section} from "./Section.jsx";
import FlipMove from "react-flip-move";
import {Row} from "react-bootstrap";

function Serie(props){
    const {serie} = props;

    return <>
        <div>
            <ul>
                <li>
                    <p>{serie.title}</p>
                </li>
            </ul>
        </div>
    </>
}

export function Series(props){
    const {series} = props;

    return <>
        <Section>
            <FlipMove typeName={Row}>
                {series.map(s => <div key={s.id}>
                    <Serie serie={s}/>
                </div>)}
            </FlipMove>
        </Section>
    </>
}